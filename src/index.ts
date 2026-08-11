import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StudentController } from './controllers/StudentController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

new StudentController(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
