//Script per la separazione di ogni report della collection esportata da mongoDB

var jf = require('jsonfile');
var jfw = require('jsonfile');
var path = require('path');
var util = require('util');
var file = path.join(__dirname, 'reports.json');
console.log('[ Target file] : ', file);
var folder = path.join(__dirname, 'reports');
console.log('[ Target folder] : ', folder);
jf.readFile(file, (err, obj) => {
    if (err) throw err;
    else {
        console.log('File di esportazione letto!');
        // console.log(obj);
    }
    obj.forEach(function(element) {
        var filename = path.join(folder, element.name + '.json');
        jfw.writeFile(filename, element, function(err) {
            if (err) throw err;
            console.log('[ File creato] : ', element.name + '.json');
        });

    });
})