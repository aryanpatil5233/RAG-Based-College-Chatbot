import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(payload.userId).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch { res.status(401).json({ error: 'Invalid or expired token' }); }
}
export function requireAdmin(req, res, next) { if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); next(); }
