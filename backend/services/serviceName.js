const influxClient = require('./services/influxClient');
const uvClient = require('./services/uvIndexClient');

function ServerName() {

    ServerName.prototype.getAd = () => {

        let latestDataPromise = influxClient.getLatestData();
        let pressureVariationPromise = influxClient.getVariationInPressure();
        let temperatureVarationPromise = influxClient.getVariationInTemperature();
        let uvIndexPromise = uvClient.getUvIndex();
        let coldTimeRange = [10, 11, 0, 1, 2];
        let summerTimeRange = [6, 7, 8];

        Promise.all([latestDataPromise, pressureVariationPromise, temperatureVarationPromise, uvIndexPromise]).then((values) => {
            let latestData = values[0];
            let pressureVariation = values[1];
            let temperatureVaration = values[2];
            let uvIndexData = values[3];
            let date = new Date();
            let month = date.getMonth();

            if (coldTimeRange.indexOf(month) != -1 && latestData.humidity >= 83 && latestData.temperature <= 8) {
                return {};
            }
            if (isCirculatoryPromlemPossible(latestData, pressureVariation, temperatureVaration, month) && summerTimeRange.indexOf(month) != -1) {
                return {};
            }


        })
        return {};
    }

    function isCirculatoryPromlemPossible(latestData, pressureVariation, temperatureVaration, month) {
        return ((latestData.temperature >= 20 && latestData.humidity >= 80)
            || isPressureFluctuating(pressureVariation, month)
            || isTemperatureFluctuating(temperatureVaration, month))
    }

    function isPressureFluctuating(pressureVariation, month) {
        if (summerTimeRange.indexOf(month) != -1) {
            if (pressureVariation >= 15) {
                return true;
            }
        }
        return false
    }

    function isTemperatureFluctuating(temperatureVaration, month) {
        if (summerTimeRange.indexOf(month) != -1) {

            if (temperatureVaration >= 8) {
                return true;
            }
        }
        return false;
    }
}

module.exports = new ServerName();