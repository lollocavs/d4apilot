var currentReport, userCounter;

$( document ).ready(function () {
    userCounter = parseInt(localStorage.userCounter,10);     
    currentReport = new reportManager('report' + userCounter);
    currentReport.importJSON(downloadReportData());
    //Send report to gdrive
    //handleClientLoad();
    //createFolder();
    $('#footer-title')[0].innerHTML = getUserNumber();
    createAppInfo(1);
    createAppInfo(2);
    createAppInfo(3);
});

function uploadFileRoutine() {
    var body = localStorage.getItem('report' + userCounter);
    var title = 'report'+userCounter+'.json';
    var type = 'application/json';
    
    var file = new File([body],title);
    insertFile(file,function() { 
        //TODO: Funzione di Callback da rivedere!!!!
        //Viene eseguita anche un invio non riuscito
        console.log('File caricati!');});
        alert('File Caricato con successo su Google Drive!');
}

function createAppInfo(numberApp) {
    var canvas = "#canvas" + numberApp;
    var options = Chart.defaults.global;
    var ctx = $(canvas).get(0).getContext("2d");
    if (currentReport.getAppReportById(numberApp)) {
        var dataset = createDataStructure(currentReport.getAppReportById(numberApp));
        var label = dataset.datasets[0].label;
        var title = $('#app'+numberApp)[0].firstElementChild.innerHTML=label;
        var newChart = new Chart(ctx).Bar(dataset,options);
    }
    
}

function createDataStructure (appReport) {
    var labelName = "Report dell'APP" + appReport.id +": " +appReport.appName;
    var inTaps = mean(appReport.invalidTaps);
    var vaTaps = mean(appReport.validTaps);
    var Succ=0; 
    var Time = mean(appReport.Tsuccess)/1000;
    appReport.Success.forEach(function(item) {if(item) Succ++;});

    var data = {
        labels : ["AVG InvalidTaps" , "AVG ValidTaps" , "Success", "AVG Time Reponse"],
        datasets: [
        {
            label: labelName,
            fillColor: "rgba(34,153,238,0.5)",
            strokeColor: "rgba(34,153,238,0.8)", //#29e
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [inTaps, vaTaps, Succ, Time]
        }
        ]
    }
    return data;
}
            
function mean(array) {   
    var acc = 0;
    array.forEach(function(item) {acc+=item;});
    return acc/array.length;
}