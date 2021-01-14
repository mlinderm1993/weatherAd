var express = require('express');
const router = express.Router();
const influxClient = require('./services/influxClient');



router.get('/data', function (req, res) {
    console.log('sendData');
    gatherDataForFrontEnd().then(data => res.json(data)); 

});

function gatherDataForFrontEnd () {
    return influxClient.getLatestData()
    .then(sensorData =>  {
        return {data: sensorData, img :{}};
    })
}

module.exports = router;