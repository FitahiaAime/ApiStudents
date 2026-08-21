import { Application, Request, Response } from 'express';
import { StudentService } from '../services/StudentService';
import { CreateStudentDTO, UpdateStudentDTO } from '../models/Student';
import { authenticate, authorize } from '../middlewares/auth';

export class StudentController {
  private studentService: StudentService;

  constructor(app: Application) {
    this.studentService = new StudentService();
    this.registerRoutes(app);
  }

  private registerRoutes(app: Application): void {
    // Routes publiques (sans JWT)
    app.get('/etudiants', this.getAll.bind(this));
    app.get('/etudiants/:id', this.getById.bind(this));
    
    // Routes protégées (avec JWT)
    app.post('/etudiants', 
      authenticate, 
      authorize(['admin', 'professor']), 
      this.create.bind(this)
    );
    
    app.put('/etudiants/:id', 
      authenticate, 
      authorize(['admin', 'professor']), 
      this.update.bind(this)
    );
    
    app.patch('/etudiants/:id', 
      authenticate, 
      authorize(['admin', 'professor']), 
      this.update.bind(this)
    );
    
    app.delete('/etudiants/:id', 
      authenticate, 
      authorize(['admin']), 
      this.remove.bind(this)
    );
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    try {
      const students = await this.studentService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const student = await this.studentService.getStudentById(id);
      res.status(200).json(student);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private async create(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 Créé par:', req.user?.email, 'Rôle:', req.user?.role);
      const data: CreateStudentDTO = req.body;
      const student = await this.studentService.createStudent(data);
      res.status(201).json(student);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private async update(req: Request, res: Response): Promise<void> {
    try {
      console.log('✏️ Modifié par:', req.user?.email, 'Rôle:', req.user?.role);
      const id = Number(req.params.id);
      const data: UpdateStudentDTO = req.body;
      const student = await this.studentService.updateStudent(id, data);
      res.status(200).json(student);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private async remove(req: Request, res: Response): Promise<void> {
    try {
      console.log('🗑️ Supprimé par:', req.user?.email, 'Rôle:', req.user?.role);
      const id = Number(req.params.id);
      await this.studentService.deleteStudent(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'Student not found') {
      res.status(404).json({ error: message });
      return;
    }

    if (message === 'Email already exists') {
      res.status(409).json({ error: message });
      return;
    }

    if (
      message === 'Invalid student ID' ||
      message === 'First name is required' ||
      message === 'Last name is required' ||
      message === 'Email is required' ||
      message === 'Invalid email format'
    ) {
      res.status(400).json({ error: message });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
