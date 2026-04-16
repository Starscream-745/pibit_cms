import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

interface AuthToken {
  token: string;
  expiresIn: string;
  role: 'admin' | 'user';
}

class AuthService {
  private jwtSecret: string;
  private adminUsername: string;
  private adminPasswordHash: string;
  private userUsername: string;
  private userPasswordHash: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'pibit-cms-secret-key-change-in-production';
    
    // Admin credentials
    this.adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'pibit2026';
    this.adminPasswordHash = bcrypt.hashSync(adminPassword, 10);
    
    // User credentials
    this.userUsername = process.env.USER_USERNAME || 'user';
    const userPassword = process.env.USER_PASSWORD || 'user123';
    this.userPasswordHash = bcrypt.hashSync(userPassword, 10);
  }

  /**
   * Authenticate user with username, password, and role
   */
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const { username, password, role } = credentials;

    let isValid = false;
    let passwordHash = '';

    // Check based on role
    if (role === 'admin') {
      if (username === this.adminUsername) {
        passwordHash = this.adminPasswordHash;
        isValid = await bcrypt.compare(password, passwordHash);
      }
    } else if (role === 'user') {
      if (username === this.userUsername) {
        passwordHash = this.userPasswordHash;
        isValid = await bcrypt.compare(password, passwordHash);
      }
    }

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { username, role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      expiresIn: '24h',
      role,
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
