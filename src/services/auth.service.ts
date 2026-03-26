import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../types/models';

const userRepository = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class AuthService {
  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    const existingEmail = await userRepository.findByEmail(userData.email!);
    if (existingEmail) {
      throw { status: 400, message: 'Email already in use' };
    }

    const existingUsername = await userRepository.findByUsername(userData.username!);
    if (existingUsername) {
      throw { status: 400, message: 'Username already in use' };
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);
    delete user.password;
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const token = this.generateToken(user.id);
    delete user.password;
    return { user, token };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}
