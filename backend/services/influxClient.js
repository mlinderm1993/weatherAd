const { Point } = require('@influxdata/influxdb-client')
const { InfluxDB } = require('@influxdata/influxdb-client')

const token = 'ylAy_8UGaAk2mnkkOXpAobtV5QkM8Nslotggc-ulmb0ZV4_YqgRW5Zjx_Avvz1P3FqMt9yrSYayHhwhL66Lf3A==';
const org = 's0549898@htw-berlin.de';
const bucket = 'weatherAd';
const measurement = 'weather';

function InfluxClient() {
    const client = new InfluxDB({ url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token });

    const writeApi = client.getWriteApi(org, bucket);
    const queryApi = client.getQueryApi(org, bucket);
    InfluxClient.prototype.writeData = (data) => {
        const point = createPointFromData(data);
        writeApi.writePoint(point);
        writeApi.flush()
            .then(() => {
                console.log('success');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    InfluxClient.prototype.getLatestData = () => {
        const query = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r._measurement == "${measurement}") |> last()`
        return queryApi.collectRows(query)
            .then((row) => {
                return createSensorDataFromRow(row);
            })
            .catch(err => console.log(err));
    }

    InfluxClient.prototype.getVariationInHumidity = () => {
        const query = `from(bucket:"${bucket}") |> range(start: -14d) |> filter(fn: (r) => r._measurement == "${measurement}" and r._field == "pressure") |> spread()`;
        console.log("varation");
        return queryApi.collectRows(query)
            .then((row) => { 
                console.log(row);
            })
            .catch(err => console.log(er));
    }


    function createPointFromData(data) {
        const point = new Point(measurement);
        point.floatField('temperature', data.temperature)
        point.floatField('fineParts', data.fineParts);
        point.floatField('humidity', data.humidity);
        point.floatField('pressure', data.pressure);
        point.timestamp(data.date);
        point.tag('weatherApi');
        console.log(point);
        return point;
    }

    function createSensorDataFromRow(row) {
        const sensorData = {}
        row.forEach(table => {
            switch (table._field) {
                case "temperature":
                    sensorData.temperature = table._value
                case "pressure":
                    sensorData.pressure = table._value
                case "fineParts":
                    sensorData.fineParts = table._value
                case "humidity":
                    sensorData.humidity = table._value
            }
        });
        sensorData.date = row[0]._time;
        return sensorData
    }

}

module.exports = new InfluxClient();