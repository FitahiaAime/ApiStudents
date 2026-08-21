import { JwtPayload, TokenPair } from "./Jwt.interface";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};