const MAX_POSITION = 6;
const MAX_TARGET_SIZE = 3;
const MAX_OBJECT_SIZE = 3;


function getApp3Combinations() {
    let combinations = [];

    // Create all possible combinations
    for (let position = 0; position < MAX_POSITION; position++) {
        for (let target = 0; target < MAX_TARGET_SIZE; target++) {
            for (let object = 0; object < MAX_OBJECT_SIZE; object++) {
                combinations.push({ position: position, target: target, object: object });
            }
        }
    }
    // Check total combinations
    console.log("Total combinations", combinations.length);
    combinations = filterCombinations(combinations);
    console.log("Filtered combinations", combinations.length);
    // Randomize combinations  
    combinations.sort(function() {
        return .5 - Math.random();
    });
    // console.log(combinations);

    // Limit combinations to users' number
    // return combinations.slice(0, userNumber);
    return combinations;
}

function filterCombinations(array) {
    return array.filter((item) => { return (item.target != item.object) });
}

// getApp3Combinations();

module.exports = getApp3Combinations;