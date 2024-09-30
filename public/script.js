document.addEventListener('DOMContentLoaded', function() {
  const sensorTableBody = document.querySelector('#sensorTable tbody');

  // Configuration initiale du graphique
  const ctx = document.getElementById('temperatureChart').getContext('2d');
  const temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Les labels (temps) seront mis à jour dynamiquement
      datasets: [
        {
          label: 'Temp 1',
          borderColor: 'red',
          data: [],
          fill: false,
        },
        {
          label: 'Temp 2',
          borderColor: 'blue',
          data: [],
          fill: false,
        },
        {
          label: 'Temp 3',
          borderColor: 'green',
          data: [],
          fill: false,
        },
        {
          label: 'Temp 4',
          borderColor: 'orange',
          data: [],
          fill: false,
        },
        {
          label: 'Temp 5',
          borderColor: 'purple',
          data: [],
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: {
              minute: 'HH:mm:ss'
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        }
      }
    }
  });

  // Fonction pour récupérer les données et mettre à jour le tableau et le graphique
  function fetchData() {
    fetch('/api/get-data')
      .then(response => response.json())
      .then(data => {
        sensorTableBody.innerHTML = ''; // Vider le tableau

        // Limiter les données aux 10 dernières entrées
        const last10Entries = data.slice(-10);

        // Ajouter une nouvelle ligne pour chaque jeu de données dans le tableau
        last10Entries.forEach(entry => {
          const row = document.createElement('tr');

          row.innerHTML = `
            <td>${entry.time}</td>
            <td>${entry.T_1}</td>
            <td>${entry.T_2}</td>
            <td>${entry.T_3}</td>
            <td>${entry.T_4}</td>
            <td>${entry.T_5}</td>
          `;

          sensorTableBody.appendChild(row);
        });

        // Mettre à jour le graphique avec les nouvelles données
        const latestEntry = last10Entries[last10Entries.length - 1];
        if (latestEntry) {
          const { time, T_1, T_2, T_3, T_4, T_5 } = latestEntry;

          // Ajouter l'heure et les valeurs des capteurs au graphique
          temperatureChart.data.labels.push(time);
          temperatureChart.data.datasets[0].data.push(T_1);
          temperatureChart.data.datasets[1].data.push(T_2);
          temperatureChart.data.datasets[2].data.push(T_3);
          temperatureChart.data.datasets[3].data.push(T_4);
          temperatureChart.data.datasets[4].data.push(T_5);

          // Limiter les données du graphique à 10 points pour chaque série
          if (temperatureChart.data.labels.length > 10) {
            temperatureChart.data.labels.shift(); // Retirer le plus ancien label
            temperatureChart.data.datasets.forEach(dataset => dataset.data.shift()); // Retirer les anciennes données
          }

          // Mettre à jour le graphique
          temperatureChart.update();
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Appeler fetchData toutes les 5 secondes pour mettre à jour les données en direct
  setInterval(fetchData, 5000);
});



const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", function(){
    document.querySelector("#sidebar").classList.toggle("expand");
})
