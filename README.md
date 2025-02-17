# ESP32 Temperature Monitoring System

![Project Banner](path_to_your_image)

## 🚀 Overview
Ce projet vise à surveiller les variations de température à l'aide de 5 capteurs connectés à un ESP32. Les données sont ensuite transmises à un serveur Node.js, qui les affiche sous forme de courbes de variation en fonction du temps.

## 🛠️ Technologies Utilisées
- **ESP32** : Microcontrôleur principal pour la lecture des capteurs
- **Capteurs de Température** : Mesure en temps réel
- **Node.js** : Serveur pour traiter et afficher les données
- **Chart.js/D3.js** : Visualisation des données sous forme de courbes
- **HTML/CSS/JavaScript** : Interface utilisateur

## 📸 Aperçu du Projet
![Diagramme de connexion](path_to_your_image)

## 📌 Installation et Configuration

### 1️⃣ Prérequis
- ESP32 avec 5 capteurs de température (ex: DS18B20, DHT11, etc.)
- Node.js installé sur votre machine
- Librairies Arduino requises (WiFi, HTTP, etc.)

### 2️⃣ Cloner le dépôt
```bash
git@github.com:nariIng/ESP32-Temperature-Monitoring-System.git
cd ESP32-Temperature-Monitoring-System
```

### 3️⃣ Installer les dépendances
```bash
npm install
```

### 4️⃣ Flasher l'ESP32
Configurer le fichier `.ino` avec votre réseau WiFi et téléverser via l'IDE Arduino.

### 5️⃣ Lancer le serveur
```bash
node server.js
```

## 📊 Interface & Visualisation
![Exemple de courbe](path_to_your_image)

L'interface affiche 5 courbes correspondant à chaque capteur. Les données sont mises à jour en temps réel.

## 🔗 Liens Utiles
- [Documentation ESP32](https://docs.espressif.com/projects/esp-idf/en/latest/)
- [Chart.js](https://www.chartjs.org/)
- [D3.js](https://d3js.org/)

## ✨ Auteurs & Contributeurs
Projet développé par **Narindranjanahary Emmanuela**. Contributions bienvenues !

## 📜 Licence
Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

