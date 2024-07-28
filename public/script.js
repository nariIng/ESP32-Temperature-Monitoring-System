let data = [];

async function fetchData() {
  const response = await fetch('/api/get-data');
  const sensorData = await response.json();

  document.getElementById('timestamp').textContent = new Date(sensorData.timestamp).toLocaleString();
  document.getElementById('humidity').textContent = sensorData.humidity;
  document.getElementById('temperature').textContent = sensorData.temperature;
  document.getElementById('temperature_1').textContent = sensorData.temperature_1;
  document.getElementById('temperature_2').textContent = sensorData.temperature_2;
  document.getElementById('temperature_3').textContent = sensorData.temperature_3;
  document.getElementById('temperature_4').textContent = sensorData.temperature_4;
  document.getElementById('temperature_5').textContent = sensorData.temperature_5;


  // Ajouter les nouvelles données au tableau
  data.push({
    time: new Date(sensorData.timestamp).toLocaleString(),
    humidity: sensorData.humidity,
    temperature: sensorData.temperature,
    temperature_1: sensorData.temperature_1,
    temperature_2: sensorData.temperature_2,
    temperature_3: sensorData.temperature_3,
    temperature_4: sensorData.temperature_4,
    temperature_5: sensorData.temperature_5,
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
    const cellHumidity = row.insertCell(1);
    const cellTemperature = row.insertCell(2);
    const cellTemperature_1 = row.insertCell(3);
    const cellTemperature_2 = row.insertCell(4);
    const cellTemperature_3 = row.insertCell(5);
    const cellTemperature_4 = row.insertCell(6);
    const cellTemperature_5 = row.insertCell(7);

    cellTime.textContent = entry.time;
    cellHumidity.textContent = entry.humidity;
    cellTemperature.textContent = entry.temperature;
    cellTemperature_1.textContent = entry.temperature_1;
    cellTemperature_2.textContent = entry.temperature_2;
    cellTemperature_3.textContent = entry.temperature_3;
    cellTemperature_4.textContent = entry.temperature_4;
    cellTemperature_5.textContent = entry.temperature_5
  });
}

function downloadExcel() {
  const worksheet = XLSX.utils.json_to_sheet(data, { header: ["time", "humidity", "temperature", "temperature_1" ,"temperature_2", 
                                                              "temperature_3", "temperature_4", "temperature_5"] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Data");

  // Définir les noms des colonnes
  XLSX.utils.sheet_add_aoa(worksheet, [["Time", "Humidity (%)", "Temperature (°C)", "Temperature_1 (°C)", 
                                        "Temperature_2 (°C)", "Temperature_3 (°C)", , "Temperature_4 (°C)", 
                                        "Temperature_5 (°C)"]], { origin: "A7" });

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

setInterval(fetchData, 2000); // Mettre à jour toutes les minutes
fetchData();
