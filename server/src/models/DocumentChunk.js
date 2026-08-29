import mongoose from 'mongoose';
const schema = new mongoose.Schema({ documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true }, chunkId: String, content: String, pageNumber: Number, metadata: Object, vectorId: String }, { timestamps: true });
export default mongoose.model('DocumentChunk', schema);
