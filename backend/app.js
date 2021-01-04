
var express = require('express');
var app = express();

console.log("api created");

app.use((req, res, next) => {
    console.log('hallo');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/data', function (req, res) {
    console.log('here');
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

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  module.exports = app;