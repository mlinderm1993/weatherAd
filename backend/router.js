var express = require('express');
const router = express.Router();
const dataService = require('./services/dataService')

router.get('/data', function (req, res) {
    dataService.getData().then(data => res.json(data)); 
});

module.exports = router;