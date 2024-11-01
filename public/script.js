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
              callback: function(value) {
                return secondsToTime(value); // Convertir les secondes en hh:mm:ss pour l'affichage
              }
            },
            min: undefined // Cette valeur sera définie dynamiquement
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
  
            row.innerHTML = `
              <td>${entry.time}</td>
              <td>${entry.T_1}</td>
              <td>${entry.T_2}</td>
              <td>${entry.T_3}</td>
              <td>${entry.T_4}</td>
              <td>${entry.T_5}</td>
            `;
  
            sensorTableBody.appendChild(row);
            document.getElementById("time").textContent = entry.time;
            document.getElementById("temperature_1").textContent = entry.T_1;
            document.getElementById("temperature_2").textContent = entry.T_2;
            document.getElementById("temperature_3").textContent = entry.T_3;
            document.getElementById("temperature_4").textContent = entry.T_4;
            document.getElementById("temperature_5").textContent = entry.T_5;
          });
  
          // Mettre à jour les données du graphique
          // Mettre à jour les données du graphique
          const timeLabels = data.map(entry => entry.time); // Utiliser le format hh:mm:ss directement pour les labels
          const T_1 = data.map(entry => entry.T_1);
          const T_2 = data.map(entry => entry.T_2);
          const T_3 = data.map(entry => entry.T_3);
          const T_4 = data.map(entry => entry.T_4);
          const T_5 = data.map(entry => entry.T_5);

          // Mettre à jour les labels et les données du graphique
          temperatureChart.data.labels = timeLabels; // Mettre les labels au format hh:mm:ss
          temperatureChart.data.datasets[0].data = T_1;
          temperatureChart.data.datasets[1].data = T_2;
          temperatureChart.data.datasets[2].data = T_3;
          temperatureChart.data.datasets[3].data = T_4;
          temperatureChart.data.datasets[4].data = T_5;
  
          // Rafraîchir le graphique
          temperatureChart.update();
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  
    // Appeler fetchData toutes les 4 secondes pour mettre à jour les données en direct
    setInterval(fetchData, 5000);
  
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
  
  