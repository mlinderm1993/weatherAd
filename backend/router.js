var express = require('express');
const router = express.Router();
const mqttClient = require('./services/mqttClient');



router.get('/data', function (req, res) {
    console.log('sendData');
    res.json(mqttClient.getSensorData());
});

module.exports = router;