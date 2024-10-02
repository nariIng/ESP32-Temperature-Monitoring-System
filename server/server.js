const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const XLSX = require('xlsx');

// Initialiser l'application Express
const app = express();
const port = 3000;

// Configuration de Mongoose pour la connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Schéma pour stocker les données des capteurs
const sensorSchema = new mongoose.Schema({
  time: String,
  T_1: Number,
  T_2: Number,
  T_3: Number,
  T_4: Number,
  T_5: Number
});

// Modèle MongoDB pour les données des capteurs
const SensorData = mongoose.model('SensorData', sensorSchema);

// Middleware pour analyser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Route pour recevoir les données de l'ESP32 et les stocker dans MongoDB
app.post('/api/post-data', async (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;

  // Créer une nouvelle entrée dans MongoDB
  const newSensorData = new SensorData({ time, T_1, T_2, T_3, T_4, T_5 });

  try {
    await newSensorData.save();  // Stocker dans MongoDB
    console.log('Data received and saved:', req.body);
    res.send('Data received and saved successfully');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

// Route pour obtenir les données stockées dans MongoDB
app.get('/api/get-data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ _id: -1 }).limit(10);  // Obtenir les 10 dernières entrées
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Error fetching data');
  }
});

// Route pour télécharger les données en tant que fichier Excel
app.get('/api/download-excel', async (req, res) => {
  try {
    const data = await SensorData.find();  // Obtenir toutes les données

    // Créer un fichier Excel à partir des données
    const ws = XLSX.utils.json_to_sheet(data.map(d => ({
      time: d.time,
      T_1: d.T_1,
      T_2: d.T_2,
      T_3: d.T_3,
      T_4: d.T_4,
      T_5: d.T_5
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SensorData");

    const filePath = path.join(__dirname, 'sensor_data.xlsx');
    XLSX.writeFile(wb, filePath);

    // Télécharger le fichier
    res.download(filePath, 'sensor_data.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      } else {
        console.log('Excel file downloaded successfully');
      }
    });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
});

// Route pour réinitialiser les données dans MongoDB et supprimer le fichier Excel
app.post('/api/reset-excel', async (req, res) => {
  try {
    await SensorData.deleteMany();  // Supprimer toutes les données de MongoDB
    console.log('All sensor data reset in MongoDB');

    // Supprimer l'ancien fichier Excel
    const filePath = path.join(__dirname, 'sensor_data.xlsx');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.send('Data reset successfully');
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).send('Error resetting data');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

