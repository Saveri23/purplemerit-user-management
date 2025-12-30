const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
