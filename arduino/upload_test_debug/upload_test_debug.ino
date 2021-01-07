/* This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details. */
#include <lmic.h>
#include <hal/hal.h>
#include <Adafruit_BME680.h>
#include <Wire.h>
#include <ESP8266WiFi.h>

// LoraWAN Copyright (c) 2015 Thomas Telkamp and Matthijs Kooijman
// (c) 2018 Terry Moore, MCCI
// https://github.com/mcci-catena/arduino-lmic
// -------- LoRa PinMapping FeatherWing Octopus
const lmic_pinmap lmic_pins = {  
  .nss = 2,                            // Connected to pin D
  .rxtx = LMIC_UNUSED_PIN,             // For placeholder only, Do not connected on RFM92/RFM95
  .rst = LMIC_UNUSED_PIN,              // Needed on RFM92/RFM95? (probably not) D0/GPIO16 
  .dio = {
    15, 15, LMIC_UNUSED_PIN         }
};

static const u1_t PROGMEM DEVEUI[8]={
  0xB4,0x58,0x91,0x79,0x78,0x82,0x44,0x00};
void os_getDevEui (u1_t* buf) { 
  memcpy_P(buf, DEVEUI, 8);
}

static const u1_t PROGMEM APPEUI[8]={
  0xCF,0xAC,0x03,0xD0,0x7E,0xD5,0xB3,0x70};
void os_getArtEui (u1_t* buf) { 
  memcpy_P(buf, APPEUI, 8);
}

static const u1_t PROGMEM APPKEY[16]={
  0xDD,0xD1,0xF3,0x2E,0xAA,0x7A,0xCC,0xE4,0x87,0x82,0xF8,0x8F,0x2C,0xE8,0xE1,0x6C};
void os_getDevKey (u1_t* buf) {  
  memcpy_P(buf, APPKEY, 16);
};

volatile int LoRaWAN_Tx_Ready      = 0; // Merker für ACK 

int LoRaWAN_Rx_Payload = 0 ;
// -------- LoRa Event 
void onEvent (ev_t ev) { 
  Serial.print(os_getTime());
  Serial.print(": ");
  switch(ev) {
  case EV_SCAN_TIMEOUT:
    Serial.println(F("EV_SCAN_TIMEOUT"));
    break;
  case EV_BEACON_FOUND:
    Serial.println(F("EV_BEACON_FOUND"));
    break;
  case EV_BEACON_MISSED:
    Serial.println(F("EV_BEACON_MISSED"));
    break;
  case EV_BEACON_TRACKED:
    Serial.println(F("EV_BEACON_TRACKED"));
    break;
  case EV_JOINING:
    Serial.println(F("EV_JOINING"));
    break;
  case EV_JOINED:
    Serial.println(F("EV_JOINED"));
    // Disable link check validation (automatically enabled
    // during join, but not supported by TTN at this time).
    LMIC_setLinkCheckMode(0);
    break;
  case EV_RFU1:
    Serial.println(F("EV_RFU1"));
    break;
  case EV_JOIN_FAILED:
    Serial.println(F("EV_JOIN_FAILED"));
    break;
  case EV_REJOIN_FAILED:
    Serial.println(F("EV_REJOIN_FAILED"));
    break;
    break;
  case EV_TXCOMPLETE:
    Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
    if (LMIC.txrxFlags & TXRX_ACK)
      Serial.println(F("Received ack"));
    if (LMIC.dataLen) {
      Serial.println(F("Received "));
      Serial.println(LMIC.dataLen);
      Serial.println(F(" bytes of payload"));
      LoRaWAN_Rx_Payload = 0; 
      for (int i = 0;i<LMIC.dataLen;i++) { 
        Serial.println(LMIC.frame[i+ LMIC.dataBeg],HEX);
        LoRaWAN_Rx_Payload = 256*LoRaWAN_Rx_Payload+LMIC.frame[i+ LMIC.dataBeg];
      }
    }
    LoRaWAN_Tx_Ready = 1;
    // Schedule next transmission
    //os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(TX_INTERVAL), do_send);
    break;
  case EV_LOST_TSYNC:
    Serial.println(F("EV_LOST_TSYNC"));
    break;
  case EV_RESET:
    Serial.println(F("EV_RESET"));
    break;
  case EV_RXCOMPLETE:
    // data received in ping slot
    Serial.println(F("EV_RXCOMPLETE"));
    break;
  case EV_LINK_DEAD:
    Serial.println(F("EV_LINK_DEAD"));
    break;
  case EV_LINK_ALIVE:
    Serial.println(F("EV_LINK_ALIVE"));
    break;
  case EV_TXSTART:
    Serial.println(F("EV_TXSTART"));
    break;
  case EV_JOIN_TXCOMPLETE:
    Serial.println(F("EV_JOIN_TXCOMPLETE"));
    break;
  default:
    Serial.println(F("Unknown event"));
    break;
  }
}

