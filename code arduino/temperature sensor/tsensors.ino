#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SPI.h>
#include <SD.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Wi-Fi configuration
const char* ssid = "Arivelo2";
const char* password = "72O##BlablA##z69";
const char* serverName = "https://joely-project.vercel.app/api/post-data";

// DS18B20 pin configuration
const int sensorPins[] = {15, 4, 13, 14, 21}; // Array of sensor pins
const int numSensors = 5; // Number of sensors

// Variables to store temperature readings
float temperatures[numSensors];

// SD card configuration
const char* filename = "/test.csv";
const int chipSelect = 5; // Chip select pin for SD card

// NTP (Network Time Protocol) configuration
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 3600 * 3, 2000); // Update time every 60 seconds

// OneWire and DallasTemperature objects for each sensor
OneWire oneWire[numSensors] = {OneWire(sensorPins[0]), OneWire(sensorPins[1]), OneWire(sensorPins[2]), OneWire(sensorPins[3]), OneWire(sensorPins[4])};
DallasTemperature sensors[numSensors] = {DallasTemperature(&oneWire[0]), DallasTemperature(&oneWire[1]), DallasTemperature(&oneWire[2]), DallasTemperature(&oneWire[3]), DallasTemperature(&oneWire[4])};

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize the NTP client
  timeClient.begin();

  // Initialize temperature sensors
  for (int i = 0; i < numSensors; i++) {
    sensors[i].begin();
  }

  // Initialize the SD card
  if (!SD.begin(chipSelect)) {
    Serial.println("Error initializing SD card!");
    return;
  }
  if (SD.exists(filename)) {
    SD.remove(filename);
  }
  Serial.println("SD card initialized.");

  // Create and write headers to the CSV file
  File file = SD.open(filename, FILE_WRITE);
  if (file) {
    file.println("Time, T_1, T_2, T_3, T_4, T_5");
    file.close();
  } else {
    Serial.println("Error opening file.");
  }
}

void loop() {
  // Update time from NTP server
  timeClient.update();
  String currentTime = timeClient.getFormattedTime();

  // Request temperatures from all sensors
  for (int i = 0; i < numSensors; i++) {
    sensors[i].requestTemperatures();
    temperatures[i] = sensors[i].getTempCByIndex(0);
    Serial.print(" T_");
    Serial.print(i + 1);
    Serial.print(": ");
    Serial.print(temperatures[i]);
    Serial.print(" C ");
  }
  Serial.println();

  // Append data to the SD card
  File file = SD.open(filename, FILE_APPEND);
  if (file) {
    file.print(currentTime + ",");
    for (int i = 0; i < numSensors; i++) {
      file.print(temperatures[i]);
      if (i < numSensors - 1) {
        file.print(",");
      } else {
        file.println();
      }
    }
    file.close();
  } else {
    Serial.println("Error opening file for writing.");
  }

  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String httpRequestData = "time=" + currentTime + "&T_1=" + String(temperatures[0]) + "&T_2=" + String(temperatures[1]) + "&T_3=" + String(temperatures[2]) + "&T_4=" + String(temperatures[3]) + "&T_5=" + String(temperatures[4]);

    int httpResponseCode = http.POST(httpRequestData);
    if (httpResponseCode > 0) {
      Serial.println("Data sent to server.");
    } else {
      Serial.println("Error sending data to server.");
    }
    http.end();
  }

  // Wait for a minute before next reading
  delay(2000);
}