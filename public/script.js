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
  const downloadButton = document.getElementById('download-btn');
  downloadButton.addEventListener('click', function() {
    window.location.href = '/api/generate-excel'; // Déclenche le téléchargement
  });

    // Gestionnaire d'événements pour la réinitialisation des données
    const resetButton = document.getElementById('reset-btn');
    resetButton.addEventListener('click', function() {
      fetch('/api/reset-data', { method: 'POST' })
        .then(response => response.text())
        .then(message => {
          alert(message); // Afficher un message de confirmation
          fetchData(); // Mettre à jour le tableau après réinitialisation
        })
        .catch(error => console.error('Error resetting data:', error));
    });

  // Gestionnaire d'événements pour le menu hamburger
  const hamburger = document.querySelector("#toggle-btn");
  hamburger.addEventListener("click", function(){
      document.querySelector("#sidebar").classList.toggle("expand");
  });
});
