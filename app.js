require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const Music = require('./models/Music');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', async (req, res) => {
  const musicList = await Music.find();
  res.render('index', { musicList });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', upload.single('musicFile'), async (req, res) => {
  const { name, imageUrl } = req.body;
  const musicBuffer = req.file.buffer;

  await Music.create({ name, music: musicBuffer, imageUrl });
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const music = await Music.findById(req.params.id);
  res.render('edit', { music });
});

app.post('/edit/:id', upload.single('musicFile'), async (req, res) => {
  const { name, imageUrl } = req.body;
  const updateData = { name, imageUrl };
  
  if (req.file) {
    updateData.music = req.file.buffer;
  }

  await Music.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Music.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.get('/music/:id', async (req, res) => {
    const music = await Music.findById(req.params.id);
    res.set('Content-Type', 'audio/mp3');
    res.send(music.music);
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));