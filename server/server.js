const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Endpoint pour récupérer les 10 dernières valeurs depuis le serveur ESP32
app.get('/data', async (req, res) => {
  try {
    // URL de l'API qui reçoit les données de l'ESP32
    const response = await axios.get('https://joely-project.vercel.app/api/get-latest-data');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des données');
  }
});

// Endpoint pour télécharger le fichier CSV depuis la carte SD de l'ESP32
app.get('/download', (req, res) => {
  const file = path.join(__dirname, '../path_to_local_file/test.csv');
  res.download(file, 'temperatures.xlsx');
});

// Endpoint pour réinitialiser les valeurs dans la carte SD via l'ESP32
app.post('/reset', async (req, res) => {
  try {
    // URL de réinitialisation sur l'ESP32
    await axios.post('https://joely-project.vercel.app/api/reset-data');
    res.send('Réinitialisation réussie');
  } catch (error) {
    res.status(500).send('Erreur lors de la réinitialisation des données');
  }
});

// Lancement du serveur
const server = app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});

// WebSocket pour les mises à jour en temps réel
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Un client est connecté');

  // Simuler l'envoi de données de capteurs toutes les 5 secondes
  setInterval(() => {
    const sampleData = [
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 }
    ];
    socket.emit('temperatureUpdate', sampleData);
  }, 5000); // Met à jour toutes les 5 secondes
});


