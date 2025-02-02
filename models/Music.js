const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  name: String,
  music: Buffer,  // Store the MP3 file as a buffer
  imageUrl: String
});

module.exports = mongoose.model('Music', musicSchema);
