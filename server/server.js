const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

let sensorData = [];

// Middleware pour analyser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Route pour recevoir les données de l'ESP32
app.post('/api/post-data', (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;
  sensorData.push({ time, T_1, T_2, T_3, T_4, T_5 });
  console.log('Data received:', req.body);
  res.send('Data received successfully');
});

// Route pour obtenir les données sous forme JSON pour le client
app.get('/api/get-data', (req, res) => {
  res.json(sensorData);
});

// Route pour télécharger les données sous forme de fichier CSV
app.get('/api/download', (req, res) => {
  const csvHeader = 'time,T_1,T_2,T_3,T_4,T_5\n';
  const csvRows = sensorData.map(row => `${row.time},${row.T_1},${row.T_2},${row.T_3},${row.T_4},${row.T_5}`).join('\n');
  const csvData = csvHeader + csvRows;

  res.header('Content-Type', 'text/csv');
  res.attachment('sensor_data.csv');
  res.send(csvData);
});

// Route pour réinitialiser les données
app.post('/api/reset', (req, res) => {
  sensorData = [];
  console.log('Data reset');
  res.send('Data reset successfully');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

