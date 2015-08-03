function postReport() {
    
    var url = 'http://' + location.hostname +':3000/api/reports';
    var method = "POST";
    
    var counter = parseInt(localStorage.userCounter,10);
    var reportObj = new Object;
    reportObj.name = 'report' + counter;
    reportObj.appReports = (JSON.parse(localStorage.getItem('report'+counter))).appReports;
    var report = JSON.stringify(reportObj);
    $.ajax({
        type: method,
        url: url,
        contentType:"application/json; charset=utf-8",
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