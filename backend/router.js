var express = require('express');
const router = express.Router();
const MqttClient = require('./services/mqttClient');
const mqttClient = new MqttClient();
mqttClient.subscribe();

router.get('/data', function (req, res) {
    
    console.log('sending data');
    res.json({
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
    });
});

module.exports = router;