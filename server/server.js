const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

let sensorData = {};

app.post('/post-data', (req, res) => {
  sensorData = {
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    timestamp: new Date()
  };
  res.send('Data received');
});

app.get('/get-data', (req, res) => {
  res.json(sensorData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
