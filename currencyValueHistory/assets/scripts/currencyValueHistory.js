/*chart sample */

var ctx = document.getElementById("chartjs-0");
/*  values is an array containing the y-axis values for the chart */
/*  dates  is an array containing the x-axis values for the chart */
var myChart = new Chart(ctx, {
    "type":"line",
    "data": {
        "labels": dates,
        "datasets":[{
            "data": values,
            fill: false
        }]
    },
    "options":{ 
        responsive: false,
        maintainAspectRatio: true,
    }
});