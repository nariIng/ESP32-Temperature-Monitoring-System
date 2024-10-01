const express = require('express');
const axios = require('axios');
const fs = require('fs');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const port = 3000;

// Middleware pour servir des fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint pour récupérer les 10 dernières valeurs des capteurs
app.get('/data', async (req, res) => {
  try {
    const response = await axios.get('https://joely-project.vercel.app/get-latest-data');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des données');
  }
});

// Endpoint pour télécharger le fichier CSV
app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'path_to_local_file/test.csv');
  res.download(file, 'temperatures.xlsx');
});

// Endpoint pour réinitialiser les données dans la carte SD de l'ESP32
app.post('/reset', async (req, res) => {
  try {
    await axios.post('https://joely-project.vercel.app/reset-data');
    res.send('Réinitialisation réussie');
  } catch (error) {
    res.status(500).send('Erreur lors de la réinitialisation des données');
  }
});

// Lancement du serveur
const server = app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});

// WebSocket pour la mise à jour en temps réel
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Un client est connecté');
  
  // Simulation d'envoi de données en temps réel
  setInterval(() => {
    const sampleData = [
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 },
      { time: new Date().toISOString(), value: Math.random() * 30 }
    ];
    socket.emit('temperatureUpdate', sampleData);
  }, 5000); // Mettre à jour toutes les 5 secondes pour simuler
});

