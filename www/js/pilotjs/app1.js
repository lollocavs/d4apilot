/*
 * Javascript per la gestione della prima applicazione del pilot
 *
 * Copyright @ UNIVPM DTM Group. All right is reserved.
 * Written by Lorenzo Cavalieri
 *
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//App Initialization
var user = localStorage.userCounter;
var fileData = getFileConfigJSON(1,1,user);
getAppConfig('app1');
var configurationData, MAX_STEP, manager, reportApp1, timer;

var request = $.ajax({
    url: fileData,
    // Tell jQuery we're expecting JSONP
    dataType: "text",
 
    // Work with the response
    success: function( result ) {
        configurationData = JSON.parse(result);
        MAX_STEP = configurationData.arrayID.length -1;
        console.log("Uploaded File: " + fileData);
        console.log ("Total Step : " + MAX_STEP);
    }
})

$(document).ready(function () { 
    startAppSessionsAttach();
	missingTapEventAttach();
    $('#footer-title')[0].innerHTML = getUserNumber();
    manager = new timeManager(MAX_STEP); 
});


function startAppSessionsAttach() {
    $('#start').click(function(){
        reportApp1 = new appReport(localStorage.userCounter,1,"Click the button",MAX_STEP,0,dataApp.SessionTime);
        reportApp1.setStartTime(manager.TimeStart);
        manager.setAppSessions(MAX_STEP);
        $(this).fadeOut();
        $('#forward').fadeIn();
        $('.bar-subheader').fadeOut();
        manager.startApp();       
        routineButtons(manager.getStep());       
    });  
}

function missingTapEventAttach () {
    $("#content-area").click(function(event) {
        var target = $(event.target);
        //bypass del controllo prima dell'avvio delle sessioni
        if (target[0].id!="start") checkMissingTap(target[0]);          
    });  
}

function checkMissingTap (target) {
    if (target.id=="target")
        finishTask();    
    else 
        reportApp1.incrementInvalidCounter();  
}


function routineButtons(step) {
    $('#footer-step').html(getCurrentStep());
    //Definition of any key index
    var targetID = dataApp.configuration.buttons[configurationData.arrayID[step]];
    var size = dataApp.configuration.buttonSize[configurationData.arraySize[step]];
    var shape = dataApp.configuration.buttonShape[configurationData.arrayShape[step]];
    var patternButton = dataApp.configuration.buttonPattern[configurationData.arrayPattern[step]];
    var patternScreen = dataApp.configuration.screenPattern[configurationData.arrayPattern[step]];
    
    //Screen Configuration
    var screen = $('body');
    screen.removeClass();
    screen.addClass(patternScreen);
    
    //Button configuration
    var btn = $('#target');
    btn.removeClass();
    btn.hide();
    var classes = size + " " + shape + " " + patternButton;  
    btn.addClass(classes);
    btn.addClass("button");
    $('#'+targetID)[0].appendChild(btn[0]);
    btn.fadeIn();
    
    reportApp1.Tstart = getMilliseconds();
    timer = window.setTimeout(function(){finishTask()},dataApp.SessionTime); 
};

function finishTask(){
    //Disabilito il timeout corrente attivo per evitare timeout a cascata
    clearTimeout(timer); 
    reportApp1.storeSuccess();  
    $('#target').fadeOut();
    if (manager.nextSession()) {
        routineButtons(manager.getStep());
        //Reset dei contatori del report
        reportApp1.setStartTime = getMilliseconds();
        reportApp1.resetInvalidCounter();
        reportApp1.resetValidCounter();
    }
    else {
        newApplication(reportApp1,dataApp.nextApp);
    }
};

