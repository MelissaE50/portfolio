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

/* JS fetch example 
<!DOCTYPE html>
<html>
<body>
<p id="demo">Fetch a file to change this text.</p>

<script>
getText("fetch_info.txt");

async function getText(file) {
  let myObject = await fetch(file);
  let myText = await myObject.text();
  document.getElementById("demo").innerHTML = myText;
}
</script>

</body>
</html> */
