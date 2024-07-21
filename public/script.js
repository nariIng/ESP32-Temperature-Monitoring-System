async function fetchData() {
    try {
      const response = await fetch('http://10.18.197.151'); // Remplacez par l'adresse IP publique ou le DNS dynamique
      const data = await response.text();
      
      // Séparation des valeurs à partir de la réponse du serveur
      const lines = data.split('\n');
      const time = lines[0].split(': ')[1]; // Extraction du temps
      const temperature = lines[1].split(': ')[1]; // Extraction de la température
      const humidity = lines[2].split(': ')[1]; // Extraction de l'humidité
  
      // Affichage des valeurs séparées sur la page web
      document.getElementById('time').textContent = `Time: ${time}`;
      document.getElementById('temperature').textContent = `Temperature: ${temperature} °C`;
      document.getElementById('humidity').textContent = `Humidity: ${humidity} %`;
  
      return { time, temperature, humidity };
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById('time').textContent = 'Error fetching time';
      document.getElementById('temperature').textContent = 'Error fetching temperature';
      document.getElementById('humidity').textContent = 'Error fetching humidity';
    }
  }
  
  function downloadExcel(dataPoints) {
    const wsData = dataPoints.map(({ time, temperature, humidity }) => [time, humidity, temperature]);
    const ws = XLSX.utils.aoa_to_sheet([
      ['Time', 'Humidity', 'Temperature'],
      ...wsData
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data');
    XLSX.writeFile(wb, 'sensor_data.xlsx');
  }
  
  let dataPoints = [];
  document.getElementById('download').addEventListener('click', () => downloadExcel(dataPoints));
  
  setInterval(async () => {
    const data = await fetchData();
    if (data) {
      dataPoints.push(data);
    }
  }, 1000); // Fetch data every 2 seconds
  
  // Initial fetch
  fetchData();
  