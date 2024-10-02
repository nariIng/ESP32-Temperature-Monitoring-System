const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const app = express();
const port = 3000;

let sensorData = [];

// Middleware pour analyser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Fonction pour ajouter les données dans un fichier Excel
const saveToExcel = (data) => {
  const filePath = path.join(__dirname, 'sensor_data.xlsx');
  const workbook = new ExcelJS.Workbook();

  // Si le fichier existe, on le charge, sinon on en crée un nouveau
  workbook.xlsx.readFile(filePath).then(() => {
    let worksheet = workbook.getWorksheet('Sensor Data');
    if (!worksheet) {
      worksheet = workbook.addWorksheet('Sensor Data');
      worksheet.columns = [
        { header: 'Time', key: 'time', width: 20 },
        { header: 'T_1', key: 'T_1', width: 10 },
        { header: 'T_2', key: 'T_2', width: 10 },
        { header: 'T_3', key: 'T_3', width: 10 },
        { header: 'T_4', key: 'T_4', width: 10 },
        { header: 'T_5', key: 'T_5', width: 10 },
      ];
    }

    // Ajout des données dans la feuille de calcul
    worksheet.addRow(data);

    // Sauvegarde du fichier Excel
    return workbook.xlsx.writeFile(filePath);
  }).catch(() => {
    // Si le fichier n'existe pas, on le crée
    let worksheet = workbook.addWorksheet('Sensor Data');
    worksheet.columns = [
      { header: 'Time', key: 'time', width: 20 },
      { header: 'T_1', key: 'T_1', width: 10 },
      { header: 'T_2', key: 'T_2', width: 10 },
      { header: 'T_3', key: 'T_3', width: 10 },
      { header: 'T_4', key: 'T_4', width: 10 },
      { header: 'T_5', key: 'T_5', width: 10 },
    ];

    worksheet.addRow(data);
    return workbook.xlsx.writeFile(filePath);
  });
};

// Route pour recevoir les données de l'ESP32
app.post('/api/post-data', (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;
  const newData = { time, T_1, T_2, T_3, T_4, T_5 };
  sensorData.push(newData);
  console.log('Data received:', newData);

  // Enregistrement des données dans Excel
  saveToExcel(newData);

  res.send('Data received and saved to Excel successfully');
});

// Route pour obtenir les données sous forme JSON pour le client
app.get('/api/get-data', (req, res) => {
  try {
    if (sensorData.length === 0) {
      return res.json([]); // Renvoie un tableau vide si aucune donnée n'est disponible
    }
    res.json(sensorData); // Renvoie les données sous forme JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Renvoyer une erreur propre sous forme JSON
  }
});

// Route pour télécharger le fichier Excel
app.get('/api/download-excel', (req, res) => {
  const filePath = path.join(__dirname, 'sensor_data.xlsx');
  
  // Vérifie si le fichier existe, puis l'envoie en réponse
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('Excel file not found');
  }
});

// Route pour réinitialiser le fichier Excel (vider les données)
app.post('/api/reset-data', (req, res) => {
  const filePath = path.join(__dirname, 'sensor_data.xlsx');
  
  // Supprime le fichier Excel s'il existe
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    sensorData = []; // Vide aussi le tableau en mémoire
    res.send('Data and Excel file reset successfully');
  } else {
    res.status(404).send('No Excel file to reset');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://joely_project.vercel.app:${port}`);
});








