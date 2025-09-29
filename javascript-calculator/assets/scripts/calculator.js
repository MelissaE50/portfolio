function calculate() {
    "use strict";

    // Clear any error or output messages
    document.getElementById("Operand1Error").innerHTML = "";
    document.getElementById("Operand2Error").innerHTML = "";
    document.getElementById("Operand3Error").innerHTML = "";
    document.getElementById("OperatorError").innerHTML = "";
    document.getElementById("Result").innerHTML = "";

    // Error Flag - True if an error has occurred
    let errorflag = false;

    // Get Operand 1 from form
    let operand1 = document.getElementById("Operand1").value;

    // Operand 1 is Required
    if (operand1 == "") {
        document.getElementById("Operand1Error").innerHTML = "Operand 1 is Required";
        errorflag = true;
    }

    // Operand 1 must be a floating point number
    if (isNaN(operand1)) {
        document.getElementById("Operand1Error").innerHTML = "Operand 1 Must be a Floating Point Number";
        errorflag = true;
    }

    // Get Operand 2 from form
    let operand2 = document.getElementById("Operand2").value;

    // Operand 2 is Required
    if (operand2 == "") {
        document.getElementById("Operand2Error").innerHTML = "Operand 2 is Required";
        errorflag = true;
    }

    // Operand 2 must be a floating point number
    if (isNaN(operand2)) {
        document.getElementById("Operand2Error").innerHTML = "Operand 2 Must be a Floating Point Number";
        errorflag = true;
    }


    // At least one operator has to be checked
    if (!document.getElementById("AddOperator").checked && 
        !document.getElementById("SubtractOperator").checked && 
         !document.getElementById("MultiplyOperator").checked && 
        !document.getElementById("DivideOperator").checked) {
            document.getElementById("OperatorError").innerHTML = "Operator is Required";
            errorflag = true;                
    }

    // if there is no error, perform the calculations
    if (!errorflag) {

        // convert the operands from string to floating point
        let operand1fp = parseFloat (operand1);
        let operand2fp = parseFloat (operand2);
        
        // figure out which operator was checked and place the value in operator
        let operator;
        if (document.getElementById("AddOperator").checked) {
            operator = document.getElementById("AddOperator").value;
        }
        if (document.getElementById("SubtractOperator").checked) {
            operator = document.getElementById("SubtractOperator").value;
        }
         if (document.getElementById("MultiplyOperator").checked) {
            operator = document.getElementById("MultiplyOperator").value;
        }
        if (document.getElementById("DivideOperator").checked) {
            operator = document.getElementById("DivideOperator").value;
        }

        // Calculate the answer and put it in result
        let result;
        
        // if the operator was "Min" then set result to the minimum */
        if (operator == "Min") {
            if(operand1fp <= operand2fp && operand1fp <= operand3fp) {
                result = operand1fp;
            }
            if(operand2fp <= operand1fp && operand2fp <= operand3fp) {
                result = operand2fp;
            }
            if(operand3fp <= operand1fp && operand3fp <= operand2fp) {
                result = operand3fp;
            }
        }
 
        // if the operator was "Max" then set result to the maximum
        if (operator == "Max") {
            if(operand1fp >= operand2fp && operand1fp >= operand3fp) {
                result = operand1fp;
            }
            if(operand2fp >= operand1fp && operand2fp >= operand3fp) {
                result = operand2fp;
            }
            if(operand3fp >= operand1fp && operand3fp >= operand2fp) {
                result = operand3fp;
            }
        }

        // if operator was "Avg" the calcualute the average of 3 operands
        if (operator == "Avg") {
            result = (operand1fp + operand2fp + operand3fp) / 3.0;
        }
        
        /* convert the result to a string and display it */
        document.getElementById("Result").innerHTML = result.toString();
    }
}

function clearform() {
    
    /* Set all of the form values to blank or false */
    document.getElementById("Operand1").value = "";
    document.getElementById("Operand2").value = "";
    document.getElementById("Operand3").value = "";
    document.getElementById("Operand1Error").innerHTML = "";
    document.getElementById("Operand2Error").innerHTML = "";
    document.getElementById("Operand3Error").innerHTML = "";
    document.getElementById("MinOperator").checked = false;
    document.getElementById("MaxOperator").checked = false;
    document.getElementById("AvgOperator").checked = false;
    document.getElementById("OperatorError").innerHTML = "";
    document.getElementById("Result").innerHTML = "";
}