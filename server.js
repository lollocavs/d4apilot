//Configuration
var serverExpress = 'http://localhost';
var mongoDB = 'mongodb://d4a_mongodb:27017/mongod4a';

process.env.PORT = 3000;
// process.env.HOST = 'http://localhost'

// Dependencies
var express = require('express');
var morgan = require('morgan');
var ip = require('ip');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// MongoDB
// mongoose.connect(mongoDB, { useNewUrlParser: true }, function(err, res) {
//     if (err) throw err;
//     console.log('Connessione stabilita');
// });
var connectWithRetry = function() {
    return mongoose.connect(mongoDB, function(err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
    });
};
connectWithRetry();

// Express
var app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/', express.static(__dirname + '/www/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.listen(3000, () => {
    console.log('API is running on port 3000');

    console.log('********', '[Local IP Address]  is:', ip.address(), process.env.PORT, '********');
});