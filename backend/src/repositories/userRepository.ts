import { Collection, ObjectId } from 'mongodb';
import database from '../config/database';
import { User } from '../models/user';

class UserRepository {
  private getCollection(): Collection<User> {
    return database.getDb().collection<User>('users');
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.getCollection().findOne({ username });
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.getCollection().findOne({ _id: new ObjectId(id) as any });
    } catch {
      return null; // Invalid ObjectId format
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const result = await this.getCollection().insertOne(user as User);
    return {
      ...user,
      id: result.insertedId.toString(),
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.getCollection().find().toArray();
    return users.map(user => ({
      ...user,
      id: (user as any)._id.toString()
    }));
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.getCollection().deleteOne({ _id: new ObjectId(id) as any });
      return result.deletedCount === 1;
    } catch {
      return false;
    }
  }
}

export default new UserRepository();
