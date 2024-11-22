import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);
export default User;