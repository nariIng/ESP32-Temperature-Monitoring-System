const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;

// Connection à MongoDB
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Définition du modèle
const sensorSchema = new mongoose.Schema({
  time: { type: String, required: true },
  T_1: { type: Number, required: true },
  T_2: { type: Number, required: true },
  T_3: { type: Number, required: true },
  T_4: { type: Number, required: true },
  T_5: { type: Number, required: true },
}, { timestamps: true });

const SensorData = mongoose.model('SensorData', sensorSchema);

// Middleware pour analyser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Route pour recevoir les données de l'ESP32
app.post('/api/post-data', async (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;

  try {
    const sensorData = new SensorData({ time, T_1, T_2, T_3, T_4, T_5 });
    await sensorData.save();
    console.log('Data received:', req.body);
    res.send('Data received successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Route pour obtenir les données sous forme JSON pour le client
app.get('/api/get-data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ createdAt: -1 }).limit(10); // Récupérer les 10 dernières entrées
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// Route pour télécharger les données sous forme de fichier Excel
app.get('/api/download-excel', async (req, res) => {
  try {
    const data = await SensorData.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sensor Data');

    worksheet.columns = [
      { header: 'Time', key: 'time', width: 30 },
      { header: 'T_1', key: 'T_1', width: 10 },
      { header: 'T_2', key: 'T_2', width: 10 },
      { header: 'T_3', key: 'T_3', width: 10 },
      { header: 'T_4', key: 'T_4', width: 10 },
      { header: 'T_5', key: 'T_5', width: 10 }
    ];

    data.forEach(entry => {
      worksheet.addRow(entry.toObject());
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sensor_data.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error downloading Excel:', error);
    res.status(500).send('Error downloading Excel');
  }
});

// Route pour réinitialiser les données
app.post('/api/reset-data', async (req, res) => {
  try {
    await SensorData.deleteMany(); // Supprime toutes les entrées
    console.log('All sensor data has been reset.');
    res.send('All sensor data has been reset.');
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).send('Error resetting data');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
