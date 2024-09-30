const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

let sensorData = [];

app.post('/api/post-data', (req, res) => {
  const { time, T_1, T_2, T_3, T_4, T_5 } = req.body;
  sensorData.push({ time, T_1, T_2, T_3, T_4, T_5 });
  console.log('Data received:', req.body);
  res.send('Data received successfully');
});

app.get('/api/get-data', (req, res) => {
  res.json(sensorData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
