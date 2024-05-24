/*
  MESSAGE TO ALBERT 24th of May, 2024

  #define BIKE_COLOR makes you choose which bike to upload code to

  It is possible to configure the min, max and base value per bike
*/

#include "AS5600.h"

// Uncomment which is applicable
// #define BIKE_COLOR "black"
#define BIKE_COLOR "brown"

AS5600 as5600;   //  use default Wire

int sensorValue;
float filteredValue = 0.0;
float mappedValue = 0.0;

// Define constants for mapping
const int sensorMin = (BIKE_COLOR == "black"? 750 : 1040); //0
const int sensorMax = (BIKE_COLOR == "black"? 2800 : 2800); //4096
const int sensorBase = (BIKE_COLOR == "black"? 2048 : 2048); //2048
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
  if (sensorValue < sensorBase){
    mappedValue = mapFloat(sensorValue, sensorMin, sensorBase, outputMin, 0.0);
  } else {
    mappedValue = mapFloat(sensorValue, sensorBase, sensorMax, 0.0, outputMax);
  }
  
  // Apply noise filtering
  filteredValue = filteredValue + filterAlpha * (mappedValue - filteredValue);

  //cut off edges that are bigger than sensorMax or smaller than sensorMin
  if (filteredValue > 1.0)
    filteredValue = 1.0;
  else if (filteredValue < -1.0)
    filteredValue = -1.0;
  
  // Output the filtered value
  Serial.print("float: ");
  Serial.print(filteredValue);
  Serial.print(", raw: ");
  Serial.println(sensorValue);

  delay(100);
}

// Function to map float values
float mapFloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//  -- END OF FILE --