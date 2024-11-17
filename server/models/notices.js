const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  user_type: String,
  post_date: Date,
  user_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Notice', noticeSchema);
