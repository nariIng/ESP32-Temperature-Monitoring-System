const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const port = 3000;

// Chemin vers le fichier CSV
const csvFilePath = path.join(__dirname, 'sensor_data.csv');

// Configuration du CSV Writer
const csvWriter = createCsvWriter({
  path: csvFilePath,
  header: [
    {id: 'time', title: 'Time'},
    {id: 'T_1', title: 'T_1'},
    {id: 'T_2', title: 'T_2'},
    {id: 'T_3', title: 'T_3'},
    {id: 'T_4', title: 'T_4'},
    {id: 'T_5', title: 'T_5'}
  ],
  append: true // Ajouter à la fin du fichier
});

let sensorData = [];

// Middleware pour analyser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Route pour recevoir les données de l'ESP32
app.post('/api/post-data', (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;

  // Ajouter les nouvelles données au tableau en mémoire
  const newEntry = { time, T_1, T_2, T_3, T_4, T_5 };
  sensorData.push(newEntry);

  // Sauvegarder les nouvelles données dans le fichier CSV
  csvWriter.writeRecords([newEntry])
    .then(() => {
      console.log('Données sauvegardées dans le fichier CSV.');
    })
    .catch(error => {
      console.error('Erreur lors de la sauvegarde des données:', error);
    });

  console.log('Data received:', req.body);
  res.send('Data received successfully');
});

// Route pour obtenir les données sous forme JSON pour le client (par ex., front-end)
app.get('/api/get-data', (req, res) => {
  res.json(sensorData);
});

// Route pour récupérer les 10 dernières données
app.get('/api/get-latest-data', (req, res) => {
  const last10Entries = sensorData.slice(-10); // Obtenir les 10 dernières entrées
  res.json(last10Entries);
});

// Route pour télécharger le fichier CSV
app.get('/api/download', (req, res) => {
  res.download(csvFilePath, 'sensor_data.csv', (err) => {
    if (err) {
      console.error('Erreur lors du téléchargement du fichier CSV:', err);
    }
  });
});

// Route pour réinitialiser les données et le fichier CSV
app.post('/api/reset', (req, res) => {
  // Réinitialiser les données en mémoire
  sensorData = [];

  // Réinitialiser le fichier CSV avec uniquement l'en-tête
  fs.writeFile(csvFilePath, 'Time,T_1,T_2,T_3,T_4,T_5\n', (err) => {
    if (err) {
      console.error('Erreur lors de la réinitialisation du fichier CSV:', err);
      return res.status(500).send('Erreur lors de la réinitialisation.');
    }
    console.log('Données réinitialisées et fichier CSV réinitialisé.');
    res.send('Données et fichier CSV réinitialisés.');
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});







