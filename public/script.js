document.addEventListener('DOMContentLoaded', function() {
  const sensorTableBody = document.querySelector('#sensorTable tbody');
  const downloadBtn = document.getElementById('download-btn');
  const resetBtn = document.getElementById('reset-btn');

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
          document.getElementById("time").textContent= entry.time;
          document.getElementById("temperature_1").textContent= entry.T_1;
          document.getElementById("temperature_2").textContent= entry.T_2;
          document.getElementById("temperature_3").textContent= entry.T_3;
          document.getElementById("temperature_4").textContent= entry.T_4;
          document.getElementById("temperature_5").textContent= entry.T_5;

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

  // Fonction pour télécharger le fichier CSV depuis l'ESP32
  function downloadCSV() {
    fetch('/api/download-csv')
      .then(response => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Error downloading CSV file');
        }
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test.csv'; // Nom du fichier à télécharger
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => console.error('Error downloading CSV:', error));
  }

  // Fonction pour réinitialiser les données sur l'ESP32
  function resetData() {
    fetch('/api/reset-data', { method: 'POST' })
      .then(response => {
        if (response.ok) {
          console.log('Data reset successfully');
          fetchData(); // Rafraîchir les données après la réinitialisation
        } else {
          throw new Error('Error resetting data');
        }
      })
      .catch(error => console.error('Error resetting data:', error));
  }

  // Appeler fetchData toutes les 5 secondes pour mettre à jour les données en direct
  setInterval(fetchData, 5000);

  // Gestionnaire d'événements pour le téléchargement du fichier CSV
  downloadBtn.addEventListener('click', downloadCSV);

  // Gestionnaire d'événements pour réinitialiser les données
  resetBtn.addEventListener('click', resetData);

  // Gestionnaire d'événements pour le menu hamburger
  const hamburger = document.querySelector("#toggle-btn");
  hamburger.addEventListener("click", function(){
      document.querySelector("#sidebar").classList.toggle("expand");
  });
});
