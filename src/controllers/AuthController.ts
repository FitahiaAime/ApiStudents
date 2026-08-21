import { Application, Request, Response } from 'express';
import { JwtService } from '../services/JwtService';


const users: any[] = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    email: 'prof@test.com',
    password: 'prof123',
    role: 'professor'
  }
];

export class AuthController {
  private jwtService: JwtService;

  constructor(app: Application) {
    this.jwtService = new JwtService();
    this.registerRoutes(app);
  }

  private registerRoutes(app: Application): void {
    app.post('/auth/login', this.login.bind(this));
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email et mot de passe requis' });
        return;
      }

      
      const user = users.find(u => u.email === email);
      if (!user) {
        res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        return;
      }

      if (user.password !== password) {
        res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        return;
      }

      const token = this.jwtService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token: token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }
}
