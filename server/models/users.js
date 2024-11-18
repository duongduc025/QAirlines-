import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
  email: String,
  fullname: String, 
  phoneNumber: String, 
  password: String,
  created_at: { type: Date, default: Date.now },
  user_type: String, // Ensure this field is included
  role: String,
});

const User = mongoose.model('User', userSchema);
export default User;