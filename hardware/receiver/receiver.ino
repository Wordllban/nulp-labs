/*

  - Arduino Uno
  - RF 433MHz Receiver

*/

#include <RH_ASK.h>
// Not actualy used but needed to compile
#include <SPI.h>


const int SOLENOID_RELAY_PIN = 3;

RH_ASK driver;

void setup() {
  // Debugging only
  Serial.begin(9600);
  
  // Initialize RF Driver instance
  if(driver.init()) {
    Serial.println("Driver initialized successfully");
  } else {
    Serial.println("Driver initialization failed");
  }

  // Setup solenoid lock
  pinMode(SOLENOID_RELAY_PIN, OUTPUT);
}

// Variable to handle state of alarm
uint8_t lockState;
void loop() {
  // Initialize buffer with 1 byte size 
  uint8_t buf[1];
  uint8_t buflen = sizeof(buf);

  if (driver.recv(buf, &buflen)) {
    // Convert the ASCII character to its numeric equivalent 
    lockState = buf[0] - '0';
    Serial.print("Message received: ");
    Serial.println(lockState); 
  }

  if(lockState) {
    digitalWrite(SOLENOID_RELAY_PIN, HIGH);
  } else {
    digitalWrite(SOLENOID_RELAY_PIN, LOW);
  }
}