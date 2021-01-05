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

MqttClient.prototype.getSenorData = function () {
    return storedSensorData;
}

function setupClient() {
    const client = mqtt.connect('mqtt://eu.thethings.network:1883', options);
    client.on('connect', function () {
        console.log('connect');
        client.subscribe('mwvt6/devices/iotoctopus2/up', function (err) {
            console.log('bla');
            if (err) {
                console.log('fehler');
                return;
            }
            console.log('erfolg');
        });
    });

    client.on('message', function (topic, message) {
        console.log(message.toString());

        let fake = {
            img: {
                src: 'debug/1.jpeg',
                desc: 'Text für ein bild'
            },

            data: {
                temperature: '12',
                pressure: '0.5',
                humidity: '50',
                fineParts: '10000'
            }
        };

        writeStoredSensorData(fake);
        client.end();
    });
}

function writeStoredSensorData(senoreData) {
    storedSensorData.data.fineParts = senoreData.data.fineParts;
    storedSensorData.data.temperature = senoreData.data.temperature;
    storedSensorData.data.pressure = senoreData.data.pressure;
    storedSensorData.data.humidity = senoreData.data.humidity;
    storedSensorData.img.desc = senoreData.img.desc;
    storedSensorData.img.src = senoreData.img.src;
}



// mosquitto_sub -h eu.thethings.network -t "+/devices/+/up" -u "mwvt6" -P "ttn-account-v2.J07Werc2POnvmeQTGvIoxA_LmiolS7rrxQ4RWrbLEiA" -v







module.exports = MqttClient