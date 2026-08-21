import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtPayload } from '../interfaces/Jwt.interface';

dotenv.config();

export class JwtService {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default_secret_change_this';
    this.expiresIn = process.env.JWT_EXPIRATION || '1d';
  }

  generateToken(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }
}
