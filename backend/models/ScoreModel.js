const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository' },
  totalCommits: { type: Number, default: 0 },
  languages: [{
    language: String,
    score: Number,
  }],
  overallScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);