
const request = require("request");

function luftdatenClient() {

    luftdatenClient.prototype.writePm = (pm25) => {
        const postPM = {        
            uri: 'https://api.sensor.community/v1/push-sensor-data/',
            method: 'POST',   
            headers: {
                'content-type': 'application/json',
                'X-Pin': '1',
                'X-Sensor': 'esp8266-a44e22a2a'
            },
            body: {
                "sensordatavalues": [
                    {"value_type":"P2","value":pm25}
                ]
            },
            json: true                 
        };
        return new Promise((resolve, reject) => {
            request(postPM, function (error, response, body) {
                if (error) {
                    return reject(error);
                }
                console.log(error, body);
                return resolve(body);
            });
        });
    }    
}

module.exports = new luftdatenClient();