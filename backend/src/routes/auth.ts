import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { email, role = 'ADMIN' } = req.body;
  if (!email) return res.status(400).json({ message: 'email required' });

  const token = jwt.sign({ sub: email, role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  res.json({ token, user: { email, role } });
});
