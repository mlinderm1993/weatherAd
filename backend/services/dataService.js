const influxClient = require("./influxClient");
const uvClient = require("./uvIndexClient");
const winterTimeRange = [11, 0, 1, 2];
const springTimeRange = [3, 4, 5];
const summerTimeRange = [6, 7, 8];
const fallTimeRange = [9, 10];

function DataService() {

  DataService.prototype.getData = () => {
    let latestDataPromise = influxClient.getLatestData();
    let pressureVariationPromise = influxClient.getVariationOfPressure();
    let temperatureVarationPromise = influxClient.getVariationOfTemperature();
    let uvIndexPromise = uvClient.getUvIndex();

   return Promise.all([
      latestDataPromise,
      pressureVariationPromise,
      temperatureVarationPromise,
      uvIndexPromise,
    ]).then((values) => {
      const latestData = values[0];
      const pressureVariation = values[1];
      const temperatureVaration = values[2];
      const uvIndexData = (values[3] != null ) ? values[3].uv : 0;
      const date = new Date();
      const month = date.getMonth();
      const ad = getImg(latestData, pressureVariation, temperatureVaration, uvIndexData, month)
      const finePartIndicator = getFinePartIndicator(latestData.fineParts);
      let img = {finePartIndicator: finePartIndicator, ...ad};
      return { data: latestData, img: img }
    });

  }
}

module.exports = new DataService();

function getImg(latestData, pressureVariation, temperatureVariation, uvIndexData, month) {
  const coldTimeRange = [10, 11, 0, 1, 2];
  const grippeTimeRange = [0, 1, 2, 3];
  const headacheTimeRange = [3, 4, 5, 9, 10];
  // Erkältung
  if (
    coldTimeRange.indexOf(month) != -1 &&
    latestData.humidity >= 83 &&
    latestData.temperature <= 8
  ) {
    return {src: "img/prod_muedigkeit.jpg",desc: "Das aktuelle Wetter weist ein erhöhtes Risiko auf an Erkältungen zu leiden. Wir empfehlen:"};
  }
  // Kreislauf
  if (
    isCirculatoryPromlemPossible(latestData, pressureVariation, temperatureVariation, month) &&
    summerTimeRange.indexOf(month) != -1
  ) {
    return {src: "img/prod_kreislauf.jpg",desc: "Das aktuelle Wetter und die Schwankungen des Luftdrucks und der Temperatur erhöhen das Risiko für Kreislaufprobleme. Wir empfehlen:"};
  }
  // Grippe
  if (
    isGrippe(latestData, pressureVariation, temperatureVariation, month) &&
    grippeTimeRange.indexOf(month) != -1
  ) {
    return {src: "img/prod_muedigkeit.jpg",desc: "Das aktuelle Wetter und die Schwankungen des Luftdrucks und der Temperatur erhöhen das Risiko für Müdigkeit. Wir empfehlen:"};
  } // Kopfschmerzen
  if (headacheTimeRange.indexOf(month) != -1) {
    return {src: "img/prod_kopfschmerz.jpg",desc: "Aufgrund der aktuellen Luftdruckschwankungen entsteht ein erhöhtes Risiko an Kopfschmerzen zu leiden. Wir empfehlen:"};
  }
  if (uvIndexData >= 5) {
    return {src: "img/prod_uv.jpg", desc: "Es lässt sich ein erhöhter UV-Index feststellen. Achten Sie auf genügend Sonnenschutz. Wir empfehlen:"};
  }
  return {src: "img/prod_kopfschmerz.jpg",desc: "Derzeitig lassen sich keine wetterbedingten Krankheitsmuster erkennen. Bei der Darstellung handelt es sich um eine generelle Werbung."};
}

function getFinePartIndicator(fineParts) {
  // grün
  if(fineParts < 30 ) {
    return "img/traffic-light-green.png"
  }
 // gelb
  if(fineParts >= 30 && fineParts <= 45) {
    return "img/traffic-light-yellow.png"
  }
 // rot
  if(fineParts > 45) {
    return "img/traffic-light-red.png"
  }
}

function isCirculatoryPromlemPossible(latestData, pressureVariation, temperatureVaration, month) {
  return (
    (latestData.temperature >= 20 && latestData.humidity >= 80) ||
    isPressureFluctuating(pressureVariation, month) ||
    isTemperatureFluctuating(temperatureVaration, month)
  );
}

function isGrippe(latestData, pressureVariation, temperatureVariation, month) {
  if (
    latestData.temperature <= 5 ||
    latestData.humidity <= 80 ||
    isPressureFluctuating(pressureVariation, month) ||
    isTemperatureFluctuating(temperatureVariation, month)
  ) {
    return true;
  }
  return false;
}

function isPressureFluctuating(pressureVariation, month) {
  if (isTimeRangeOfAndValue(winterTimeRange, pressureVariation, 13, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(springTimeRange, pressureVariation, 10, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(summerTimeRange, pressureVariation, 13, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(fallTimeRange, pressureVariation, 9, month, true)) {
    return true;
  }

  return false;
}

function isTemperatureFluctuating(temperatureVaration, month) {

  if (isTimeRangeOfAndValue(winterTimeRange, temperatureVaration, 8, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(springTimeRange, temperatureVaration, 11, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(summerTimeRange, temperatureVaration, 9, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(fallTimeRange, temperatureVaration, 6, month, true)) {
    return true;
  }

  return false;
}


function isTimeRangeOfAndValue(timeRange, value, compValue, month, bigger) {
  if (timeRange.indexOf(month)) {
    if (bigger) {
      if (value >= compValue) {
        return true;
      }
    } else {
      if (value <= compValue) {
        return true;
      }
    }
  }
  return false;
}
