import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/analyticsService';
import { AnalyticsRepository } from '../repositories/analyticsRepository';
import database from '../config/database';
import { ObjectId } from 'mongodb';

// Initialize AnalyticsService for logging
let analyticsService: AnalyticsService;
function getAnalyticsService(): AnalyticsService {
  if (!analyticsService) {
    const db = database.getDb();
    analyticsService = new AnalyticsService(new AnalyticsRepository(db));
  }
  return analyticsService;
}

function getUsersCollection() {
  return database.getDb().collection<User>('users');
}

export class UserController {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const collection = getUsersCollection();
      const users = await collection.find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).toArray();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user (Admin only)
   */
  async createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        res.status(400).json({ error: 'Username, password, and role are required' });
        return;
      }

      if (role !== 'admin' && role !== 'user') {
        res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' });
        return;
      }

      const collection = getUsersCollection();

      // Check if user already exists
      const existingUser = await collection.findOne({ username });
      if (existingUser) {
        res.status(409).json({ error: 'Username already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser: User = {
        username,
        passwordHash,
        role,
        createdAt: new Date()
      };
      
      const insertResult = await collection.insertOne(newUser);
      newUser._id = insertResult.insertedId;

      // Log activity
      const authUser = req.user;
      if (authUser) {
        const sessionId = req.headers['x-session-id'] as string || 'unknown-session';
        await getAnalyticsService().logActivity({
          userId: authUser.userId,
          sessionId,
          activityType: 'create_user',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { createdUsername: username, createdRole: role }
        });
      }

      // Return user without password hash
      const userResponse = { ...newUser } as any;
      delete userResponse.passwordHash;

      res.status(201).json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a user (Admin only)
   */
  async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const collection = getUsersCollection();
      const userToDelete = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!userToDelete) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Don't allow the admin to delete themselves
      if (req.user && req.user.userId === id) {
        res.status(400).json({ error: 'You cannot delete your own account' });
        return;
      }

      await collection.deleteOne({ _id: new ObjectId(id) });

      // Log activity
      const authUser = req.user;
      if (authUser) {
        const sessionId = req.headers['x-session-id'] as string || 'unknown-session';
        await getAnalyticsService().logActivity({
          userId: authUser.userId,
          sessionId,
          activityType: 'delete_user',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { deletedUsername: userToDelete.username }
        });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
