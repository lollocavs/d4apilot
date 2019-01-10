/*
appManager.js
-------------------
Author: L.Cavalieri
Istitute: UNIVPM
Project Name: Design 4 All [D4ALL]
Target: Preliminary Pilot Application for Design of Adaptive Interface

Description: Javascript Functions to general management of the mobile application. In this file the time manager and report manager object are included. They are the following features:
- timeManager: management of trasaction time through the different application step.
- reportManager: record of the main features of the application and the report of user interactions.
*/

var dataApp, totalApp;

// GENERAL FUNCTION 
function getTitlePage(appCounter, totalApp) {
    $('#titlePage').html('GIOCO #' + appCounter + ' [di ' + totalApp + ']');
}

function getAppConfig(appName) {
    //! TEST CONFIGURATION
    // var url = './config/appConfig_test.json';
    var url = './config/appConfig.json';
    var request = $.ajax({
        type: 'GET',
        url: url,
        // Tell jQuery we're expecting JSONP
        dataType: "json",
        // Work with the response
        success: function(result) {
            totalApp = result.totalApp;
            dataApp = result[appName];
            getTitlePage(dataApp.appCounter, totalApp);
            console.log("Uploaded File: " + url);
        },
        fail: function(result) {
            console.log("App Config Failed: " + result.responseText);
        },
        error: function(result) {
            console.log("App Config Error: " + result.responseText);

        }
    });
}

function getFileConfigJSON(appNumber, partNumber, user) {
    var fileName = './json/app';
    if (user.length == 1) user = '00' + user;
    if (user.length == 2) user = '0' + user;
    fileName += +appNumber + '_' + partNumber + user + '.json';
    return fileName;
}

function getUserNumber() {
    var user = "UTENTE NUMERO :"
    user += localStorage.userCounter;
    return user;
}

function getCurrentStep() {
    var step = "";
    if (dataApp.NumStep) step = 'STEP: ' + manager.getStep();
    return step;
}

function getMilliseconds() {
    return new Date().getTime();
}

function loadUserCounter() {
    userCounter = parseInt(localStorage.userCounter, 10);
}

function registerLocalData() {
    if (!UpdateFlag) updateDataDemo();
    localStorage.setItem("userCounter", userCounter);
    localStorage.setItem("report" + userCounter, JSON.stringify(report));
}

function registerAppData(appReport) {
    report.insertNewAppReport(appReport);
    registerLocalData();
}

function downloadReportData() {
    var counter = parseInt(localStorage.userCounter, 10);
    var reportJSON = JSON.parse(localStorage.getItem("report" + counter));
    return reportJSON;
}

function storeAppSessions(reportApp) {
    var userCounter = localStorage.userCounter;
    var report = new reportManager("report" + userCounter);
    report.importJSON(downloadReportData());
    report.insertNewAppReport(reportApp);
    report.save();
}

function newApplication(reportApp, nextApp) {
    storeAppSessions(reportApp);
    alert("Questo gioco è finito. Premere 'OK' per continuare con gli altri.");
    location.assign(nextApp); //Redirect automatico
}


// TIME MANAGER CLASS
// Description: class to manage the application behaviour and temporalization
function timeManager(step) {

    this.TimeStart = 0;
    var appSessions = step;
    var counterSession = 0;

    this.getStep = function() {
        return counterSession;
    };

    this.setAppSessions = function(maxSession) {
        appSessions = maxSession;
    };

    this.incrementStep = function() {
        counterSession++;
    };

    //Metodi per la gestione della view dell'applicazione
    this.fadeOutIntro = function() {
        $(".bar-subheader").fadeOut("slow");
        $("#forward").removeClass("hidden"); //Serve per adisabilitare il redirect manuale
    };

    this.startApp = function() {
        $("ion-content").fadeIn("slow");
        this.TimeStart = getMilliseconds();
    };

    this.nextSession = function() { //(save,configure, nextApp) {
        var verifyValidSession = (counterSession != appSessions);

        if (verifyValidSession) counterSession++;
        return verifyValidSession;
    };

};

