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

  // Gestionnaire d'événements pour le téléchargement du fichier Excel
  document.getElementById('download-btn').addEventListener('click', function() {
  window.location.href = '/api/download-excel';
  });

  // Réinitialiser les données
  document.getElementById('reset-btn').addEventListener('click', function() {
    fetch('/api/reset-excel', {
      method: 'POST'
    })
    .then(response => response.text())
    .then(data => {
      console.log('Data reset:', data);
      alert('Les données ont été réinitialisées');
    })
    .catch(error => {
      console.error('Error resetting data:', error);
    });
  });

  // Gestionnaire d'événements pour le menu hamburger
  const hamburger = document.querySelector("#toggle-btn");
  hamburger.addEventListener("click", function(){
      document.querySelector("#sidebar").classList.toggle("expand");
  });
});
