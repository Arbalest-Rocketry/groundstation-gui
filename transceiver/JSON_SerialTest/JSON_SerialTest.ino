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
  float longitude = -79.506625;
void setup() {
  Serial.begin(9600); // Initialize serial communication
  while (!Serial);

}

void loop() {
  unsigned long currentTime = millis();
  uint8_t bufReceived[RH_RF95_MAX_MESSAGE_LEN];
  uint8_t len = sizeof(bufReceived); // Length of received data

  int randomAlt = random(0, 1000);
  int randomPress = random(0, 500);
  int randomTemp = random(0, 40);
  float randomqr = random(-1000, 1000) / 1000.0;
  float randomqi = random(-1000, 1000) / 1000.0;
  float randomqj = random(-1000, 1000) / 1000.0;
  float randomqk = random(-1000, 1000) / 1000.0;
  float latitude = 43.771870;
//-79.506625
  // Parse received JSON
  StaticJsonDocument<200> jsonDoc;
  // Serialize data into JSON format and send via serial
  float longitudeGoal= -79.415851;
  char jsonBuffer[200];
  jsonDoc["altitude"] = randomAlt;
  jsonDoc["pressure"] = randomPress;
  jsonDoc["temperature"] = randomTemp;
  jsonDoc["latitude"] = latitude;
  jsonDoc["longitude"] = longitude;
  
  jsonDoc["qw"] = randomqr;
  jsonDoc["qx"] = randomqi;
  jsonDoc["qy"] = randomqj;
  jsonDoc["qz"] = randomqk;
  
  if (longitude != longitudeGoal) {
    longitude += 0.001;
  }
  
  serializeJson(jsonDoc, jsonBuffer);
  Serial.write(jsonBuffer);
  Serial.write('\n');
  
  delay(300); // Delay for 1 second between data sends
}