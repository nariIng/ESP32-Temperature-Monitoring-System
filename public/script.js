async function fetchData() {
  const response = await fetch('http://your_server.com/get-data');
  const data = await response.json();

  document.getElementById('temperature').textContent = data.temperature;
  document.getElementById('humidity').textContent = data.humidity;
  document.getElementById('timestamp').textContent = new Date(data.timestamp).toLocaleString();
}

setInterval(fetchData, 2000); // Mettre à jour toutes les minutes
fetchData();
