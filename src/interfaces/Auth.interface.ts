import { TokenPair } from "./Jwt.interface";
import { JwtPayload } from "./Jwt.interface";

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  tokens: TokenPair;
}

// Pour le service JWT
export interface IJwtService {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};