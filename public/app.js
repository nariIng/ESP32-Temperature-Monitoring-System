// Importer Chart.js et l'adaptateur Luxon pour la gestion des dates
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';

// Fonction pour récupérer les données depuis l'API de l'ESP32
async function fetchTemperatureData() {
    try {
        const response = await axios.get('/get-latest-temperatures');
        return response.data; // Doit retourner un tableau de données avec timestamp et température
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return [];
    }
}

// Fonction pour créer un nouveau graphique avec les données
function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Créer le graphique avec Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Température',
                data: data.map(item => ({
                    x: DateTime.fromISO(item.time).toISO(),  // Convertir le timestamp au format ISO avec luxon
                    y: item.temperature // Valeur de température
                })),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',  // Unité de temps (minute, seconde, etc.)
                        tooltipFormat: 'TT', // Format d'affichage des dates dans le tooltip
                    },
                    title: {
                        display: true,
                        text: 'Temps'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Température (°C)'
                    }
                }
            }
        }
    });
}

// Fonction pour mettre à jour le graphique en temps réel
async function updateChart(chart) {
    const newData = await fetchTemperatureData();
    chart.data.datasets[0].data = newData.map(item => ({
        x: DateTime.fromISO(item.time).toISO(),  // Convertir le timestamp au format ISO
        y: item.temperature // Valeur de température
    }));
    chart.update();
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer les 10 dernières valeurs à l'initialisation
    const initialData = await fetchTemperatureData();
    
    // Créer le graphique
    const myChart = createChart(initialData);

    // Mettre à jour le graphique toutes les 2 secondes (données en temps réel)
    setInterval(() => {
        updateChart(myChart);
    }, 2000);
});

  
  const hamburger = document.querySelector("#toggle-btn");

  hamburger.addEventListener("click", function(){
      document.querySelector("#sidebar").classList.toggle("expand");
  })