
// Dependencies
var express = require('express');
var router = express.Router();

// Models
var Report = require('../models/report');

// Routes
Report.methods(['get', 'put', 'post', 'delete']);
Report.register(router, '/reports');

// Return router
module.exports = router;



