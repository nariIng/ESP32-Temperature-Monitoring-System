document.addEventListener('DOMContentLoaded', function() {
  const sensorTableBody = document.querySelector('#sensorTable tbody');
  const downloadBtn = document.getElementById('download-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Fonction pour récupérer les données et mettre à jour le tableau
  function fetchData() {
    fetch('/api/get-latest-data')
      .then(response => response.text())
      .then(data => {
        sensorTableBody.innerHTML = ''; // Vider le tableau

        const rows = data.trim().split('\n').slice(1); // Ignorer l'en-tête CSV
        rows.forEach(row => {
          const cols = row.split(',');
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${cols[0]}</td>
            <td>${cols[1]}</td>
            <td>${cols[2]}</td>
            <td>${cols[3]}</td>
            <td>${cols[4]}</td>
            <td>${cols[5]}</td>
          `;
          sensorTableBody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Fonction pour télécharger le fichier CSV depuis le backend
  downloadBtn.addEventListener('click', function() {
    window.location.href = '/api/download'; // Téléchargement direct via le backend
  });

  // Fonction pour réinitialiser les données du tableau et du backend
  resetBtn.addEventListener('click', function() {
    fetch('/api/reset', { method: 'POST' }) // Envoie une requête pour réinitialiser le backend
      .then(response => {
        if (response.ok) {
          sensorTableBody.innerHTML = ''; // Vider le tableau côté frontend
          console.log('Tableau et base de données réinitialisés.');
        } else {
          console.error('Erreur lors de la réinitialisation.');
        }
      })
      .catch(error => console.error('Error resetting data:', error));
  });

  // Appeler fetchData toutes les 5 secondes pour mettre à jour les données en direct
  setInterval(fetchData, 5000);

  // Gestionnaire d'événements pour le menu hamburger
  const hamburger = document.querySelector("#toggle-btn");
  hamburger.addEventListener("click", function(){
    document.querySelector("#sidebar").classList.toggle("expand");
  });
});
