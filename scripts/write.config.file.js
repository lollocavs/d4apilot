const jsonfile = require('jsonfile')
const path = require('path');


// const file = '/tmp/data.json';

const folder = path.join(__dirname, 'tmp');


function writeJsonFile(obj, appName, part, userNumber) {

    let userNumberString = getUserNumberString(userNumber);
    const filename = appName + '_' + part + userNumberString + '.json';
    file = path.join(folder, filename);

    jsonfile.writeFile(file, obj, function(err) {
        if (err) {
            console.error(err)
        } else {
            console.log('File ' + filename + 'written!')
        }
    })
};


function getUserNumberString(user) {
    const userNumberString = user.toString();
    // return userNumberString;
    if (userNumberString.length == 3) return userNumberString;
    if (userNumberString.length == 2) return '0' + userNumberString;
    if (userNumberString.length == 1) return '00' + userNumberString;
}

module.exports = writeJsonFile;