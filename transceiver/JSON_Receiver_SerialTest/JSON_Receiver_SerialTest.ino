#include <RH_RF95.h> // Include the LoRa library
#include <SPI.h>
#include <ArduinoJson.h> // Include the ArduinoJson library for JSON manipulation

#define RFM95_CS 1 // Define the chip select pin for LoRa module
#define RFM95_INT 8 // Define the interrupt pin for LoRa module
#define RFM95_RST 34 // Define the reset pin for LoRa module

#define RF95_FREQ 915.00

RH_RF95 rf95(RFM95_CS, RFM95_INT); // Initialize the LoRa module with the specified pins

void setup() {
  Serial.begin(9600); // Initialize serial communication
  while (!Serial);

  pinMode(RFM95_RST, OUTPUT); // Set reset pin as output
  digitalWrite(RFM95_RST, HIGH); // Keep reset pin high initially

  // Initialize LoRa module
  if (!rf95.init()) {
    Serial.println("LoRa initialization failed. Check your connections.");
    while (true);
  } 

  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("setFrequency failed");
    while (1);
  } else {
    Serial.println("setFrequency Success");
  }
  rf95.setTxPower(23, false);
}

void loop() {
  if (rf95.available()) {
    uint8_t bufReceived[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(bufReceived); // Length of received data
    if (rf95.recv(bufReceived, &len)) {
      String receivedData = String((char*)bufReceived, len);

      if (receivedData.startsWith("JSON_START")) {
        String jsonData = receivedData.substring(strlen("JSON_START"));
        DynamicJsonDocument jsonDoc(256);
        DeserializationError error = deserializeJson(jsonDoc, jsonData);
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
        } else {
          // Create a JSON string to send over Serial
          String jsonString;
          serializeJson(jsonDoc, jsonString);
          Serial.write(jsonString.c_str(), jsonString.length());
          Serial.write('\n'); // Add a newline character for better readability
        }
      } else if (receivedData.startsWith("VIDEO_START")) {
        String videoData = receivedData.substring(strlen("VIDEO_START"));
        Serial.write(videoData.c_str(), videoData.length());
      }
    }
  }
}
