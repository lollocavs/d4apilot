function getPatternApp1(array) {
    let fileJSON = {
        "arrayID": [],
        "arraySize": [],
        "arrayShape": [],
        "arrayPattern": []
    };
    array.forEach(element => {
        fileJSON.arrayID.push(element.id);
        fileJSON.arraySize.push(element.size);
        fileJSON.arrayShape.push(element.shape);
        fileJSON.arrayPattern.push(element.pattern);
    });
    return fileJSON;
}

function getPatternApp2(array) {
    let fileJSON = {
        "posDrop": [],
        "posDrag": [],
        "dimStep": []
    };
    array.forEach(element => {
        fileJSON.posDrop.push(element.drop);
        fileJSON.posDrag.push(element.drag);
        fileJSON.dimStep.push(element.size);
    });
    return fileJSON;
}

function getPatternApp3(array) {
    let fileJSON = {
        "posObjects": [],
        "dimTarget": [],
        "dimObject": []
    };
    array.forEach(element => {
        fileJSON.posObjects.push(element.position);
        fileJSON.dimTarget.push(element.target);
        fileJSON.dimObject.push(element.object);
    });
    return fileJSON;
}

module.exports = {
    app1: getPatternApp1,
    app2: getPatternApp2,
    app3: getPatternApp3,
}