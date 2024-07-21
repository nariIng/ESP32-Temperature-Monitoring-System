const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

app.use(express.static('public'));
app.use(bodyParser.json());

// Chemin vers le fichier Excel
const excelFilePath = path.join(__dirname, 'sensor_data.xlsx');

// Fonction pour créer un nouveau fichier Excel
function createNewExcelFile() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([["Time", "Temperature (°C)", "Humidity (%)"]]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Data');
  XLSX.writeFile(workbook, excelFilePath);
}

// Créer un nouveau fichier Excel au démarrage du serveur s'il n'existe pas
if (!fs.existsSync(excelFilePath)) {
  createNewExcelFile();
}

// API pour recevoir les données du capteur
app.post('/api/send-data', (req, res) => {
  const { temperature, humidity, timestamp } = req.body;

  if (typeof temperature === 'number' && typeof humidity === 'number' && typeof timestamp === 'string') {
    const workbook = XLSX.readFile(excelFilePath);
    const worksheet = workbook.Sheets['Sensor Data'];

    const newRow = [new Date(parseInt(timestamp)).toLocaleString(), temperature, humidity];
    XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
    XLSX.writeFile(workbook, excelFilePath);

    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// API pour télécharger le fichier Excel
app.get('/api/download-excel', (req, res) => {
  res.download(excelFilePath);
});

// API pour réinitialiser le fichier Excel
app.post('/api/reset-excel', (req, res) => {
  createNewExcelFile();
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
