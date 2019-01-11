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

// GLOBAL VARIABLE OF TARGET
var DIAMETER, MARGIN;

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
}


function missingTapEventAttach() {
    $("#content-area").on('touchstart', function(e) {
        console.log('[TOUCHES] : ', e.originalEvent.touches.length, '| TARGET ID : ', e.target.id);
        // e.stopImmediatePropagation();
        if (e.originalEvent.touches.length == 2) { // Check if it is two-touch interaction
            if (e.target.id !== "target") { // Check if the selected item is the target
                console.log('Invalid Tap!');
                reportApp3.incrementInvalidCounter();
                // e.originalEvent.touches = [];
            } else {
                // console.log('Zoom in action');
                // $('#target').panzoom('zoom');
            }
        }
    });
}

function ObjectsCreation() {
    //    var PosIdx = configurationData.posObjects[step];
    var divParent = $('body');

    var target = document.createElement('div');
    target.id = 'target';
    target.hidden = true;
    target.setAttribute('class', 'pinch smallsize');
    target.style.zIndex = '100';


    var endpoint = document.createElement('div');
    endpoint.id = 'endpoint';
    endpoint.setAttribute('class', 'mediumssize');
    endpoint.hidden = true;
    endpoint.style.zIndex = '99';
    endpoint.innerHTML = 'endpoint';

    divParent.append(target);
    divParent.append(endpoint);

    endpoint = $('#endpoint');

    makeTargetPinchable();
}

function makeTargetPinchable() {
    // Hammer Init
    var el = document.querySelector(".pinch");
    var hammer = new Hammer(el, {
        domEvents: true
    });
    hammer.get('pinch').set({ enable: true });

    hammer.on('pinch', function(e) {
        el.style.transform = `scale(${e.scale},${e.scale})`;
    })

    hammer.on('pinchend', function(e) {
        console.log('[PINCHEND] E:', e);
        target = $('#target');
        endpoint = $('#endpoint');
        scaleFactor = Number(target[0].style.transform.slice(6).split(',')[0]);
        var delta = Math.abs(endpoint.width() - target.width() * scaleFactor);
        console.log(`[DELTA] : ${delta} | [Valid Taps] : ${reportApp3.getValidCounter()} | [Invalid Taps] : ${reportApp3.getInvalidCounter()}`);

        if (delta < 20) {
            console.log("Task completato!");

            finishTask();
            el.style.transform = `scale(1, 1)`;
        } else {
            el.style.transform = `scale(1, 1)`;
            console.log("Resetto l'elemento!");
        }
    })
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

    // target[0].hidden = true;
    target.removeClass();
    target.addClass('pinch');
    target.addClass(dataApp.configuration.dimensions[targetSize]);
    target.css('zIndex', '1');

    target.fadeIn();
    endpoint.fadeIn();
    // target[0].hidden = false;
    // endpoint[0].hidden = false;
    DIAMETER = target.width();
    MARGIN = Number(target.css('margin-top').split('px')[0]);
    console.log('[DIAMETER] : ', DIAMETER, '| [MARGIN] : ', MARGIN);
    // $('#target').panzoom('reset', false);
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