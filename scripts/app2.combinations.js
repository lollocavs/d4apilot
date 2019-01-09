const MAX_DROP_POSITION = 6;
const MAX_DRAG_POSITION = 6;
const MAX_SIZE = 3;


function getApp2Combinations() {
    let combinations = [];

    // Create all possible combinations
    for (let drop = 0; drop < MAX_DROP_POSITION; drop++) {
        for (let drag = 0; drag < MAX_DRAG_POSITION; drag++) {
            for (let size = 0; size < MAX_SIZE; size++) {
                combinations.push({ drop: drop, drag: drag, size: size });
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
    return array.filter((item) => { return (item.drag != item.drop) });
}

// getApp2Combinations();

module.exports = getApp2Combinations;