const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

const FILE_PATH = path.join(__dirname, 'sensor_data.xlsx');

let sensorData = [];

app.post('/api/post-data', (req, res) => {
  sensorData.push({
    time: new Date().toLocaleString(),
    temperature: req.body.temperature,
    humidity: req.body.humidity
  });

  res.send('Data received');
});

app.get('/api/get-data', (req, res) => {
  const data = sensorData.slice(-10); // Envoi des 10 dernières entrées
  res.json(data);
});

app.get('/api/download', (req, res) => {
  if (fs.existsSync(FILE_PATH)) {
    res.download(FILE_PATH);
  } else {
    res.status(404).send('File not found');
  }
});

app.post('/api/reset', (req, res) => {
  sensorData = [];

  // Crée un nouveau fichier Excel
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Data');
  XLSX.writeFile(workbook, FILE_PATH);

  res.send('Data reset and new file created');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
