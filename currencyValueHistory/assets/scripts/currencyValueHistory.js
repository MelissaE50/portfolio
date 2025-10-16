$(document).ready(function(){
    $("#display").click(getcurrency);
    $("#clear").click(clearform);
});

/*chart sample 

var ctx = document.getElementById("chartjs-0");
/*  values is an array containing the y-axis values for the chart */
/*  dates  is an array containing the x-axis values for the chart */
/*
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

 JS fetch example 
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
</html> 
*/
async function GetStock() {
    "use strict";

    // If all of the form elements are valid, the get the form values
    // Clear any error or output messages
    document.getElementById("BaseCurrencyError").innerHTML = "";
    document.getElementById("ConvertToCurrencyError").innerHTML = "";
    document.getElementById("FromDateError").innerHTML = "";
    document.getElementById("ToDateError").innerHTML = "";

    // Error Flag - True if an error has occurred
    let errorflag = false;

    // Get Base Currency from form
    let BaseCurrency = document.getElementById("BaseCurrency").value;

    // Base Currency is Required
    if (BaseCurrency == "") {
        document.getElementById("BaseCurrencyError").innerHTML = "Base Currency is Required";
        errorflag = true;
    }

    // Get Convert to Currency from form
    let ConvertCurrency = document.getElementById("ConvertToCurrency").value;

    // Convert to Currency is Required
    if (ConvertCurrency == "") {
        document.getElementById("ConvertCurrencyError").innerHTML = "Convert to Currency is Required";
        errorflag = true;
    }
    
    // Get FromDate from form
    let FromDate = document.getElementById("FromDate").value;

    // FromDate is Required
    if (FromDate == "") {
        document.getElementById("FromDateError").innerHTML = "From Date is Required";
        errorflag = true;
    }

    // Get ToDate from form
    let ToDate = document.getElementById("ToDate").value;

    // ToDate is Required
    if (ToDate == "") {
        document.getElementById("ToDateError").innerHTML = "To Date is Required";
        errorflag = true;
    }

    // No Errors
    if (!errorflag) {        
        
        var apiKey = "35eaVfKsObXpSg2O4kMLj9udr2DgVW1f"

        /* URL for AJAX Call */
        let myURL1 = "https://api.polygon.io/v3/reference/tickers/" + StockSymbol + "?apiKey=" + apiKey;
        /* Make the AJAX call */
        let msg1Object = await fetch(myURL1);
        /* Check the status */
        if (msg1Object.status >= 200 && msg1Object.status <= 299) {            
            let msg1JSONText = await msg1Object.text();
            // Parse the JSON string into an object
            let msg1 = JSON.parse(msg1JSONText);
            /* Your code to process the result goes here - 
               display the returned message */
            document.getElementById("company").innerHTML = msg1.results.name;
            document.getElementById("address").innerHTML = msg1.results.address.address1 + ", " + msg1.results.address.city + ", " 
                + msg1.results.address.state + "   " + msg1.results.address.postal_code;
            document.getElementById("employees").innerHTML = msg1.results.total_employees;
            document.getElementById("description").innerHTML = msg1.results.sic_description;
            document.getElementById("url").innerHTML = msg1.results.homepage_url;
            document.getElementById("url").href = msg1.results.homepage_url;
        }
        else {
            /* AJAX complete with error - probably invalid stock ticker symbol */
                /* Your code to process the result goes here - 
                   display the returned message */
            alert("Stock Not Found - Status: " + msg1Object.status)
            return;
        }        
 
        /* URL for AJAX Call */
        let myURL2 = "https://api.polygon.io/v2/aggs/ticker/" + StockSymbol + "/range/1/day/" + FromDate + "/" + ToDate + "?unadjusted=false&sort=asc&limit=32&apiKey=" + apiKey;
        /* Make the AJAX call */
        let msg2Object = await fetch(myURL2);
        /* Check the status */
        if (msg2Object.status >= 200 && msg2Object.status <= 299) {            
            let msg2JSONText = await msg2Object.text();
            // Parse the JSON string into an object
            let msg2 = JSON.parse(msg2JSONText);
            /* Your code to process the result goes here - 
               display the returned message */
                /* Your code to process the result goes here  
                    display the returned message */
                let stockdate = [];
                let stockvalue = [];
                let stockvolume = [];
                let numdays = msg2.results.length;
                if (numdays > 0) {
                    for (let i = 0; i < numdays; i++) {
                        /* stock close value */
                        stockvalue[i] = msg2.results[i].c;
                        /* stock volume */
                        stockvolume[i] = msg2.results[i].v;
                        /* date is in Unix milleseconds - create a temporary date variable */
                        var tempdate = new Date(msg2.results[i].t);
                        /* extract the date string from the value */
                        stockdate[i] = tempdate.toLocaleDateString();
                    }
                }

                let stockvaluetable = "";
                if (numdays > 0) {
                    stockvaluetable = stockvaluetable + "<table><caption>Stock Price</caption><tr><th>Date</th><th>Price</th></tr>";
                    for (let i = 0; i < numdays; i++) {
                        stockvaluetable = stockvaluetable + "<tr><td>" + stockdate[i] + "</td><td>" + stockvalue[i] + "</td></tr>";
                    }
                    stockvaluetable = stockvaluetable + "</table>"
                    document.getElementById("StockValueTable").innerHTML = stockvaluetable;
                }
                
                let stockvolumetable = "";
                if (numdays > 0) {
                    stockvolumetable = stockvolumetable + "<table><caption>Stock Volume</caption><tr><th>Date</th><th>Volume</th></tr>";
                    for (let i = 0; i < numdays; i++) {
                        stockvolumetable = stockvolumetable + "<tr><td>" + stockdate[i] + "</td><td>" + stockvolume[i] + "</td></tr>";
                    }
                    stockvolumetable = stockvolumetable + "</table>"
                    document.getElementById("StockVolumeTable").innerHTML = stockvolumetable;
                }

                let ctx0 = document.getElementById("chartjs-0");
                let myChart0 = new Chart(ctx0, {
                    "type":"line",
                    "data": {
                        "labels": stockdate,
                        "datasets":[{"label":"Stock Close",
                        "data": stockvalue,
                        "fill":false,
                        "borderColor":"rgb(75, 192, 192)",
                        "lineTension":0.1}]},
                        "options":{ 
                            responsive: false,
                            maintainAspectRatio: true,
                        }
                    }
                );
                
                let ctx1 = document.getElementById("chartjs-1");
                let myChart1 = new Chart(ctx1, {
                    "type":"line",
                    "data": {
                        "labels": stockdate,
                        "datasets":[{"label":"Stock Volume",
                        "data": stockvolume,
                        "fill":false,
                        "borderColor":"rgb(75, 192, 192)",
                        "lineTension":0.1}]},
                        "options":{ 
                            responsive: false,
                            maintainAspectRatio: true,
                        }
                    }
                );
            
        }
        else {
            /* AJAX completed with error - probably invalid stock ticker symbol */
            alert("Stock Not Found - Status: " + msg2Object.status)
            return
        }
    }
}

function ClearForm() {
    document.getElementById("BaseCurrency").value = "";
    document.getElementById("ConvertCurrency").value = "";
    document.getElementById("FromDate").value = "";
    document.getElementById("ToDate").value = "";
    
    document.getElementById("StockValueTable").innerHTML = "";
    document.getElementById("StockVolumeTable").innerHTML = "";
    document.getElementById("BaseCurrencyError").innerHTML = "";
    document.getElementById("ConvertCurrencyError").innerHTML = "";
    document.getElementById("FromDateError").innerHTML = "";
    document.getElementById("ToDateError").innerHTML = "";
    
    /* Ugly Code to Erase Canvas */
    let canvas0 = document.getElementById("chartjs-0");
    let context0 = canvas0.getContext('2d');    
    context0.clearRect(0, 0, canvas0.width, canvas0.height);
    let canvas1 = document.getElementById("chartjs-1");
    let context1 = canvas1.getContext('2d');    
    context1.clearRect(0, 0, canvas1.width, canvas1.height);
}
