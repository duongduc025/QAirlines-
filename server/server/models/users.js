import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  booking_id: { type: [String] },
  delayNotices: { type: [mongoose.Schema.Types.ObjectId], ref: 'DelayNotice' }
});

export default mongoose.model('User', userSchema, 'users');
