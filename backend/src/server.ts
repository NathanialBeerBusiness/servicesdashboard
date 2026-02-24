import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { crudRouter } from './routes/crud.js';

export const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api', crudRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`ServiceFlow API running on :${port}`);
});
