import mongoose from 'mongoose';
import ExcelJS from 'exceljs';

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

// Route pour télécharger un fichier Excel
export default async function handler(req, res) {
  await connectDB();
  const data = await SensorData.find();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sensor Data');

  worksheet.columns = [
    { header: 'Time', key: 'time', width: 15 },
    { header: 'T_1', key: 'T_1', width: 10 },
    { header: 'T_2', key: 'T_2', width: 10 },
    { header: 'T_3', key: 'T_3', width: 10 },
    { header: 'T_4', key: 'T_4', width: 10 },
    { header: 'T_5', key: 'T_5', width: 10 },
  ];

  data.forEach(sensor => worksheet.addRow(sensor));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=sensor-data.xlsx');

  await workbook.xlsx.write(res);
  res.end();
}

