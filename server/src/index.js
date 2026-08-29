import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
const app = express(); fs.mkdirSync(env.uploadDir, { recursive: true });
app.use(cors({ origin: env.clientUrl })); app.use(express.json({ limit: '1mb' })); app.use(morgan('dev'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'college-rag-api' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 40 }), authRoutes);
app.use('/api/chat', rateLimit({ windowMs: 60 * 1000, max: 30 }), chatRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/feedback', feedbackRoutes);
async function ensureAdmin() {
	if (!env.adminEmail || !env.adminPassword) return;
	const exists = await User.exists({ email: env.adminEmail });
	if (!exists) await User.create({ name: 'Knowledge Base Admin', email: env.adminEmail, password: await bcrypt.hash(env.adminPassword, 12), role: 'admin' });
}
connectDatabase().then(ensureAdmin).then(() => app.listen(env.port, () => console.log(`API listening on http://localhost:${env.port}`))).catch(error => { console.error(error); process.exit(1); });
