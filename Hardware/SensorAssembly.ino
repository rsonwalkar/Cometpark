#include <VirtualWire.h>

//Parking space ID.
char PARKING_SPACE_ID = '2';

//Parking space status.
char PARKING_SPACE_VACANT_STATUS = '0';
char PARKING_SPACE_OCCUPIED_STATUS = '1';

//Flag to determine if an object was detected in last sensor activity.
boolean objectDetected = false;

//Message parameters.
char message[] = {'0', '0'};
int PARKING_SPACE_ID_INDEX = 0;
int PARKING_SPACE_STATUS_INDEX = 1;
int messageAttempts = 0;
int MAX_MESSAGE_ATTEMPTS = 4;
int DELAY = 3500;

void setup() {
  //Initialize the IO and ISR.
  vw_set_ptt_inverted(true);
  
  //Define transmission pin.
  vw_set_tx_pin(2);
  
  //Set bits per second.
  vw_setup(4000);
  
  //Set LED output.
  pinMode(13, OUTPUT);
  
  //Set data rate.
  Serial.begin(9600);
}

void loop() {
  //Read sensor input.
  int sensorValue = analogRead(0);
  
  if(70 < sensorValue) {
    //Object detected. Glow LED.
    digitalWrite(13, 1);
    
    Serial.println("Object detected");
    
    //Transmit message only if the object is being detected for the first time.
    if(false == objectDetected) {
      objectDetected = true;
      
      message[PARKING_SPACE_ID_INDEX] = PARKING_SPACE_ID;
      message[PARKING_SPACE_STATUS_INDEX] = PARKING_SPACE_OCCUPIED_STATUS;
      messageAttempts = MAX_MESSAGE_ATTEMPTS;
    }
  } else {
    //No object detected. Turn off LED.
    digitalWrite(13, 0);
    
    Serial.println("Nothing detected");
    
    //Transmit message only if no object is being detected for the first time.
    if(true == objectDetected) {
      objectDetected = false;
      
      message[PARKING_SPACE_ID_INDEX] = PARKING_SPACE_ID;
      message[PARKING_SPACE_STATUS_INDEX] = PARKING_SPACE_VACANT_STATUS;
      messageAttempts = MAX_MESSAGE_ATTEMPTS;
    }
  }
  
  //Transmit message, if any.
  if(0 < messageAttempts) {
    sendMessage(message);
    
    messageAttempts--;
  }
  
  //Pause.
  delay(DELAY);
}

//Function to transmit message using RF module.
void sendMessage(char *message) {
  //Transmit message.
  vw_send((uint8_t *)message, strlen(message));
  Serial.println("Message sent");
  
  //Wait until the whole message is sent.
  vw_wait_tx();
}