// BME680 Lib written by Limor Fried & Kevin Townsend for Adafruit Industries, http://www.adafruit.com/products/3660
Adafruit_BME680 boschBME680; // Objekt Bosch Umweltsensor
int boschBME680_ready = 0;


void setup(){ // Einmalige Initialisierung
  WiFi.forceSleepBegin(); // Wifi off
  Serial.begin(115200);
  // -- Initialisiere LoraWAN 
  os_init();             // LMIC LoraWAN
  LMIC_reset();          // Reset the MAC state 
  LMIC.txpow = 27;       // Maximum TX power 
  LMIC.datarate=DR_SF12; // Long Range
  LMIC.rps = updr2rps(LMIC.datarate);

  Wire.begin(); // ---- Initialisiere den I2C-Bus 

  if (Wire.status() != I2C_OK) Serial.println("Something wrong with I2C");

  boschBME680_ready = boschBME680.begin(118);

  if (boschBME680_ready == 0) {
    while(1) { 
      Serial.println("BME680 nicht vorhanden - der alte Octopus nutzt BME280, ggf. Puzzleteile tauschen");
      delay(500);
    }
  }

  // Set up Bosch BME 680
  boschBME680.setTemperatureOversampling(BME680_OS_8X);
  boschBME680.setHumidityOversampling(BME680_OS_2X);
  boschBME680.setPressureOversampling(BME680_OS_4X);
  boschBME680.setIIRFilterSize(BME680_FILTER_SIZE_3);
  boschBME680.setGasHeater(0, 0); // off

}

void loop() { // Kontinuierliche Wiederholung 

  { //Block------------------------------ sende Daten an TTN  
    int port = 10;
    static uint8_t mydata[12];
    int wert=round((boschBME680.readTemperature()+(0.0))*1000);
    mydata[0] = wert >> 16; 
    mydata[1] = wert >> 8; 
    mydata[2] = wert ;
    wert=round((boschBME680.readHumidity()+(0.0))*1000);
    mydata[3] = wert >> 16; 
    mydata[4] = wert >> 8; 
    mydata[5] = wert ;
    wert=round((boschBME680.readPressure()/100.+(0.0))*1000);
    mydata[6] = wert >> 16; 
    mydata[7] = wert >> 8; 
    mydata[8] = wert ;
    wert=round((boschBME680.readGas()/1000.+(0.0))*1000);
    mydata[9] = wert >> 16; 
    mydata[10] = wert >> 8; 
    mydata[11] = wert ;
    // Check if there is not a current TX/RX job running
    //if (LMIC.opmode & OP_TXRXPEND) {
    if (LMIC.opmode & (1 << 7)) { 
      Serial.println(F("OP_TXRXPEND, not sending"));
    } 
    else {
      // Prepare upstream data transmission at the next possible time.
      LoRaWAN_Tx_Ready = 0;                                 // Merker für ACK
      LMIC_setTxData2(port, mydata, sizeof(mydata), 0);     // Sende         
      Serial.println(F("Packet queued"));
      while(LoRaWAN_Tx_Ready==0) {
        yield();
        os_runloop_once();
      };  // Warte bis gesendet
    }
  } // Blockende
  delay( 30000 );
}
