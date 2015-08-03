//Script per la separazione di ogni report della collection esportata da mongoDB

var jf = require('jsonfile');
var jfw = require('jsonfile');
var util = require('util');
var file = '/Users/lollo/Desktop/Reports/reportsCollection.json';
var folder = '/Users/lollo/Desktop/Reports/';

jf.readFile(file, function(err, obj) {
    console.log('Reports letto!');
    console.log(obj);
    
    obj.forEach(function(element){
        var filename = folder + element.name + '.json';
        jfw.writeFile(filename,element,function(err){
            if (err) throw err;
        });
    
    });
})
