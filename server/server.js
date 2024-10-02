const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const XLSX = require('xlsx'); // Importer la bibliothèque xlsx
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

// Route pour télécharger les données en tant que fichier Excel
app.get('/api/download', (req, res) => {
  const worksheet = XLSX.utils.json_to_sheet(sensorData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Data');

  const filePath = path.join(__dirname, 'sensor_data.xlsx');
  XLSX.writeFile(workbook, filePath); // Écrire le fichier Excel

  // Envoyer le fichier en tant que réponse
  res.download(filePath, 'sensor_data.xlsx', (err) => {
    if (err) {
      console.error('Error sending file:', err);
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});









