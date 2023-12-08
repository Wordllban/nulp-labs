/*

  - ESP8266 Lolin v3
  - RF 433MHz Transmitter

*/

#include <RH_ASK.h>
// Not used directly but needed to compile
#include <SPI.h> 


#define ESP_D1_GPIO 5
#define ESP_D2_GPIO 4
#define ESP_D6_GPIO 12
// RF Driver instance configuration
RH_ASK driver(2000, 2, ESP_D2_GPIO, ESP_D1_GPIO);

// Send message to RF receiver
void switchAlarm(const char* message) {
  driver.send((uint8_t *)message, strlen(message));
  driver.waitPacketSent();
}

// Variable to handle state of alarm
// true = ON
// false = OFF - default
bool alarmState = false;
// Handle alarm state by button
void alarmButton() {
  byte buttonState = digitalRead(ESP_D6_GPIO);

  if(!buttonState) {
    // Reverse alarm state on button pull
    alarmState = !alarmState;
    // 1 - ON, 0 - OFF
    switchAlarm(alarmState ? "1" : "0");

    Serial.print("Alarm state: ");
    Serial.println(alarmState);
  }
}

void setup() {
  // Debugging only
  Serial.begin(115200);	  

  Serial.println("Driver initialization...");
 
  // Initialize RF Driver instance
  if(driver.init()) {
    Serial.println("Driver initialized successfully");
  } else {
    Serial.println("Driver initialization failed");
  }

  // Setup alarm button
  pinMode(ESP_D6_GPIO, INPUT_PULLUP);
}

void loop() {
  alarmButton();
  delay(3000);
}