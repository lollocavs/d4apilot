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

//TODO: Bug da risolvere
//1. Trovare il modo per rilevare l'evento Invalid Taps
//2. Risolvere il problema della dimensione iniziale della forma target
//3. Risolvere la squadratura del primo div padre!!!!

//Matrice per la configurazione degli elementi
//var positions = ['b11','b12','b13','b21','b22','b23'];
//var dimensions = ['smallsize','mediumsize','largesize'];

//App Initialization
//var DEBUG = false;
var user = localStorage.userCounter;
var fileData = getFileConfigJSON(3, 0, user);
getAppConfig('app3');
var configurationData, MAX_STEP, timer;

//JSON FILE MANAGEMENT [sostituisce le matrici di configurazione dei pacchetti]
var request = $.ajax({
    url: fileData,
    // Tell jQuery we're expecting JSONP
    dataType: "text",
    // Work with the response
    success: function(result) {
        configurationData = JSON.parse(result);
        MAX_STEP = configurationData.posObjects.length - 1;
        console.log("Uploaded File: " + fileData);
        console.log("Total Step : " + MAX_STEP);
    }
});

$(document).ready(function() {
    startAppSessionsAttach(); //Event Attachment of start session behavior
    $('#footer-title')[0].innerHTML = getUserNumber();
    ObjectsCreation(); //Objects Creations
    manager = new timeManager(MAX_STEP);
});

function startAppSessionsAttach() {
    $('#start').on('click', function() {
        reportApp3 = new appReport(localStorage.userCounter, 3, "PinchToZoom", MAX_STEP, 0, dataApp.SessionTime);
        $(this).fadeOut();
        $('#forward').fadeIn();
        $('.bar-subheader').fadeOut();
        manager.startApp();
        reportApp3.setStartTime(manager.TimeStart);
        manager.setAppSessions(MAX_STEP);
        nextStepConfiguration(manager.getStep());
        missingTapEventAttach();
    });

    //PROVA RISOLUZIONE TODO 2
    //    var content = $('#content-area').panzoom({
    //        disablePan: true,
    //        disableZoom: true,
    //        onStart : function(e,element){
    //            if (element!=$('#target')) {
    //                reportApp3.incrementValidCounter();
    //                if (DEBUG) alert('Catched Valid Counter!');
    //                
    //            }
    //            e.preventDefault();
    //        },
    //        onEnd: function(e,element,matrix) {},
    //    });

}


function missingTapEventAttach() {
    $("#content-area").on('touchstart', function(e) {
        if ((e.originalEvent.touches.length == 2) && (e.target != $('#target')[0])) {
            // if ((e.touches.length == 2) && (e.target != $('#target'))) {
            if (dataApp.DEBUG) alert('MissingTap');
            reportApp3.incrementInvalidCounter();
        } else if ((e.target == $('#start')) && ($('#start')[0].hidden == false)) {}
    });

    //    
    //    $("#content-area").on('touchstart', function(event) {
    //        var target = $(event.target)[0];
    //        if (target.id!="start") { //Verifica che non sia stato selezionato il tasto start
    //            if (target.id!="target") reportApp3.incrementInvalidCounter();
    //        }
    //    });  
}

function ObjectsCreation() {
    //    var PosIdx = configurationData.posObjects[step];
    var divParent = $('body');

    var target = document.createElement('div');
    target.id = 'target';
    target.hidden = true;
    target.setAttribute('class', 'smallsize');
    target.style.zIndex = '100';

    var endpoint = document.createElement('div');
    endpoint.id = 'endpoint';
    endpoint.setAttribute('class', 'mediumsize');
    endpoint.hidden = true;
    endpoint.style.zIndex = '99';
    endpoint.innerHTML = 'endpoint';

    divParent.append(target);
    divParent.append(endpoint);
}

function nextStepConfiguration(step) {
    //    TODO: Routine per definire la confiugrazione della sessione di pinch-to-zoom
    console.log('Step:' + manager.getStep());
    $('#footer-step').html(getCurrentStep());

    var targetSize = configurationData.dimTarget[step];
    var endpointSize = configurationData.dimObject[step];
    var PosIdx = configurationData.posObjects[step];
    var divParent = $('#' + dataApp.configuration.positions[PosIdx]);


    var target = $('#target');
    var endpoint = $('#endpoint');


    target.hide();
    endpoint.hide();
    //    endpoint[0].hidden = true;
    endpoint.removeClass();
    endpoint.addClass(dataApp.configuration.dimensions[endpointSize]);
    endpoint.css('zIndex', '0');

    divParent.append(endpoint);
    divParent.append(target);


    //DEBUG
    if (dataApp.DEBUG) {
        target.on('click', function(e) {
            finishTask();
            e.stopPropagation();
            //        e.preventDefault();

        });
    }

    target[0].hidden = true;
    target.removeClass();
    target.addClass(dataApp.configuration.dimensions[targetSize]);
    target.css('zIndex', '1');
    // Panzoom Initialization
    var elem = $("#target").panzoom({
        disablePan: true,
        onStart: function(e, element) {
            reportApp3.incrementValidCounter();
            console.log('Start Zoom');
        },
        onEnd: function(e, element, matrix) {

            var scalingFactor = element.getMatrix()[0];
            var delta = Math.abs(endpoint.width() - target.width() * scalingFactor); //
            //Debug
            var Matrix = 'Matrix: ' + scalingFactor + "\n";
            var Delta = 'Delta= ' + delta + "\n";
            var ValidCtr = "ValidCounter: " + reportApp3.getValidCounter() + "\n";
            var InvalidCtr = "Invalid Counter: " + reportApp3.getInvalidCounter() + "\n";
            console.log('Delta : ', Delta);
            if (delta < 10) {
                if (dataApp.DEBUG) alert(Matrix + Delta + "Task completato!\n" + ValidCtr + InvalidCtr);
                finishTask();
            } else {
                element.reset();
                if (dataApp.DEBUG) alert(Matrix + Delta + "Resetto l'elemento!\n" + ValidCtr + InvalidCtr);
            }
        },

    });
    target[0].hidden = true;
    target.removeClass();
    target.addClass(dataApp.configuration.dimensions[targetSize]);
    target.css('zIndex', '1');
    if (dataApp.DEBUG) {
        $("#target").on("mousewheel.focal", function(e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $("#target").panzoom('zoom', zoomOut, {
                increment: 0.1,
                animate: false,
                focal: e
            })
        })
    }
    target.fadeIn();
    endpoint.fadeIn();
    elem.panzoom('reset', false);
    reportApp3.Tstart = getMilliseconds();
    timer = window.setTimeout(function() { finishTask() }, dataApp.SessionTime);
}


function finishTask() {
    clearTimeout(timer); //Disabilito il timeout corrente attivo per evitare timeout a cascata
    reportApp3.storeSuccess();
    //DEBUG
    if (dataApp.DEBUG) alert('Success: ' + reportApp3.Success[manager.getStep()] + "\n Tsuccess: " + reportApp3.Tsuccess[manager.getStep()]);

    $('#target').fadeOut();
    $('#endpoint').fadeOut();

    if (manager.nextSession()) {
        nextStepConfiguration(manager.getStep());
        //Reset dei contatori del report
        reportApp3.setStartTime = getMilliseconds();
        reportApp3.resetInvalidCounter();
        reportApp3.resetValidCounter();
    } else {
        newApplication(reportApp3, dataApp.nextApp);
    }
};