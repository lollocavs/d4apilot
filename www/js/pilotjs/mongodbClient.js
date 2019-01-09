function postReport() {

    var url = 'http://' + location.host + '/api/reports';
    var method = "POST";

    var counter = parseInt(localStorage.userCounter, 10);
    var reportObj = new Object;
    //TODO: Impostare anche identificativo della macchina???
    reportObj.name = 'report' + counter;
    reportObj.appReports = (JSON.parse(localStorage.getItem('report' + counter))).appReports;
    reportObj.origin = location.host;
    console.log('Report Obj:', reportObj);
    var report = JSON.stringify(reportObj);
    $.ajax({
        type: method,
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: report,
        xhrFields: {
            withCredentials: false
        },
        headers: {},
        success: function(res) {
            console.log(res);
            alert('Il report è stato salvato nel database!');
        },
        error: function(err) {
            console.log(err.responseText);
            alert(err.responseText);
        }
    });
}

function getReports() {
    var url = 'http://' + location.host + '/api/reports';
    var method = "GET";

    return $.ajax({
        type: method,
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        xhrFields: {
            withCredentials: false
        },
        headers: {},
        success: function(res) {
            console.log(res);
            console.log('Ecco la lista dei reports!');
        },
        error: function(err) {
            console.log(err.responseText);
            alert(err.responseText);
        }
    });
}