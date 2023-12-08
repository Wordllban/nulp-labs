/*

  - Arduino Uno
  - RF 433MHz Receiver

*/


#include <RH_ASK.h>
// Not actualy used but needed to compile
#include <SPI.h>

RH_ASK driver;

void setup() {
  // Debugging only
  Serial.begin(9600);
  
  if(driver.init()) {
    Serial.println("Driver initialized successfully");
  } else {
    Serial.println("Driver initialization failed");
  }
}

uint8_t alarmState;
void loop() {
  // Initialize buffer with 1 byte size 
  uint8_t buf[1];
  uint8_t buflen = sizeof(buf);

  if (driver.recv(buf, &buflen)) {
    // Convert the ASCII character to its numeric equivalent 
    alarmState = buf[0] - '0';
    Serial.print("Message received: ");
    Serial.println(alarmState); 
  }
}