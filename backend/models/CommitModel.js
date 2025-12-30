const mongoose = require('mongoose');

const commitSchema = new mongoose.Schema({
  sha: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  authorName: { type: String },
  authorEmail: { type: String },
  date: { type: Date, required: true },
  repoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Commit', commitSchema);