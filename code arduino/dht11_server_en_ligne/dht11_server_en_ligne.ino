#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SPI.h>
#include <SD.h>
// #include <DHT.h>

// #define DHTPIN 4
// #define DHTTYPE DHT11

const char* ssid = "Narindra";
const char* password = "narindra";
const char* serverName = "https://joely-project.vercel.app/api/post-data";

// Configuration de la broche pour le DS18B20
const int tab_1 = 15;
const int tab_2 = 4;
const int tab_3 = 13;
const int tab_4 = 14;
const int tab_5 = 21;

float temperature_1;
float temperature_2;
float temperature_3;
float temperature_4;
float temperature_5;

const char  *filename = "/test.csv";

OneWire oneWire_1(tab_1);
OneWire oneWire_2(tab_2);
OneWire oneWire_3(tab_3);
OneWire oneWire_4(tab_4);
OneWire oneWire_5(tab_5);

DallasTemperature sensors_1(&oneWire_1);
DallasTemperature sensors_2(&oneWire_2);
DallasTemperature sensors_3(&oneWire_3);
DallasTemperature sensors_4(&oneWire_4);
DallasTemperature sensors_5(&oneWire_5);

// Configuration pour la carte SD
const int chipSelect = 5; // Broche CS pour la carte SD

// DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  // Initialisation de la communication série
  Serial.begin(115200);
  sensors_1.begin();
	sensors_2.begin();
	sensors_3.begin();
	sensors_4.begin();
	sensors_5.begin();
  // Initialisation de la carte SD
  if (!SD.begin(chipSelect)) {
    Serial.println("Erreur de lecture de la carte SD !");
    return;
  }
  if (SD.exists(filename))
  {
    SD.remove(filename);
  }
  Serial.println("Carte SD initialisée.");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");

  File fichier = SD.open(filename, FILE_WRITE);
  if (fichier) {
    // Écriture des en-têtes dans le fichier CSV
    fichier.println("Heure, T_1, T_2, T_3, T_4, T_5");
    fichier.close();
  } else {
    Serial.println("Erreur d'ouverture du fichier.");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    File fichier = SD.open(filename, FILE_APPEND);
    if (fichier) {
      sensors_1.requestTemperatures();
      temperature_1 = sensors_1.getTempCByIndex(0);
      Serial.print("  T_1 : ");
      Serial.print(temperature_1);
      fichier.print(temperature_1);
      fichier.print(",");
      Serial.print(" C");

      sensors_2.requestTemperatures();
      temperature_2 = sensors_2.getTempCByIndex(0);
      Serial.print("  T_2 : ");
      Serial.print(temperature_2);
      fichier.print(temperature_2);
      fichier.print(",");
      Serial.print(" C");

      sensors_3.requestTemperatures();
      temperature_3 = sensors_3.getTempCByIndex(0);
      Serial.print("  T_3 : ");
      Serial.print(temperature_3);
      fichier.print(temperature_3);
      fichier.print(",");
      Serial.print(" C");

      sensors_4.requestTemperatures();
      temperature_4 = sensors_4.getTempCByIndex(0);
      Serial.print("  T_4 : ");
      Serial.print(temperature_4);
      fichier.print(temperature_4);
      fichier.print(",");
      Serial.print(" C");

      sensors_5.requestTemperatures();
      temperature_5 = sensors_5.getTempCByIndex(0);
      Serial.print("  T_5 : ");
      Serial.print(temperature_5);
      fichier.println(temperature_5);
      Serial.println(" C");
    } else {
      Serial.println("Erreur d'ouverture du fichier.");
    }
    fichier.close();

    http.begin(serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String postData = "temperature_1=" + String(temperature_1) + "temperature_2=" + String(temperature_2) +
                      "temperature_3=" + String(temperature_3) + "temperature_4=" + String(temperature_4) +
                      "temperature_5=" +  String(temperature_5);
    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  delay(2000); // Envoyer des données toutes les minutes
}
