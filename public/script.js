const ctx = document.getElementById('TemperatureChart').getContext('2d');
let temperatureChart;

// Fonction pour mettre à jour le tableau et le graphique
function updateChart(data) {
    // Récupérer les températures et le temps
    const labels = data.map(entry => entry.time);
    const T_1 = data.map(entry => entry.T_1);
    const T_2 = data.map(entry => entry.T_2);
    const T_3 = data.map(entry => entry.T_3);
    const T_4 = data.map(entry => entry.T_4);
    const T_5 = data.map(entry => entry.T_5);

    // Si le graphique existe déjà, le détruire
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    // Créer un nouveau graphique
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'T_1',
                    data: T_1,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                },
                {
                    label: 'T_2',
                    data: T_2,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false
                },
                {
                    label: 'T_3',
                    data: T_3,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                },
                {
                    label: 'T_4',
                    data: T_4,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false
                },
                {
                    label: 'T_5',
                    data: T_5,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Temps'
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
}

// Récupérer les données et mettre à jour le tableau et le graphique
function fetchData() {
    fetch('/api/get-data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Mettre à jour le tableau et le graphique
            updateChart(data);
        })
        .catch(error => console.error('Erreur:', error));
}

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
