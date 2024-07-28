const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

let sensorData = {};

app.post('/api/post-data', (req, res) => {
  sensorData = {
    timestamp: new Date(),
    humidity: req.body.humidity,
    temperature: req.body.temperature,
    temperature_1: req.body.temperature_1,
    temperature_2: req.body.temperature_2,
    temperature_3: req.body.temperature_3,
    temperature_4: req.body.temperature_4,
    temperature_5: req.body.temperature_5
  };
  res.send('Data received');
});

app.get('/api/get-data', (req, res) => {
  res.json(sensorData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
