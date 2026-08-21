import express from 'express';
import { StudentController } from './controllers/StudentController';
import { AuthController } from './controllers/AuthController';

const app = express();
const port = 3000;

app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'API Students avec JWT',
    endpoints: {
      auth: {
        login: 'POST /auth/login'
      },
      students: {
        getAll: 'GET /etudiants',
        getById: 'GET /etudiants/:id',
        create: 'POST /etudiants (protégé)',
        update: 'PUT /etudiants/:id (protégé)',
        delete: 'DELETE /etudiants/:id (protégé)'
      }
    }
  });
});

// Initialiser les contrôleurs
new AuthController(app);
new StudentController(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
