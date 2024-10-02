const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const port = 3000;

let sensorData = [];

// Connexion à MongoDB sans les options dépréciées
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

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

  // Ajouter la logique de stockage dans MongoDB ici si nécessaire

  res.send('Data received successfully');
});

// Route pour obtenir les données sous forme JSON pour le client
app.get('/api/get-data', (req, res) => {
  res.json(sensorData);
});

// Route pour télécharger le fichier Excel
app.get('/api/download-excel', (req, res) => {
  const ws = XLSX.utils.json_to_sheet(sensorData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SensorData");

  const filePath = path.join(__dirname, 'sensor_data.xlsx');
  XLSX.writeFile(wb, filePath);

  res.download(filePath, 'sensor_data.xlsx', (err) => {
    if (err) {
      console.error('Error downloading file:', err);
    } else {
      console.log('Excel file downloaded successfully');
    }
  });
});


// Route pour réinitialiser les données du fichier Excel
app.post('/api/reset-excel', (req, res) => {
  sensorData = [];  // Réinitialiser les données du tableau en mémoire

  // Supprimer l'ancien fichier Excel
  const filePath = path.join(__dirname, 'sensor_data.xlsx');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.send('Data reset successfully');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
