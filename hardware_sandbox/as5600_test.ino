//
//    FILE: AS5600_demo.ino
//  AUTHOR: Rob Tillaart
// PURPOSE: demo
//     URL: https://github.com/RobTillaart/AS5600
//
//  Examples may use AS5600 or AS5600L devices.
//  Check if your sensor matches the one used in the example.
//  Optionally adjust the code.


#include "AS5600.h"


AS5600 as5600;   //  use default Wire

int sensorValue;
float filteredValue = 0.0;

// Define constants for mapping
const int sensorMin = 0;
const int sensorMax = 4096;
const float outputMin = -1.0;
const float outputMax = 1.0;

// Define constants for noise filtering
const float filterAlpha = 0.1; // Adjust this value for the desired filtering strength


void setup()
{
  Serial.begin(9600);
  Serial.println(__FILE__);
  Serial.print("AS5600_LIB_VERSION: ");
  Serial.println(AS5600_LIB_VERSION);

  Wire.begin();

  as5600.begin(4);  //  set direction pin.
  as5600.setDirection(AS5600_CLOCK_WISE);  //  default, just be explicit.
  int b = as5600.isConnected();
  Serial.print("Connect: ");
  Serial.println(b);
  delay(1000);
}


void loop()
{
  //  Serial.print(millis());
  //  Serial.print("\t");
//   Serial.print(as5600.readAngle());
//   Serial.print("\t");
//   Serial.print(as5600.rawAngle());
//   Serial.print("\t")
//     Serial.println(as5600.rawAngle() * AS5600_RAW_TO_DEGREES);
    // Map the sensor value to the range of -1 to 1
   sensorValue = as5600.readAngle();
  float mappedValue = mapFloat(sensorValue, sensorMin, sensorMax, outputMin, outputMax);
  
  // Apply noise filtering
  filteredValue = filteredValue + filterAlpha * (mappedValue - filteredValue);
  
  // Output the filtered value
  if (filteredValue){
//    printf("float: %f, raw: %d\n", filteredValue, sensorValue);
      Serial.print(filteredValue);  
  }  
 delay(50);
}

// Function to map float values
float mapFloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//  -- END OF FILE --