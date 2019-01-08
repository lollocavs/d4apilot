//Configuration
var serverExpress = 'http://localhost:3000';
var mongoDB = 'mongodb://mongo:27017/mongod4a';

// Dependencies
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true }, function(err, res) {
    if (err) throw err;
    console.log('Connessione stabilita');
});


// Express
var app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/', express.static(__dirname + '/www/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.listen(3000);
console.log('API is running on port 3000');