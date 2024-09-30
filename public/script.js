document.addEventListener('DOMContentLoaded', function() {
  const sensorTableBody = document.querySelector('#sensorTable tbody');

  // Fonction pour récupérer les données et mettre à jour le tableau
  function fetchData() {
    fetch('/api/get-data')
      .then(response => response.json())
      .then(data => {
        sensorTableBody.innerHTML = ''; // Vider le tableau

        // Ajouter une nouvelle ligne pour chaque jeu de données
        data.forEach(entry => {
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

  // Appeler fetchData toutes les 5 secondes pour mettre à jour les données en direct
  setInterval(fetchData, 5000);
});
