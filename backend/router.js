var express = require('express');
const router = express.Router();
const MqttClient = require('./services/mqttClient');
const mqttClient = new MqttClient();


router.get('/data', function (req, res) {
    res.json(mqttClient.getSensorData());
});

module.exports = router;