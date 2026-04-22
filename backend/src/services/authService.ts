import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

interface AuthToken {
  token: string;
  expiresIn: string;
  role: 'admin' | 'user';
  userId: string;
}

class AuthService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'pibit-cms-secret-key-change-in-production';
  }

  /**
   * Initialize initial admin user if no users exist
   */
  async initializeAdmin(): Promise<void> {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('No users found in database. Seeding initial admin from environment variables...');
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'pibit2026';
        
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        
        await User.create({
          username: adminUsername,
          passwordHash,
          role: 'admin',
        });
        
        console.log(`Initial admin user '${adminUsername}' created successfully.`);
      }
    } catch (error) {
      console.error('Failed to initialize admin user:', error);
    }
  }

  /**
   * Authenticate user with username, password, and role
   */
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const { username, password, role } = credentials;

    const user = await User.findOne({ username, role });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token with role and userId
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      expiresIn: '24h',
      role: user.role,
      userId: user._id.toString(),
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Check if authentication is enabled
   */
  isAuthEnabled(): boolean {
    return process.env.ENABLE_AUTH === 'true';
  }
}

export default new AuthService();
