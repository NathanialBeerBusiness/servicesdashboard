import { Router } from 'express';
import { prisma } from '../server.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', async (_req, res) => {
  const [accounts, jobs, activeJobs, overdueInvoices, completedJobs] = await Promise.all([
    prisma.account.count({ where: { deletedAt: null } }),
    prisma.job.count({ where: { deletedAt: null } }),
    prisma.job.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
    prisma.invoice.count({ where: { deletedAt: null, status: 'OVERDUE' } }),
    prisma.job.count({ where: { deletedAt: null, status: 'COMPLETED' } })
  ]);

  res.json({
    accounts,
    jobs,
    activeJobs,
    overdueInvoices,
    completedJobs,
    revenueThisMonth: 0
  });
});
