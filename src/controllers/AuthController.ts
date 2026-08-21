import { Application, Request, Response } from 'express';
import { JwtService } from '../services/JwtService';

// Base de données simulée pour les utilisateurs
// ⚠️ À remplacer par votre vraie base de données
const users: any[] = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'admin123', // ⚠️ En production, utilisez bcrypt pour hasher
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

  // POST /auth/login - Se connecter et obtenir un token
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Vérifier si email et password sont fournis
      if (!email || !password) {
        res.status(400).json({ error: 'Email et mot de passe requis' });
        return;
      }

      // Trouver l'utilisateur
      const user = users.find(u => u.email === email);
      if (!user) {
        res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        return;
      }

      // Vérifier le mot de passe
      if (user.password !== password) {
        res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        return;
      }

      // 🔑 Générer le token JWT avec id, email et role
      const token = this.jwtService.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Retourner le token et les infos utilisateur
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
