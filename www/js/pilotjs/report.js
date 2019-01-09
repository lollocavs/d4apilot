$(document).ready(function() {
    console.log('Report Page ready');

    getReports().then(function(result) {
            console.log("Promise Result : ", result);
            //TODO: Implementare la lista dalla risposta tramite jQuery

            // var startHTML = '<div class="row">';
            var bodyHTML = `
                <div class="row">
                  <div class="col"> <h1>Report Name</h1> </div>
                  <div class="col"> <h1>Origin</h1> </div>
                  <div class="col"> <h1>APP 1</h1> </div>
                  <div class="col"> <h1>APP 2</h1> </div>
                  <div class="col"> <h1>APP 3</h1> </div>
                </div>
            `;
            result.forEach(element => {
                bodyHTML += `
                <div class="row">
                <div class="col"> <h3>${element.name}</h3> </div>
                <div class="col"> <h3>${element.origin}</h3> </div>
                <div class="col"> <h3>${checkDataApp(element,1)}</h3> </div>
                <div class="col"> <h3>${checkDataApp(element,2)}</h3> </div>
                <div class="col"> <h3>${checkDataApp(element,3)}</h3> </div>
                </div>`;

            });
            // var endHTML = '</div>';
            // var stringHTML = startHTML + bodyHTML + endHTML;
            console.log(bodyHTML);
            $("#report-list").html(bodyHTML);
        },
        function(error) {
            console.log(error);
        }
    );

});

function checkDataApp(report, id) {
    check = report.appReports.filter((item) => { return item.id == id });
    if (check && check.length) return 'OK';
    return 'Missing Data';
}