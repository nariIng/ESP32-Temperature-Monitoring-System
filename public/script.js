document.addEventListener('DOMContentLoaded', function() {
    const sensorTableBody = document.querySelector('#sensorTable tbody');
    const ctx = document.getElementById('temperatureChart').getContext('2d');
  
    // Fonction pour convertir le temps en secondes (de hh:mm:ss)
    function timeToSeconds(time) {
      const [hh, mm, ss] = time.split(':').map(Number);
      return hh * 3600 + mm * 60 + ss;
    }
  
    // Fonction pour convertir les secondes en hh:mm:ss
    function secondsToTime(seconds) {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
  
    // Initialisation du graphique
    const temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Temps en secondes
        datasets: [
          { label: 'T_1', data: [], borderColor: 'red', fill: false },
          { label: 'T_2', data: [], borderColor: 'blue', fill: false },
          { label: 'T_3', data: [], borderColor: 'green', fill: false },
          { label: 'T_4', data: [], borderColor: 'orange', fill: false },
          { label: 'T_5', data: [], borderColor: 'purple', fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Le ratio du graphique ne sera pas forcé
        scales: {
          x: {
            title: {
              display: true,
              text: 'Temps (hh:mm:ss)'
            },
            ticks: {
              callback: function(value, index, values) {
                return values[index].label; // Afficher directement les labels du temps (hh:mm:ss)
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Température (°C)'
            }
          }
        }
      }
    });
  
    // Fonction pour récupérer les données et mettre à jour le tableau et le graphique
// Fonction pour récupérer les données et mettre à jour le tableau et le graphique
function fetchData() {
  fetch('/api/get-data')
    .then(response => response.json())
    .then(data => {
      sensorTableBody.innerHTML = ''; // Vider le tableau

      // Limiter les données aux 10 dernières entrées
      const last10Entries = data.slice(-10);

      // Ajouter une nouvelle ligne pour chaque jeu de données
      last10Entries.forEach(entry => {
        const row = document.createElement('tr');

        row.innerHTML = 
          `<td>${entry.time}</td>
          <td>${entry.T_1}</td>
          <td>${entry.T_2}</td>
          <td>${entry.T_3}</td>
          <td>${entry.T_4}</td>
          <td>${entry.T_5}</td>`;

        sensorTableBody.appendChild(row);
        document.getElementById("time").textContent = entry.time;
        document.getElementById("temperature_1").textContent = entry.T_1;
        document.getElementById("temperature_2").textContent = entry.T_2;
        document.getElementById("temperature_3").textContent = entry.T_3;
        document.getElementById("temperature_4").textContent = entry.T_4;
        document.getElementById("temperature_5").textContent = entry.T_5;
      });

      // Mettre à jour les données du graphique
      const timeLabels = last10Entries.map(entry => entry.time); // Utiliser le format hh:mm:ss pour les labels
      const timeInSeconds = last10Entries.map(entry => timeToSeconds(entry.time)); // Convertir en secondes
      const T_1 = last10Entries.map(entry => entry.T_1);
      const T_2 = last10Entries.map(entry => entry.T_2);
      const T_3 = last10Entries.map(entry => entry.T_3);
      const T_4 = last10Entries.map(entry => entry.T_4);
      const T_5 = last10Entries.map(entry => entry.T_5);

      // Mettre à jour les labels et les données du graphique
      temperatureChart.data.labels = timeInSeconds.map(seconds => secondsToTime(seconds)); // Convertir les secondes en hh:mm:ss pour les labels
      temperatureChart.data.datasets[0].data = T_1;
      temperatureChart.data.datasets[1].data = T_2;
      temperatureChart.data.datasets[2].data = T_3;
      temperatureChart.data.datasets[3].data = T_4;
      temperatureChart.data.datasets[4].data = T_5;

      // Ajuster la portée de l'axe des x pour démarrer à partir du temps initial dans le tableau
      temperatureChart.options.scales.x.min = timeInSeconds[0]; // Définir le temps initial comme min
      temperatureChart.options.scales.x.max = timeInSeconds[timeInSeconds.length - 1]; // Définir le temps final comme max

      // Rafraîchir le graphique
      temperatureChart.update();
    })
    .catch(error => console.error('Error fetching data:', error));
}

  
    // Appeler fetchData toutes les 4 secondes pour mettre à jour les données en direct
    setInterval(fetchData, 4000);
  
    // Bouton de téléchargement du fichier Excel
    document.getElementById('download-btn').addEventListener('click', () => {
      window.location.href = '/api/download';
    });
  
    // Bouton reset pour réinitialiser les données
    document.getElementById('reset-btn').addEventListener('click', () => {
      fetch('/api/reset', {
        method: 'POST'
      })
        .then(response => response.text())
        .then(data => {
          console.log(data);
          // Optionnel : mettre à jour l'interface utilisateur
          alert('Données réinitialisées');
        })
        .catch(error => console.error('Erreur:', error));
    });
  
    // Gestionnaire d'événements pour le menu hamburger
    const hamburger = document.querySelector("#toggle-btn");
    hamburger.addEventListener("click", function() {
      document.querySelector("#sidebar").classList.toggle("expand");
    });
  });
