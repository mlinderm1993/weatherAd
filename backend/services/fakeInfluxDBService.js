function FakeInfluxClient() {
    FakeInfluxClient.prototype.writeData = (data) => {
        // does nothing for
    };

    FakeInfluxClient.prototype.getLatestData = () => {
        return new Promise((resolve, reject) => {
            resolve({ temperature: 15, pressure: 1000, humidity: 85, date: new Date(), fineParts: 10});
        })
    };

    FakeInfluxClient.prototype.getVariationOfPressure = () => {
        return new Promise((resolve, reject) => {
            resolve(1);
        });
    };

    FakeInfluxClient.prototype.getVariationOfTemperature = () => {
        return new Promise((resolve, reject) => {
            resolve(14);
        })
    };
}

module.exports = new FakeInfluxClient();
