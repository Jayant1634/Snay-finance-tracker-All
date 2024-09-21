const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Change from email to username
  password: { type: String, required: true },
  currentBalance: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  bankAccount: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
