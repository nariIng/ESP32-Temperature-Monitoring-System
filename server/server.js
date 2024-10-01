const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
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

  // Limiter la taille des données à 10 entrées
  if (sensorData.length > 10) {
    sensorData.shift();
  }

  console.log('Data received:', req.body);
  res.send('Data received successfully');
});

// Route pour obtenir les données sous forme JSON pour le client
app.get('/api/get-data', (req, res) => {
  res.json(sensorData);
});

// Route pour télécharger le fichier CSV depuis l'ESP32
app.get('/api/download-csv', async (req, res) => {
  try {
    const esp32Ip = 'http://192.168.0.102'; // Remplacez par l'adresse IP de votre ESP32

    // Envoyer une requête GET à l'ESP32 pour télécharger le fichier CSV
    const response = await axios.get(`${esp32Ip}/download-csv`, {
      responseType: 'stream' // Télécharger le fichier sous forme de flux
    });

    // Créer un chemin temporaire pour enregistrer le fichier CSV
    const tempFilePath = path.join(__dirname, 'test.csv');

    // Enregistrer le fichier en local
    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      // Envoyer le fichier CSV en tant que réponse
      res.download(tempFilePath, 'test.csv', (err) => {
        if (err) {
          console.error('Error downloading CSV:', err);
          res.status(500).send('Error downloading CSV file');
        }

        // Supprimer le fichier temporaire après le téléchargement
        fs.unlinkSync(tempFilePath);
      });
    });

    writer.on('error', (err) => {
      console.error('Error writing CSV file:', err);
      res.status(500).send('Error downloading CSV file');
    });
  } catch (error) {
    console.error('Error fetching CSV from ESP32:', error);
    res.status(500).send('Error fetching CSV file from ESP32');
  }
});

// Route pour réinitialiser les données de l'ESP32
app.get('/api/reset-data', async (req, res) => {
  try {
    const esp32Ip = 'http://192.168.0.102'; // Remplacez par l'adresse IP de votre ESP32

    // Envoyer une requête pour réinitialiser les données sur l'ESP32
    await axios.post(`${esp32Ip}/reset`, { command: 'reset' });

    // Réinitialiser les données localement aussi
    sensorData = [];

    res.send('Data reset successfully');
  } catch (error) {
    console.error('Error resetting data on ESP32:', error);
    res.status(500).send('Error resetting data on ESP32');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at https://joely-project.vercel.app/${port}`);
});





