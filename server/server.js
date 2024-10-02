const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ExcelJS = require('exceljs');

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

// Route pour réinitialiser les données
app.post('/api/reset-data', (req, res) => {
  sensorData = []; // Réinitialiser les données
  console.log('Données réinitialisées.');

  // Créer un nouveau fichier Excel vide
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Données des Capteurs');

  // Ajouter des en-têtes de colonnes
  worksheet.columns = [
    { header: 'Temps', key: 'time', width: 30 },
    { header: 'Température 1 (°C)', key: 'T_1', width: 20 },
    { header: 'Température 2 (°C)', key: 'T_2', width: 20 },
    { header: 'Température 3 (°C)', key: 'T_3', width: 20 },
    { header: 'Température 4 (°C)', key: 'T_4', width: 20 },
    { header: 'Température 5 (°C)', key: 'T_5', width: 20 }
  ];

  // Enregistrer le nouveau fichier Excel vide
  const filePath = path.join(__dirname, 'donnees_capteurs.xlsx');
  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log('Fichier Excel réinitialisé.');
      res.send('Données réinitialisées et fichier Excel créé.');
    })
    .catch((error) => {
      console.error('Erreur lors de la réinitialisation du fichier Excel:', error);
      res.status(500).send('Erreur lors de la réinitialisation des données.');
    });
});

// Route pour générer le fichier Excel
app.get('/api/generate-excel', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Données des Capteurs');

  // Ajouter des en-têtes de colonnes
  worksheet.columns = [
    { header: 'Temps', key: 'time', width: 30 },
    { header: 'Température 1 (°C)', key: 'T_1', width: 20 },
    { header: 'Température 2 (°C)', key: 'T_2', width: 20 },
    { header: 'Température 3 (°C)', key: 'T_3', width: 20 },
    { header: 'Température 4 (°C)', key: 'T_4', width: 20 },
    { header: 'Température 5 (°C)', key: 'T_5', width: 20 }
  ];

  // Ajouter les données des capteurs au fichier Excel
  sensorData.forEach(data => {
    worksheet.addRow(data);
  });

  // Générer le fichier Excel
  const filePath = path.join(__dirname, 'donnees_capteurs.xlsx');
  await workbook.xlsx.writeFile(filePath);

  // Envoyer le fichier Excel au client
  res.download(filePath, 'donnees_capteurs.xlsx', (err) => {
    if (err) {
      console.error('Erreur lors de l\'envoi du fichier:', err);
    }
    else {
      console.log('Fichier telecharger ave succes');
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://joely-project.vercel.app:${port}`);
});







