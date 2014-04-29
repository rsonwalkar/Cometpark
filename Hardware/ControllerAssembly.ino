#include <VirtualWire.h>

//Parking lot status.
int parkingLotStatus[] = {0, 0, 0, 0};
int TOTAL_PARKING_SPACES = 4;

void setup() {
  //Initialize the IO and ISR.
  vw_set_ptt_inverted(true);
  
  //Define reception pin.
  vw_set_rx_pin(12);
  
  //Set bits per second.
  vw_setup(4000);
  
  //Set LED output.
  pinMode(13, OUTPUT);
  
  //Set data rate.
  Serial.begin(9600);
  
  //Start reception.
  vw_rx_start();
}

void loop() {
  //Message data structure.
  uint8_t buffer[VW_MAX_MESSAGE_LEN];
  uint8_t bufferLength = VW_MAX_MESSAGE_LEN;
  
  //Parking space and status parameters.
  int parkingSpaceId = 0;
  int parkingSpaceStatus = 0;
  
  //Receive message, if any.
  if(vw_get_message(buffer, &bufferLength)) {
    //Determine parking space status.
    if('1' == buffer[1]) {
      //An object detected by sensor assembly.
      parkingSpaceStatus = 1;
    } else {
      //No object detected by sensor assembly.
      parkingSpaceStatus = 0;
    }
    
    //Determine parking space ID.
    switch(buffer[0]) {
      case '0':
        parkingSpaceId = 0;
        
        break;
      case '1':
        parkingSpaceId = 1;
        
        break;
      case '2':
        parkingSpaceId = 2;
        
        break;
      case '3':
        parkingSpaceId = 3;
        
        break;
    }
    
    //Transmit parking space and status parameters.
    Serial.print(parkingSpaceId);
    Serial.println(parkingSpaceStatus);
    
    //Update parking lot status.
    parkingLotStatus[parkingSpaceId] = parkingSpaceStatus;
    
    //Update LED status.
    updateLED(parkingLotStatus, TOTAL_PARKING_SPACES);
  }
}

//Turns LED on or off depending on whether some parking space is occupied within given parking lot.
void updateLED(int parkingLotStatus[], int totalParkingSpaces) {
  boolean parkingSpaceOccupied = false;
  
  //CHeck every parking space status.
  for(int count = 0; count < totalParkingSpaces; count++) {
    if(1 == parkingLotStatus[count]) {
      //Some parking space occupied.
      parkingSpaceOccupied = true;
      
      break;
    }
  }
  
  //Blink LED to notify change and signal reception.
  blinkLED();
  
  //Turn LED on or off depending on whether some parking space is occupied or vacant.
  if(true == parkingSpaceOccupied) {
    //Some parking space occupied.
    turnOnLED();
  } else {
    //No parking space occupied.
    turnOffLED();
  }
}

//Blinks LED once.
void blinkLED() {
  digitalWrite(13, 0);
  delay(350);
  digitalWrite(13, 1);
  delay(350);
  digitalWrite(13, 0);
}

//Turns LED on.
void turnOnLED() {
  digitalWrite(13, 1);
}

//Turns LED off.
void turnOffLED() {
  digitalWrite(13, 0);
}
