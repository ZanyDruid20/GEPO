const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bytes: { type: Number, default: 0 },
  repoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Language', languageSchema);