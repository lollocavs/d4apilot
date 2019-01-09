const MAX_ID = 6;
const MAX_SIZE = 3;
const MAX_SHAPE = 3;
const MAX_PATTERN = 3;

function getApp1Combinations() {

    let combinations = [];

    // Create all possible combinations
    for (let id = 0; id < MAX_ID; id++) {
        for (let size = 0; size < MAX_SIZE; size++) {
            for (let shape = 0; shape < MAX_SHAPE; shape++) {
                for (let pattern = 0; pattern < MAX_PATTERN; pattern++) {
                    combinations.push({ id: id, size: size, shape: shape, pattern: pattern });
                }
            }
        }
    }
    // Check total combinations
    console.log("Total combinations", combinations.length);
    // Randomize combinations  
    combinations.sort(function() {
        return .5 - Math.random();
    });
    // console.log(combinations);
    // Limit combinations to users' number
    return combinations;
}

// getApp1Combinations();

module.exports = getApp1Combinations;