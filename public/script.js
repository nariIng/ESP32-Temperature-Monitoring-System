let data = [];

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



function downloadExcel() {
  const worksheet = XLSX.utils.json_to_sheet(data, { header: ["time", "humidity", "temperature", "temperature_1" ,"temperature_2", 
                                                              "temperature_3", "temperature_4", "temperature_5"] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Data");

  // Définir les noms des colonnes
  XLSX.utils.sheet_add_aoa(worksheet, [["Temperature_1 (°C)", "Temperature_2 (°C)", "Temperature_3 (°C)",
                                        "Temperature_4 (°C)", "Temperature_5 (°C)"]], { origin: "A1" });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sensor_data.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function resetTable() {
  data = [];
  updateTable();
}

const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", function(){
    document.querySelector("#sidebar").classList.toggle("expand");
})

document.getElementById('download').addEventListener('click', downloadExcel);
document.getElementById('reset').addEventListener('click', resetTable);

setInterval(fetchData, 2000); // Mettre à jour toutes les minutes
