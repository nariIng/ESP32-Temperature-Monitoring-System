let data = [];

async function fetchData() {
  const response = await fetch('/api/get-data');
  const sensorData = await response.json();

  document.getElementById('temperature').textContent = sensorData.temperature;
  document.getElementById('humidity').textContent = sensorData.humidity;
  document.getElementById('timestamp').textContent = new Date(sensorData.timestamp).toLocaleString();

  // Ajouter les nouvelles données au tableau
  data.push({
    time: new Date(sensorData.timestamp).toLocaleString(),
    temperature: sensorData.temperature,
    humidity: sensorData.humidity
  });

  updateTable();
}

function updateTable() {
  const tbody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  // Limiter l'affichage aux 10 dernières lignes
  const displayData = data.slice(-10);

  displayData.forEach((entry) => {
    const row = tbody.insertRow();
    const cellTime = row.insertCell(0);
    const cellTemperature = row.insertCell(1);
    const cellHumidity = row.insertCell(2);

    cellTime.textContent = entry.time;
    cellTemperature.textContent = entry.temperature;
    cellHumidity.textContent = entry.humidity;
  });
}

function downloadExcel() {
  const worksheet = XLSX.utils.json_to_sheet(data, { header: ["time", "temperature", "humidity"] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Data");

  // Définir les noms des colonnes
  XLSX.utils.sheet_add_aoa(worksheet, [["Time", "Temperature (°C)", "Humidity (%)"]], { origin: "A1" });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sensor_data.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function resetTable() {
  data = [];
  updateTable();
}

document.getElementById('download').addEventListener('click', downloadExcel);
document.getElementById('reset').addEventListener('click', resetTable);

setInterval(fetchData, 60000); // Mettre à jour toutes les minutes
fetchData();
