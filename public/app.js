// Mise à jour du tableau des températures
async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    const tableBody = document.querySelector('#temperatureTable tbody');
    tableBody.innerHTML = '';
  
    data.forEach((entry) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${entry.time}</td>
                       <td>${entry.T_1}</td>
                       <td>${entry.T_2}</td>
                       <td>${entry.T_3}</td>
                       <td>${entry.T_4}</td>
                       <td>${entry.T_5}</td>`;
      tableBody.appendChild(row);
    });
  }
  
  // Télécharger le CSV
  document.getElementById('downloadBtn').addEventListener('click', () => {
    window.location.href = '/download';
  });
  
  // Réinitialiser les valeurs
  document.getElementById('resetBtn').addEventListener('click', async () => {
    await fetch('/reset', { method: 'POST' });
    alert('Données réinitialisées');
  });
  
  // Configuration du graphe en temps réel
  const ctx = document.getElementById('temperatureChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Temps
      datasets: [
        { label: 'Capteur 1', data: [] },
        { label: 'Capteur 2', data: [] },
        { label: 'Capteur 3', data: [] },
        { label: 'Capteur 4', data: [] },
        { label: 'Capteur 5', data: [] }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { type: 'time' },
        y: { beginAtZero: true }
      }
    }
  });
  
  // Mise à jour du graphe en temps réel via WebSocket
  const socket = io();
  socket.on('temperatureUpdate', (data) => {
    data.forEach((entry, index) => {
      chart.data.datasets[index].data.push({ x: entry.time, y: entry.value });
    });
    chart.update();
  });
  
  // Rafraîchir les données toutes les minutes
  setInterval(fetchData, 3000);
  