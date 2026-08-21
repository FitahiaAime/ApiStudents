import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';

const jwtService = new JwtService();

// Étendre la requête pour y ajouter l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware d'authentification
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token manquant' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Middleware d'autorisation par rôle
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: `Rôle requis: ${roles.join(', ')}` });
      return;
    }

    next();
  };
};
