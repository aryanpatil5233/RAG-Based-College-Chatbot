import { Router } from 'express';
import Conversation from '../models/Conversation.js';
import { requireAuth } from '../middleware/auth.js';
import { answerQuestion } from '../rag/ragPipeline.js';
const router = Router(); router.use(requireAuth);
router.get('/conversations', async (req, res) => res.json(await Conversation.find({ userId: req.user._id }).sort({ updatedAt: -1 })));
router.post('/conversations', async (req, res) => res.status(201).json(await Conversation.create({ userId: req.user._id, title: req.body.title || 'New conversation', messages: [] })));
router.get('/conversations/:id', async (req, res) => { const item = await Conversation.findOne({ _id: req.params.id, userId: req.user._id }); if (!item) return res.status(404).json({ error: 'Conversation not found' }); res.json(item); });
router.delete('/conversations/:id', async (req, res) => { await Conversation.deleteOne({ _id: req.params.id, userId: req.user._id }); res.json({ success: true }); });
router.delete('/conversations/:id/messages', async (req, res) => { await Conversation.updateOne({ _id: req.params.id, userId: req.user._id }, { $set: { messages: [] } }); res.json({ success: true }); });
router.post('/', async (req, res) => {
  try { const { question, conversationId } = req.body; if (!question?.trim()) return res.status(400).json({ error: 'Question is required' });
    let conversation = conversationId ? await Conversation.findOne({ _id: conversationId, userId: req.user._id }) : null;
    if (!conversation) conversation = await Conversation.create({ userId: req.user._id, title: question.slice(0, 60), messages: [] });
    const response = await answerQuestion(question, conversation.messages); conversation.messages.push({ role: 'user', content: question }, { role: 'assistant', content: response.answer, sources: response.sources, retrievalMetadata: response.retrievalMetadata }); await conversation.save();
    res.json({ conversationId: conversation._id, ...response });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
export default router;
