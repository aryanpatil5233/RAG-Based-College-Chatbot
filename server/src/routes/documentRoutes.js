import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import Document from '../models/Document.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { indexDocument } from '../rag/ragPipeline.js';
import DocumentChunk from '../models/DocumentChunk.js';
const router = Router(); const upload = multer({ dest: env.uploadDir, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, /pdf|msword|officedocument|text/.test(file.mimetype)) });
router.use(requireAuth, requireAdmin);
router.get('/', async (_req, res) => res.json(await Document.find().sort({ uploadedAt: -1 }).populate('uploadedBy', 'name email')));
router.get('/:id/sources', async (req, res) => res.json(await DocumentChunk.find({ documentId: req.params.id }).select('chunkId pageNumber content metadata')));
router.post('/upload', upload.single('file'), async (req, res) => { if (!req.file) return res.status(400).json({ error: 'A PDF, DOC, DOCX, or text file is required' }); const document = await Document.create({ ...req.body, name: req.body.name || req.file.originalname, fileName: req.file.originalname, fileType: req.file.mimetype, filePath: req.file.path, uploadedBy: req.user._id }); processDocument(document); res.status(202).json(document); });
router.post('/:id/process', async (req, res) => { const document = await Document.findById(req.params.id); if (!document) return res.status(404).json({ error: 'Document not found' }); processDocument(document); res.status(202).json({ status: 'PROCESSING' }); });
router.delete('/:id', async (req, res) => { const document = await Document.findByIdAndDelete(req.params.id); if (document?.filePath) fs.rm(document.filePath, { force: true }, () => {}); res.json({ success: true }); });
async function processDocument(document) { try { document.status = 'PROCESSING'; await document.save(); await indexDocument(document); document.status = 'PROCESSED'; document.processedAt = new Date(); document.error = undefined; } catch (error) { document.status = 'FAILED'; document.error = error.message; } await document.save(); }
export default router;
