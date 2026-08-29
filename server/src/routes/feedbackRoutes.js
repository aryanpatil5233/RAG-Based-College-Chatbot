import { Router } from 'express';
import Feedback from '../models/Feedback.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.post('/', requireAuth, async (req, res) => res.status(201).json(await Feedback.create({ ...req.body, userId: req.user._id })));
router.get('/', requireAuth, requireAdmin, async (_req, res) => res.json(await Feedback.find().sort({ createdAt: -1 })));
export default router;
