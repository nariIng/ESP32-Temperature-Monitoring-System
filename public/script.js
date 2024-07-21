let data = [];

async function fetchData() {
  const response = await fetch('/api/get-data');
  const sensorData = await response.json();

  document.getElementById('temperature').textContent = sensorData.temperature;
  document.getElementById('humidity').textContent = sensorData.humidity;
  document.getElementById('timestamp').textContent = new Date(sensorData.timestamp).toLocaleString();

  // Ajouter les nouvelles données au tableau local (pour affichage seulement)
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
  window.location.href = '/api/download-excel';
}

async function resetTable() {
  const response = await fetch('/api/reset-excel', { method: 'POST' });
  if (response.ok) {
    data = [];
    updateTable();
  } else {
    console.error('Failed to reset Excel file');
  }
}

document.getElementById('download').addEventListener('click', downloadExcel);
document.getElementById('reset').addEventListener('click', resetTable);

setInterval(fetchData, 2000); // Mettre à jour toutes les minutes
fetchData();
