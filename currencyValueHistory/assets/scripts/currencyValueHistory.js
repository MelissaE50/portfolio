$(document).ready(function(){
    $("#display").click(getcurrency);
    $("#clear").click(clearform);
});

/*chart sample*/ 

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

 
async function GetStock() {
    "use strict";

    // If all of the form elements are valid, get the form values
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
    /*if (!errorflag) {        
        
        var apiKey = "35eaVfKsObXpSg2O4kMLj9udr2DgVW1f"*/

     

function clearform() {
    "use strict";
    document.getElementById("basecurrency").value = "";
    document.getElementById("converttocurrency").value = "";
    document.getElementById("fromdate").value = "";
    document.getElementById("todate").value = "";
    
   
    /* Ugly Code to Erase Canvas */
    let canvas0 = document.getElementById("chartjs-0");
    let context0 = canvas0.getContext('2d');    
    context0.clearRect(0, 0, canvas0.width, canvas0.height);
   
}
}