import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String,required: true},
  username: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
