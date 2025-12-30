const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  email: { type: String, sparse: true },
  avatarUrl: { type: String },
  accessToken: { type: String, required: true, select: false } // hide by default
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.accessToken;
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      delete ret.accessToken;
      return ret;
    }
  }
});

module.exports = mongoose.model('User', userSchema);