const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');

function MqttClient() {}
MqttClient.prototype.subscribe = function () {
    client.on('connect', function () {
        client.subscribe('presence', function (err) {
            if (err) {
                console.log('fehler');
            } else {
                console.log('erfolg');
            }
        })
    })
}
module.exports = MqttClient