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

  // Reset the LoRa module
  digitalWrite(RFM95_RST, LOW); // Pull the reset pin low
  delay(10); // Hold it for 10 milliseconds
  digitalWrite(RFM95_RST, HIGH); // Then pull it high again
  delay(10); // Allow some time for the module to reset

  // Initialize LoRa module
  if (!rf95.init()) {
    Serial.println("LoRa initialization failed. Check your connections.");
    while (true); // Stay in an infinite loop if initialization fails
  }

  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("setFrequency failed");
    while (1); // Stay in an infinite loop if setting the frequency fails
  } else {
    Serial.println("setFrequency Success");
  }

  rf95.setTxPower(23, false);
}
 
void loop() {
  delay(100);
  if (rf95.available()) {
    uint8_t bufReceived[RH_RF95_MAX_MESSAGE_LEN]; // Buffer to hold received data
    uint8_t len = sizeof(bufReceived); // Length of received data

    // Attempt to receive data
    if (rf95.recv(bufReceived, &len)) {
      DynamicJsonDocument jsonDoc(256);
      DeserializationError error = deserializeJson(jsonDoc, bufReceived, len);

      // Check if deserialization was successful
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.c_str());
        return;
      }

      // Retrieve data from JSON
      float temperature = jsonDoc["temperature"];
      float pressure = jsonDoc["pressure"];
      float altitude = jsonDoc["altitude"];
      float qw = jsonDoc["qw"];
      float qx = jsonDoc["qx"];
      float qy = jsonDoc["qy"];
      float qz = jsonDoc["qz"];

      // Send the parsed data over Serial as JSON
      DynamicJsonDocument outputJson(256);
      outputJson["temperature"] = temperature;
      outputJson["pressure"] = pressure;
      outputJson["altitude"] = altitude;
      outputJson["qw"] = qw;
      outputJson["qx"] = qx;
      outputJson["qy"] = qy;
      outputJson["qz"] = qz;

      // Serialize and print to Serial
      String outputString;
      serializeJson(outputJson, outputString);
      Serial.println(outputString);
    } else {
      Serial.println("Receive failed");
    }
  }
}
