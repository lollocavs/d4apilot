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
var fileData = getFileConfigJSON(2,1,user);
getAppConfig('app2');
var configurationData, MAX_STEP, timer;

var request = $.ajax({
    url: fileData,
    // Tell jQuery we're expecting JSONP
    dataType: "text",
    // Work with the response
    success: function( result ) {
        configurationData = JSON.parse(result);
        MAX_STEP = configurationData.dimStep.length -1;
        console.log("Uploaded File: " + fileData);
        console.log("Total Step : " + MAX_STEP);
    }
})

$(document).ready(function(){
    startAppSessionsAttach(); //Event Attachment of start session behavior
    missingTapEventAttach(); //Event Attachment of user error interactions 
    $('#footer-title')[0].innerHTML = getUserNumber();
    ObjectsCreation(); //Objects Creations
    manager = new timeManager(MAX_STEP);
});

function startAppSessionsAttach() {
    $('#start').click(function(){
        reportApp2 = new appReport(localStorage.userCounter,2,"Drag&Drop",MAX_STEP,0,dataApp.SessionTime); 
        $(this).fadeOut();
        $('.bar-subheader').fadeOut();
        $('#forward').fadeIn();
        manager.startApp();
        reportApp2.setStartTime(manager.TimeStart);
        manager.setAppSessions(MAX_STEP);
        nextStepConfiguration(manager.getStep());       
    });
}

function missingTapEventAttach () {
    $("#content-area").click(function(event) {
        var target = $(event.target)[0];
        if (target.id!="start") { //Verifica che non sia stato selezionato il tasto start
            if (target.id!="draggable") reportApp2.incrementInvalidCounter();
        }
    });  
}
  
function ObjectsCreation () { 
    var droppable = document.createElement('div');
    droppable.id = 'droppable';
    droppable.hidden = true;
    droppable.zIndex = 0;
    
    
    var draggable = document.createElement('div');
    draggable.id = 'draggable';
    draggable.hidden = true;
    draggable.zIndex=1;
    
    var startDiv = document.getElementById('b11');
    startDiv.appendChild(droppable);
    startDiv.appendChild(draggable);
}

function nextStepConfiguration(step){
        $('#footer-step').html(getCurrentStep());
        // Configurazione dimensioni
        var dimIdx = configurationData.dimStep[step];
    
        //CSS Configuration
        $('#draggable').removeClass();
        $('#draggable').removeAttr("style");
        $('#draggable').zIndex(1);
        $('#droppable').removeClass();
        $('#droppable').removeAttr("style");
        $('#droppable').zIndex(0); 
    
        var dragID = dataApp.configuration.positionDivs[configurationData.posDrag[step]];
        var dropID = dataApp.configuration.positionDivs[configurationData.posDrop[step]];
        
        $('#draggable').addClass(dataApp.configuration.dimensions[dimIdx]);
        $('#droppable').addClass(dataApp.configuration.dimensions[dimIdx]);
    
        $('#'+dragID).append($('#draggable'));
        $('#'+dropID).append($('#droppable'));
    
        //Ripristino delle proprietà drag&drop
        $('#draggable').draggable({
            start: function(event,ui){
                reportApp2.incrementValidCounter();
                },
            revert: "invalid",
            revertDuration: 100,
        });
        $('#droppable').droppable({
            drop: function( event, ui ) {
                $("#draggable").addClass( "success" ).find( "p" ).html( "Ottimo!" );
                finishTask();
            }
        });
    
        $('#draggable').fadeIn();
        $('#droppable').fadeIn();
        reportApp2.Tstart = getMilliseconds();
        timer = window.setTimeout(function(){finishTask()},dataApp.SessionTime);
    }

function finishTask(){
    clearTimeout(timer); //Disabilito il timeout corrente attivo per evitare timeout a cascata
    reportApp2.storeSuccess();   
    $('#draggable').fadeOut();
    $('#droppable').fadeOut();
    if (manager.nextSession()) {
        nextStepConfiguration(manager.getStep());
        //Reset dei contatori del report
        reportApp2.setStartTime = getMilliseconds();
        reportApp2.resetInvalidCounter();
        reportApp2.resetValidCounter();
    }
    else {
        newApplication(reportApp2,dataApp.nextApp);
    }
};