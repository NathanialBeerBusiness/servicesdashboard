import { Router } from 'express';
import { prisma } from '../server.js';

export const crudRouter = Router();

crudRouter.get('/accounts', async (_req, res) => res.json(await prisma.account.findMany({ where: { deletedAt: null } })));
crudRouter.post('/accounts', async (req, res) => res.json(await prisma.account.create({ data: req.body })));
crudRouter.patch('/accounts/:id', async (req, res) => res.json(await prisma.account.update({ where: { id: req.params.id }, data: req.body })));
crudRouter.delete('/accounts/:id', async (req, res) => {
  await prisma.account.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: 'DELETE', entityType: 'account', entityId: req.params.id } });
  res.status(204).send();
});

crudRouter.get('/jobs', async (_req, res) => res.json(await prisma.job.findMany({ where: { deletedAt: null } })));
crudRouter.post('/jobs', async (req, res) => res.json(await prisma.job.create({ data: req.body })));
crudRouter.patch('/jobs/:id', async (req, res) => res.json(await prisma.job.update({ where: { id: req.params.id }, data: req.body })));
crudRouter.delete('/jobs/:id', async (req, res) => {
  await prisma.job.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: 'DELETE', entityType: 'job', entityId: req.params.id } });
  res.status(204).send();
});

crudRouter.get('/service-reports', async (_req, res) => res.json(await prisma.serviceReport.findMany({ where: { deletedAt: null } })));
crudRouter.post('/service-reports', async (req, res) => res.json(await prisma.serviceReport.create({ data: req.body })));
crudRouter.patch('/service-reports/:id', async (req, res) =>
  res.json(await prisma.serviceReport.update({ where: { id: req.params.id }, data: req.body }))
);
crudRouter.delete('/service-reports/:id', async (req, res) => {
  await prisma.serviceReport.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: 'DELETE', entityType: 'service-report', entityId: req.params.id } });
  res.status(204).send();
});

crudRouter.get('/invoices', async (_req, res) => res.json(await prisma.invoice.findMany({ where: { deletedAt: null } })));
crudRouter.post('/invoices', async (req, res) => res.json(await prisma.invoice.create({ data: req.body })));
crudRouter.patch('/invoices/:id', async (req, res) => res.json(await prisma.invoice.update({ where: { id: req.params.id }, data: req.body })));
crudRouter.delete('/invoices/:id', async (req, res) => {
  await prisma.invoice.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: 'DELETE', entityType: 'invoice', entityId: req.params.id } });
  res.status(204).send();
});
