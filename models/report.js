
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var reportSchema = new mongoose.Schema({
//    _id: Schema.ObjectId,
    name : String,
    appReports : [
        {   
            'userID' : String,
            'id' : Number,
            'appName': String,
            'stepNumber': Number,
            'Tstart': Number,
            'DTmax': Number,
            'validTaps': [],
            'invalidTaps': [],
            'Tsuccess': [],
            'Success': [],
            'setStartTime': Number
        }
    ]
});

// Return model
module.exports = restful.model('Reports', reportSchema);
