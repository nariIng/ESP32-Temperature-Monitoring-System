import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const sensorDataSchema = new mongoose.Schema({
  time: String,
  T_1: Number,
  T_2: Number,
  T_3: Number,
  T_4: Number,
  T_5: Number,
});

const SensorData = mongoose.models.SensorData || mongoose.model('SensorData', sensorDataSchema);

// Route pour réinitialiser la base de données
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectDB();
    await SensorData.deleteMany(); // Supprimer toutes les données
    res.status(200).json({ message: 'Database reset successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
