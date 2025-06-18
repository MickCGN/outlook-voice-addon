const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });
const { transcribeWithWhisper } = require('./whisper');

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  const text = await transcribeWithWhisper(req.file.path);
  res.json({ text });
});

app.listen(3001, () => console.log("Server running on port 3001"));
