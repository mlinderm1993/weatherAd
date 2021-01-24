
function MqttClient() {
    const mqtt = require('mqtt');
    const influxClient = require('./influxClient');
    const luftdatenClient = require('./luftdatenClient');

    const options = {
        password: 'ttn-account-v2.J07Werc2POnvmeQTGvIoxA_LmiolS7rrxQ4RWrbLEiA',
        username: 'mwvt6',
        port: '1883'
    };

    MqttClient.prototype.connectToTTN = () =>  {
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
            //write fineParts to luftdaten.info
            luftdatenClient.writePm(messageJson.payload_fields.data.fineParts);
            //save Data to influxDB
            writeStoredSensorData(messageJson.payload_fields, new Date(messageJson.metadata.time));
        });
    }

    function writeStoredSensorData(sensorData, date) {
        const data = { ...sensorData.data, date };
        influxClient.writeData(data);
    }

}

module.exports = new MqttClient();