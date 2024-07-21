const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const AWS = require('aws-sdk');

app.use(express.static('public'));
app.use(bodyParser.json());

const s3 = new AWS.S3({
  accessKeyId: 'your_access_key_id',
  secretAccessKey: 'your_secret_access_key',
  region: 'your_region'
});

const bucketName = 'your_bucket_name';
const excelFileKey = 'sensor_data.xlsx';

// Fonction pour créer un nouveau fichier Excel
function createNewExcelFile() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([["Time", "Temperature (°C)", "Humidity (%)"]]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Data');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  const params = {
    Bucket: bucketName,
    Key: excelFileKey,
    Body: buffer,
    ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  return s3.upload(params).promise();
}

// Créer un nouveau fichier Excel au démarrage du serveur
createNewExcelFile().catch(console.error);

// API pour recevoir les données du capteur
app.post('/api/send-data', (req, res) => {
  const { temperature, humidity, timestamp } = req.body;

  if (typeof temperature === 'number' && typeof humidity === 'number' && typeof timestamp === 'string') {
    const params = {
      Bucket: bucketName,
      Key: excelFileKey
    };

    s3.getObject(params).promise()
      .then(data => {
        const workbook = XLSX.read(data.Body, { type: 'buffer' });
        const worksheet = workbook.Sheets['Sensor Data'];

        const newRow = [new Date(parseInt(timestamp)).toLocaleString(), temperature, humidity];
        XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        const uploadParams = {
          Bucket: bucketName,
          Key: excelFileKey,
          Body: buffer,
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        return s3.upload(uploadParams).promise();
      })
      .then(() => res.sendStatus(200))
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
});

// API pour télécharger le fichier Excel
app.get('/api/download-excel', (req, res) => {
  const params = {
    Bucket: bucketName,
    Key: excelFileKey
  };

  s3.getObject(params).createReadStream().pipe(res);
});

// API pour réinitialiser le fichier Excel
app.post('/api/reset-excel', (req, res) => {
  createNewExcelFile()
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
