const USER_NUMBER = 30;


const combinations = require('./combinations');
const pattern = require('./pattern.config');
const writeJsonFile = require('./write.config.file');



for (let user = 1; user < USER_NUMBER + 1; user++) {
    // Get APP #1 Files
    let app1 = combinations.app1();
    let app1_length = app1.length;

    // Split parts
    let app1_part1 = app1.slice(0, app1.length / 2);
    let app1_part2 = app1.slice(app1.length / 2);

    // Create obj 
    let app1_obj_1 = pattern.app1(app1_part1);
    let app1_obj_2 = pattern.app1(app1_part2);

    writeJsonFile(app1_obj_1, 'app1', 1, user);
    writeJsonFile(app1_obj_1, 'app1', 2, user);

    // Get APP #2 Files
    let app2 = combinations.app2();
    let app2_length = app2.length;


    // Split parts
    let app2_part1 = app2.slice(0, app2.length / 2);
    let app2_part2 = app2.slice(app2.length / 2);

    let app2_obj_1 = pattern.app2(app2_part1);
    let app2_obj_2 = pattern.app2(app2_part2);

    writeJsonFile(app2_obj_1, 'app2', 1, user);
    writeJsonFile(app2_obj_2, 'app2', 2, user);

    // Get APP #3 Files
    let app3 = combinations.app3();

    let app3_obj = pattern.app3(app3);


    writeJsonFile(app3_obj, 'app3', 0, user);






}