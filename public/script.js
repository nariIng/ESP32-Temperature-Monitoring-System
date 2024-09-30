document.addEventListener('DOMContentLoaded', function() {
  const sensorTableBody = document.querySelector('#sensorTable tbody');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

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
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Fonction pour télécharger les données en Excel
  downloadBtn.addEventListener('click', function() {
    window.location.href = '../api/download-excel';
  });

  // Fonction pour réinitialiser la base de données
  resetBtn.addEventListener('click', function() {
    fetch('../api/reset-data', { method: 'POST' })
      .then(response => response.json())
      .then(message => {
        alert(message.message);
        fetchData(); // Actualiser le tableau
      })
      .catch(error => console.error('Error resetting data:', error));
  });

  // Appeler fetchData toutes les 5 secondes pour mettre à jour les données en direct
  setInterval(fetchData, 5000);
});
