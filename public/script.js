let data = [];

async function fetchData() {
  const response = await fetch('/api/get-data');
  const sensorData = await response.json();

  document.getElementById('temperature').textContent = sensorData.temperature;
  document.getElementById('humidity').textContent = sensorData.humidity;
  document.getElementById('timestamp').textContent = new Date(sensorData.timestamp).toLocaleString();

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
  fetch('/api/download')
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sensor_data.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(err => console.error('Error downloading file:', err));
}

function resetTable() {
  fetch('/api/reset', { method: 'POST' })
    .then(response => response.text())
    .then(message => {
      console.log(message);
      data = [];
      updateTable();
    })
    .catch(err => console.error('Error resetting data:', err));
}

document.getElementById('download').addEventListener('click', downloadExcel);
document.getElementById('reset').addEventListener('click', resetTable);

setInterval(fetchData, 2000); // Mettre à jour toutes les minutes
fetchData();
