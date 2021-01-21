const influxClient = require("./services/influxClient");
const uvClient = require("./services/uvIndexClient");

function AdService() {
  AdService.prototype.getAd = () => {
    let latestDataPromise = influxClient.getLatestData();
    let pressureVariationPromise = influxClient.getVariationInPressure();
    let temperatureVarationPromise = influxClient.getVariationInTemperature();
    let uvIndexPromise = uvClient.getUvIndex();
    let coldTimeRange = [10, 11, 0, 1, 2];
    let summerTimeRange = [6, 7, 8];
    let winterTimeRange = [8, 9, 10, 11, 0, 1];
    let springTimeRange = [1, 2, 3, 4, 5];
    let autumnTimeRange = [1, 2, 3, 4, 5];
    let grippeTimeRange = [0, 1, 2, 3];

    Promise.all([
      latestDataPromise,
      pressureVariationPromise,
      temperatureVarationPromise,
      uvIndexPromise,
    ]).then((values) => {
      let latestData = values[0];
      let pressureVariation = values[1];
      let temperatureVaration = values[2];
      let uvIndexData = values[3];
      let date = new Date();
      let month = date.getMonth();

      // Erkältung
      if (
        coldTimeRange.indexOf(month) != -1 &&
        latestData.humidity >= 83 &&
        latestData.temperature <= 8
      ) {
        return {};
      }
      // Kreislauf
      if (
        isCirculatoryPromlemPossible(latestData, pressureVariation, temperatureVaration, month) &&
        summerTimeRange.indexOf(month) != -1
      ) {
        return {};
      }
      // Grippe
      if (
        isGrippe(latestData, pressureVariation, temperatureVariation, month) &&
        grippeTimeRange.indexOf(month)
      ) {
        return {};
      } // Kopfschmerzen
      if (headacheTimeRange.indexOf(month) != -1) {
        return {};
      }
    });
  };
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
    lastData.humidity <= 80 ||
    isPressureFluctuating(pressureVariation, month) ||
    isTemperatureFluctuating(temperatureVariation, month)
  ) {
    return true;
  }
  return false;
}

function isPressureFluctuating(pressureVariation, month) {
  if (isTimeRangeOfAndValue(summerTimeRange, pressureVariation, 8, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(winterTimeRange, pressureVariation, 8, month, true)) {
    return true;
  }
  if (isTimeRangeOfAndValue(springTimeRange, pressureVariation, 8, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(autumnTimeRange, pressureVariation, 8, month, true)) {
    return true;
  }
  return false;
}

function isTemperatureFluctuating(temperatureVaration, month) {
  if (isTimeRangeOfAndValue(summerTimeRange,temperatureVaration, 8, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(winterTimeRange,temperatureVaration, 8, month, true)) {
    return true;
  }
  if (isTimeRangeOfAndValue(springTimeRange,temperatureVaration, 8, month, true)) {
    return true;
  }

  if (isTimeRangeOfAndValue(autumnTimeRange,temperatureVaration, 8, month, true)) {
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

module.exports = new AdService();
