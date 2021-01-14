const { Point } = require('@influxdata/influxdb-client')
const { InfluxDB } = require('@influxdata/influxdb-client')


function InfluxClient() {
    const token = 'ylAy_8UGaAk2mnkkOXpAobtV5QkM8Nslotggc-ulmb0ZV4_YqgRW5Zjx_Avvz1P3FqMt9yrSYayHhwhL66Lf3A==';
    const org = 's0549898@htw-berlin.de';
    const bucket = 'weatherAd';
    const client = new InfluxDB({ url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token });

    const writeApi = client.getWriteApi(org, bucket);




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

    function createPointFromData(data) {
        const point = new Point('weather');
        point.floatField('temperature', data.temperature)
        point.floatField('fineParts', data.fineParts);
        point.floatField('humidity', data.humidity);
        point.floatField('pressure', data.pressure);
        point.timestamp(data.date);
        point.tag('weatherApi');
        console.log(point);
        return point;
    }

}

module.exports = new InfluxClient();