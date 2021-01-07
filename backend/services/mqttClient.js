var mqtt = require('mqtt');



var options = {
    password: 'ttn-account-v2.J07Werc2POnvmeQTGvIoxA_LmiolS7rrxQ4RWrbLEiA',
    username: 'mwvt6',
    port: '1883'
};

var storedSensorData = {
    img: {
        src: null,
        desc: null
    },

    data: {
        temperature: null,
        pressure: null,
        humidity: null,
        fineParts: null
    }
}

function MqttClient() {
    setupClient();
}

MqttClient.prototype.getSensorData = function () {
    return storedSensorData;
}

function setupClient() {
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

    client.on('message', function (topic, message) {
        const data = JSON.parse(message.toString()).payload_fields;
        console.log(data);

        writeStoredSensorData(data);
    //    client.end();
    });
}

function writeStoredSensorData(sensorData) {
    storedSensorData.data.fineParts = sensorData.data.fineParts;
    storedSensorData.data.temperature = sensorData.data.temperature;
    storedSensorData.data.pressure = sensorData.data.pressure;
    storedSensorData.data.humidity = sensorData.data.humidity;
//    storedSensorData.img.desc = sensorData.img.desc;
//    storedSensorData.img.src = sensorData.img.src;
}



// mosquitto_sub -h eu.thethings.network -t "+/devices/+/up" -u "mwvt6" -P "ttn-account-v2.J07Werc2POnvmeQTGvIoxA_LmiolS7rrxQ4RWrbLEiA" -v







module.exports = MqttClient