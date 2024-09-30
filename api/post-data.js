import mongoose from 'mongoose';

// Connexion à MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Schéma pour les données des capteurs
const sensorDataSchema = new mongoose.Schema({
  time: String,
  T_1: Number,
  T_2: Number,
  T_3: Number,
  T_4: Number,
  T_5: Number,
});

const SensorData = mongoose.models.SensorData || mongoose.model('SensorData', sensorDataSchema);

// Route pour poster les données
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectDB();
    const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;
    const newData = new SensorData({ time, T_1, T_2, T_3, T_4, T_5 });
    await newData.save(); // Enregistrer les données dans MongoDB
    res.status(200).json({ message: 'Data saved successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
