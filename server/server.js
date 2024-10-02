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

// Route pour télécharger les données sous forme de fichier Excel (.xlsx)
app.get('/api/download', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Données des Capteurs');

  // Ajouter l'en-tête
  worksheet.columns = [
    { header: 'Time', key: 'time', width: 20 },
    { header: 'T_1', key: 'T_1', width: 10 },
    { header: 'T_2', key: 'T_2', width: 10 },
    { header: 'T_3', key: 'T_3', width: 10 },
    { header: 'T_4', key: 'T_4', width: 10 },
    { header: 'T_5', key: 'T_5', width: 10 },
  ];

  // Ajouter les données des capteurs
  sensorData.forEach(data => {
    worksheet.addRow(data);
  });

  // Envoyer le fichier Excel
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=sensor_data.xlsx');

  await workbook.xlsx.write(res);
  res.end();
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

