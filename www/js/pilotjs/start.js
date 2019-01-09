$(document).ready(function() {
    if (!localStorage.userCounter || localStorage.userCounter.isNaN) {
        localStorage.userCounter = 1;
    }

    $('#start').on('click', function(e) {
        var ctr = parseInt(localStorage.userCounter, 10);
        ctr++;
        localStorage.userCounter = ctr;
        var reportName = 'report' + localStorage.userCounter;
        var report = new reportManager(reportName);
        localStorage.setItem(reportName, JSON.stringify(report));
    });
});