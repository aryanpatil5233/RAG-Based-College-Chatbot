import mongoose from 'mongoose';
const schema = new mongoose.Schema({ messageId: String, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, type: { type: String, enum: ['positive', 'negative'], required: true }, comment: String }, { timestamps: true });
export default mongoose.model('Feedback', schema);
