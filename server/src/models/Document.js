import mongoose from 'mongoose';
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true }, description: String, fileName: String, fileType: String, filePath: String,
  category: String, department: String, version: { type: String, default: '1.0' },
  status: { type: String, enum: ['UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED'], default: 'UPLOADED' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, uploadedAt: { type: Date, default: Date.now }, processedAt: Date, error: String
}, { timestamps: true });
export default mongoose.model('Document', documentSchema);
