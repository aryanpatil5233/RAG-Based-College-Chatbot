import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({ role: { type: String, enum: ['user', 'assistant'], required: true }, content: String, sources: Array, retrievalMetadata: Object }, { timestamps: true });
const conversationSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, title: String, messages: [messageSchema] }, { timestamps: true });
export default mongoose.model('Conversation', conversationSchema);
