var express = require('express');
const router = express.Router();
const influxClient = require('./services/influxClient');
//const uvIndexClient = require('./services/uvIndexClient');

router.get('/data', function (req, res) {
    console.log('sendData');
    gatherDataForFrontEnd().then(data => res.json(data)); 
});



function gatherDataForFrontEnd() {
    // get pressure varation from
    influxClient.getVariationInPressure().then(data => console.log(data));
    // influxClient.getVariationOfTemprature().then(data =>{
    // });
    // get uv index 
    //uvIndexClient.getUvIndex().then(data =>)
    // get temp varation
    // return influxClient.getLatestData()
    //     .then(sensorData => {
    //         return { data: sensorData, img: {} };
    //     })
    return {};
}

module.exports = router;