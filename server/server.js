const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');

// Configuration de l'application
const app = express();
const port = 3000;

// Connectez-vous à MongoDB
mongoose.connect('mongodb+srv://ingemmanuela:<db_password>@cluster0.xnaub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Modèle Mongoose pour les données des capteurs
const sensorDataSchema = new mongoose.Schema({
  time: String,
  T_1: Number,
  T_2: Number,
  T_3: Number,
  T_4: Number,
  T_5: Number
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Middleware pour analyser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Route pour recevoir les données de l'ESP32
app.post('/api/post-data', async (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;

  // Créer un nouvel enregistrement dans MongoDB
  const newData = new SensorData({ time, T_1, T_2, T_3, T_4, T_5 });
  
  try {
    await newData.save();
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
    const data = await SensorData.find().sort({ _id: -1 }).limit(10); // Obtenir les 10 dernières entrées
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// Route pour réinitialiser les données
app.post('/api/reset-data', async (req, res) => {
  try {
    await SensorData.deleteMany(); // Effacer toutes les données
    console.log('Données réinitialisées.');
    res.send('Données réinitialisées.');
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).send('Error resetting data');
  }
});

// Route pour télécharger le fichier Excel
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

  try {
    const sensorData = await SensorData.find(); // Récupérer toutes les données

    // Ajouter les données des capteurs au fichier Excel
    sensorData.forEach(data => {
      worksheet.addRow(data.toObject());
    });

    // Générer le fichier Excel en mémoire
    const buffer = await workbook.xlsx.writeBuffer();

    // Définir les en-têtes de réponse pour le téléchargement
    res.setHeader('Content-Disposition', 'attachment; filename=donnees_capteurs.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Envoyer le buffer en réponse
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://joely-project.vercel.app:${port}`);
});







