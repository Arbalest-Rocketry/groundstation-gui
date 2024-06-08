#include <RH_RF95.h> // Include the LoRa library
#include <SPI.h>
#include <ArduinoJson.h> // Include the ArduinoJson library for JSON manipulation

#define RFM95_CS 1 // Define the chip select pin for LoRa module
#define RFM95_INT 8 // Define the interrupt pin for LoRa module
#define RFM95_RST 34 // Define the reset pin for LoRa module

#define RF95_FREQ 915.00

RH_RF95 rf95(RFM95_CS, RFM95_INT); // Initialize the LoRa module with the specified pins

unsigned long lastSwitchTime = 0; // Variable to keep track of the last switch time
const unsigned long switchInterval = 5000; // Interval for switching tasks in milliseconds

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
  unsigned long currentTime = millis();

  if (rf95.available()) {
    uint8_t bufReceived[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(bufReceived); // Length of received data
    if (rf95.recv(bufReceived, &len)) {
      DynamicJsonDocument jsonDoc(256);
      DeserializationError error = deserializeJson(jsonDoc, bufReceived, len);

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

      delay(300); // Delay for 1 second between data sends
    }
  }
}
