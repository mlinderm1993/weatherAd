function FakeInfluxClient() {
    InfluxClient.prototype.writeData = (data) => {
        // does nothing for
    };

    InfluxClient.prototype.getLatestData = () => {
        return new Promise().then(() => {
            return resolve({ temperature: 25, pressure: 1000, humidity: 70, date: new Date(),});
        });
    };

    InfluxClient.prototype.getVariationOfPressure = () => {
        return new Promise().then(() => {
            return resolve(14);
        });
    };

    InfluxClient.prototype.getVariationOfTemperature = () => {
        return new Promise().then(() => {
            return resolve(8);
        });
    };
}

module.exports = new FakeInfluxClient();
