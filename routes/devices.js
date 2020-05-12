const express = require('express');
const router = express.Router();
const bonjour = require('bonjour')();

const devices = new Map();
bonjour.find({type:"googlecast"}, service => {
    devices.set(service.txt.fn, {
        address: service.addresses[0], 
        port: service.port, 
        uuid: service.host.split(".")[0]});
});

/* GET users listing. */
router.get("/", function(req, res, next) {
    const response = [];
    for (let [key, value] of devices) {
        value.name = key;
        response.push(value);
    }
    res.json(response);
});


module.exports = router;
