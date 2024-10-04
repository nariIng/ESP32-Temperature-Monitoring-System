// Récupérer les données du serveur
fetch('/api/get-data')
  .then(response => response.json())
  .then(sensorData => {
    // Conversion du temps en secondes pour chaque point de donnée
    const timeLabels = sensorData.map(data => timeToSeconds(data.time));
    
    // Extraire les données de température
    const T_1 = sensorData.map(data => data.T_1);
    const T_2 = sensorData.map(data => data.T_2);
    const T_3 = sensorData.map(data => data.T_3);
    const T_4 = sensorData.map(data => data.T_4);
    const T_5 = sensorData.map(data => data.T_5);

    // Créer le graphique
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeLabels,  // Temps en secondes
        datasets: [
          {
            label: 'T_1',
            data: T_1,
            borderColor: 'red',
            fill: false
          },
          {
            label: 'T_2',
            data: T_2,
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'T_3',
            data: T_3,
            borderColor: 'green',
            fill: false
          },
          {
            label: 'T_4',
            data: T_4,
            borderColor: 'orange',
            fill: false
          },
          {
            label: 'T_5',
            data: T_5,
            borderColor: 'purple',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Temps (secondes)'
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
  })
  .catch(error => console.error('Erreur lors du chargement des données:', error));

// Fonction pour convertir le temps en secondes
function timeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
//////***///// */

document.addEventListener('DOMContentLoaded', function() {
  const sensorTableBody = document.querySelector('#sensorTable tbody');

  // Fonction pour récupérer les données et mettre à jour le tableau
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
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Appeler fetchData toutes les 4 secondes pour mettre à jour les données en direct
  setInterval(fetchData, 4000);

  document.getElementById('download-btn').addEventListener('click', () => {
    window.location.href = '/api/download';
});

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
  hamburger.addEventListener("click", function(){
      document.querySelector("#sidebar").classList.toggle("expand");
  });
});
