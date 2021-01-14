
function MqttClient() {
    const mqtt = require('mqtt');
    const fakeDataService = require('./fakeDataService');
    const influxClient = require('./influxClient');
    const x = 0;

    const options = {
        password: 'ttn-account-v2.J07Werc2POnvmeQTGvIoxA_LmiolS7rrxQ4RWrbLEiA',
        username: 'mwvt6',
        port: '1883'
    };

    {
        const client = mqtt.connect('mqtt://eu.thethings.network:1883', options);
        client.on('connect', function () {
            console.log('mqtt connect');
            client.subscribe('mwvt6/devices/iotoctopus2/up', function (err) {
                if (err) {
                    console.log('mqtt connect fehlgeschlagen');
                    return;
                }
                console.log('mqtt connect erfolgreich');
            });
        });

        client.on('message', (topic, message) => {
            const messageJson = JSON.parse(message.toString());
            console.log(payloadFields);
            writeStoredSensorData(messageJson.payload_fields, new Date(messageJson.metadata.time));
            //    client.end();
        });
    }

    MqttClient.prototype.getSensorData = () => {
        // remove if connection is set

        writeStoredSensorData(fakeDataService.getFakeData(), fakeDataService.getFakeTime());

        return {
            img: {
                src: null,
                desc: null
            },
            data: {
                temperature: null,
                pressure: null,
                humidity: null,
                fineParts: null,
                date: null,
            }
        };
    }

    function writeStoredSensorData(sensorData, date) {
        const data = { ...sensorData.data, date };
        influxClient.writeData(data);
        //    storedSensorData.img.desc = sensorData.img.desc;
        //    storedSensorData.img.src = sensorData.img.src;
    }

}

module.exports = new MqttClient();