let data = [];

async function fetchData() {
  try {
    const response = await fetch('/api/get-data');
    if (response.ok) {
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
    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function updateTable() {
  const tbody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  // Limiter l'affichage aux 10 dernières lignes et ajouter un scrollbar si nécessaire
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

  const tableContainer = document.getElementById('table-container');
  if (data.length > 10) {
    tableContainer.style.overflowY = 'scroll';
    tableContainer.style.height = '200px'; // Ajustez la hauteur selon vos besoins
  } else {
    tableContainer.style.overflowY = 'auto';
    tableContainer.style.height = 'auto';
  }
}

function downloadExcel() {
  window.location.href = '/api/download-excel';
}

async function resetTable() {
  try {
    const response = await fetch('/api/reset-excel', { method: 'POST' });
    if (response.ok) {
      data = [];
      updateTable();
    } else {
      console.error('Failed to reset Excel file');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById('download').addEventListener('click', downloadExcel);
document.getElementById('reset').addEventListener('click', resetTable);

setInterval(fetchData, 2000); // Mettre à jour toutes les minutes
fetchData();
