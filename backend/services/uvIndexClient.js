
const request = require("request");

const uvIndexData; 

function UvIndexClient() {
    const options = {
        method: 'GET',
        url: 'https://api.openuv.io/api/v1/uv',
        qs: { lat: '52.520007', lng: '13.404954', dt: new Date()},
        headers:
        {
            'content-type': 'application/json',
            'x-access-token': '85f840f8d31dcbb67e74f9b1ff0a70c5'
        }
    };

    UvIndexClient.prototype.getUvIndex = () => {
        if( uvIndexData != undefined || Date.parse(uvIndexData.uv_time) - Date.now < 1800000  ) {
           return  new Promise((resolve, reject) => {
                return resolve(uvIndexData);
            })
        }
        
        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) {
                    return reject(error);
                }
                uvIndexData = body;
                return resolve(body);
            });
        });
    }

}

module.exports = new UvIndexClient();