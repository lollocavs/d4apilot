
//Configuration
var serverExpress = 'http://localhost:3000';
var mongoDB = 'mongodb://localhost:27017/mongod4a';

// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// MongoDB
mongoose.connect(mongoDB, function(err,res){
    if(err) throw err;
    console.log('Connessione stabilita');
});


// Express
var app = express();

app.use('/', express.static(__dirname + '/www/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.listen(3000);
console.log('API is running on port 3000');