// REPORT MANAGER CLASS
// Description: class to manage the overall report data model
function reportManager(name) {

    var nameReport = name;
    //this.user = new userProfile(nameReport);
    this.appReports = []; //Array dei report di ogni applicazione

    this.getAppReportById = function(id) {
        var targetReport;
        this.appReports.forEach(function(item) {
            if (item.id == id) targetReport = item;
        });
        return targetReport;
    };

    this.importJSON = function(jSON) {
        if (jSON.user) this.user = jSON.user;
        this.appReports = jSON.appReports;
    };

    this.insertUserData = function(userField, value) {
        //TODO: con il codice di seguito viene beccato il valore non la variabile!!!! 
        if (Array.isArray(this.user[userField])) {
            this.user[userField].push(value);
        } else {
            this.user[userField] = value
        }
    };

    this.insertNewAppReport = function(newAppReport) {
        var newRepFlag = true;
        var IDX;
        this.appReports.forEach(function(item, idx) {
            if (item.id == newAppReport.id) {
                newRepFlag = false;
                IDX = idx;
            }
        });
        newAppReport.stepNumber++;
        if (newRepFlag) {
            this.appReports.push(newAppReport);
        } else {
            var updatingReport = this.appReports[IDX];
            updatingReport.Tsuccess = updatingReport.Tsuccess.concat(newAppReport.Tsuccess);
            updatingReport.Success = updatingReport.Success.concat(newAppReport.Success);
            updatingReport.validTaps = updatingReport.validTaps.concat(newAppReport.validTaps);
            updatingReport.invalidTaps = updatingReport.invalidTaps.concat(newAppReport.invalidTaps);
            updatingReport.stepNumber += newAppReport.stepNumber;

            this.appReports[IDX] = updatingReport;
        }
    };

    //Salva lo stato attuale dell'attuale report manager
    this.save = function() {
        localStorage.setItem(nameReport, JSON.stringify(this));
    };
};

// USER PROFILE CLASS
// Description: class to store socio-demographic and social features of the target user
function userProfile(ID) {
    var NoValue = "Not Assigned";
    this.id = ID;
    //Caratteristiche socio-demografiche
    this.Birthday = 1900;
    this.Gender = NoValue;
    this.CivilState = NoValue;
    this.Istruction = NoValue;
    this.IstructionYear = 0;
    this.Job = NoValue;
    this.LastJob = NoValue;
    this.Revenue = NoValue;
    this.OtherRevenue = NoValue; //Da valutare se inserire in variabile 
    this.Cohabitant = new coabitants();
    //Supporto sociale
    this.HelpParent = false;
    this.HelpParentNumber = 0;
    this.ParentSatisfaction = 0;
    this.HelpFriend = false;
    this.HelpFriendNumber = 0;
    this.FriendSatisfaction = 0;
    this.HelpNeighbor = false;
    this.HelpNeighborNumber = 0;
    this.NeighborSatisfaction = 0;
    this.Caregiver = NoValue;
    this.OtherCaregiver = NoValue; //Da valutare se inserire in variabile 

    this.HardHealthcare = [];
    this.MediumHealthcare = [];
    this.Homework = [];
    this.Meals = [];
    this.TransportService = [];
    this.DayHospital = [];
    this.HomeHealthcare = [];
    this.Therapy = [];
    this.OtherService = [];

    this.Family = [];
    this.Neighbor = [];
    this.Friend = [];
    this.Association = [];
    this.Church = [];
    this.PrivateAssistant = [];
    this.OtherCargiverService = [];
};

function coabitants() {
    this.Nobody = 0;
    this.Mate = 0;
    this.Children = 0;
    this.Grandchildren = 0;
    this.SonInLaw = 0;
    this.Brothers = 0;
    this.Parent = 0;
    this.Assistant = 0;
    this.Others = 0;
    this.Refuse = 0;
};

// APPLICATION REPORT
// Description: class to manage a single application data model and target variables
function appReport(user, number, name, step, Ts, DTm) {

    //GENERAL INFO APP
    this.userID = user;
    this.id = number;
    this.appName = name;
    this.stepNumber = step;
    this.Tstart = Ts;
    this.DTmax = DTm;

    //REPORT DATA    
    this.validTaps = []; //Taps che permetto di iniziare l'azione del task
    this.invalidTaps = []; //Taps che non permetto di iniziale l'azione del task
    this.Tsuccess = []; //Tempo di successo nel task in millisecondi (ms)
    this.Success = []; //Array di flag per individuare 

    //Working variable
    var validCounter = 0;
    var invalidCounter = 0;

    this.setStartTime = function(T) { this.Tstart = T; };

    this.resetValidCounter = function() { validCounter = 0; };

    this.resetInvalidCounter = function() { invalidCounter = 0; };

    this.incrementValidCounter = function() { validCounter++; };

    this.incrementInvalidCounter = function() { invalidCounter++; };

    this.getInvalidCounter = function() { return invalidCounter; };

    this.getValidCounter = function() { return validCounter; };

    this.storeSuccess = function() {
        var time = getMilliseconds() - this.Tstart;
        var success = true;

        if (time >= this.DTmax) {
            success = false;
            time = this.DTmax;
        }
        this.Tsuccess.push(time);
        this.Success.push(success);
        if ((validCounter != 0) && (success)) validCounter--;
        this.validTaps.push(validCounter);
        this.invalidTaps.push(invalidCounter);
        //event.preventDefault();

        //        this.Tstart+=time;
    };
};