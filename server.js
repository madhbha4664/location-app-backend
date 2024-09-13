require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  googleMapsUrl: { type: String }, 
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', locationSchema);

app.post('/api/location', async (req, res) => {
  const { name, latitude, longitude } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  try {
    const newLocation = new Location({ name, latitude, longitude, googleMapsUrl });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save location' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
