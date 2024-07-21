const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const MemoryFS = require('memory-fs');

app.use(express.static('public'));
app.use(bodyParser.json());

// Créer un système de fichiers en mémoire
const mfs = new MemoryFS();
const excelFilePath = '/sensor_data.xlsx';

// Fonction pour créer un nouveau fichier Excel
function createNewExcelFile() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([["Time", "Temperature (°C)", "Humidity (%)"]]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Data');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  mfs.writeFileSync(excelFilePath, buffer);
}

// Créer un nouveau fichier Excel au démarrage du serveur
createNewExcelFile();

// API pour recevoir les données du capteur
app.post('/api/send-data', (req, res) => {
  const { temperature, humidity, timestamp } = req.body;

  if (typeof temperature === 'number' && typeof humidity === 'number' && typeof timestamp === 'string') {
    const workbook = XLSX.read(mfs.readFileSync(excelFilePath), { type: 'buffer' });
    const worksheet = workbook.Sheets['Sensor Data'];

    const newRow = [new Date(parseInt(timestamp)).toLocaleString(), temperature, humidity];
    XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    mfs.writeFileSync(excelFilePath, buffer);

    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// API pour télécharger le fichier Excel
app.get('/api/download-excel', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="sensor_data.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(mfs.readFileSync(excelFilePath));
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
