#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

#define SIG_PIN D1

const char* ssid = "SOURAV_2.4G";
const char* password = "ford mustang";

String DEVICE_ID_ROOM_ID = "R1";

int sensorPin = A0;

WiFiClientSecure client;

void callApi(int hrtRate, int oxLvl) {
  Serial.println(String(hrtRate) + " " + String(oxLvl));
  HTTPClient https;
  String url="https://aquatic-cuboid-tumbleweed.glitch.me/senddata?roomId="+DEVICE_ID_ROOM_ID+"&hurtRate="+String(hrtRate)+"&oxlvl="+String(oxLvl);
  if (https.begin(client, url)) {
    int httpCode = https.GET();
    if (httpCode > 0) { }
    https.end();
  }
}
int generateValue(int minValue, int maxValue) {
  return random(minValue, maxValue + 1);
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(sensorPin, INPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_BUILTIN, 1);
    delay(100);
    digitalWrite(LED_BUILTIN, 0);
    delay(100);
  }
  client.setInsecure();
}

void loop() {
  Serial.println(digitalRead(SIG_PIN));
  if(!digitalRead(SIG_PIN)) {
    callApi(generateValue(80, 120), generateValue(95, 100));
  } else {
    callApi(generateValue(50, 60), generateValue(80, 90));
  }
  delay(100);
}
