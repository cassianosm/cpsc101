var myArray = [];
var baseX = 2;

window.onload = function(){
    changeBase();
};

function myKeyPress(event, base) {
    if (event.keyCode == 13) {
        if (base == "ten") {
            callFromBaseTenToBaseX();
        } else {
            callFromBaseXToBaseTen();
        }
    }
}

function callFromBaseTenToBaseX() {
    var number = document.getElementById("baseTenInput").value;
    if (!Number.isNaN(+number) && +number >= 0 && number != "" && Number.isInteger(Number(number))) {
        fromBaseTenToBaseX(+number);
    } else {
        alert("Invalid Number. Please input a positive integer.");
    }
}

function fromBaseTenToBaseX(value) {
    var quotient;
    var remainder;
    myArray.length = 0;
    do {
        quotient = Math.floor(value/baseX);
        remainder = value % baseX;
        myArray.push([value, baseX, quotient, remainder]);
        value = quotient;
    } while (quotient > 0);
    displayFromBaseTenToBaseX();
}

function displayFromBaseTenToBaseX(){
    var newHtml = "<ol>";
    var newNumber = "";
    var count;

    for (count = 0; count < myArray.length; count ++) {
        newHtml += "<li>" + myArray[count][0] + " &divide; " + myArray[count][1] + " = " + myArray[count][2] + " with a remainder of " + myArray[count][3] + "</li>";
        newNumber = myArray[count][3].toString(myArray[count][1]).toUpperCase() + newNumber;
    }

    newHtml += "</ol><ul><li>Now collect the remainders from the bottom up and put them together to form the Base " + baseX + " number.</li>";
    newHtml += "<li>The number is: " + newNumber + "</li></ul>";
    document.getElementById("arrayView").innerHTML = newHtml;
    document.getElementById("baseXInput").value = newNumber;
}

function callFromBaseXToBaseTen() {
    var number = document.getElementById("baseXInput").value;
    if (!isValidChar(number) || number == "" || number == null) {
        alert("Invalid number for base " + baseX);
    } else {
        fromBaseXToBaseTen(number);
    }
}

function fromBaseXToBaseTen(value){
    myArray.length = 0;
    var exponent  = 0;
    var char, resultPow, result;
    for (var count = value.length - 1; count >= 0; count --){
        char = value.charAt(count);
        char = parseInt(char, baseX);
        resultPow = Math.pow(baseX, exponent);
        result = char * resultPow;
        myArray.push([char, baseX, exponent, resultPow, result]);
        exponent  ++;
    }
    displayFromBaseXToBase10();
}

function displayFromBaseXToBase10() {
    var newHtml = "<ul><li>To convert " + document.getElementById("baseXInput").value + " from base " + baseX + " to decimal (base 10), multiply the digits by powers of the base.</li>";
    newHtml += "<li>Start with the rightmost digit and multiply by " + baseX + " to the 0th power (which is 1). Then multiply the next digit by " + baseX + " to the 1st power and so on. Add up all the products.</li></ul>";
    newHtml += "<ol>";
    var newNumber = 0;

    for (var count = 0; count < myArray.length; count ++) {
        newHtml += "<li>" + myArray[count][0] + " x " + myArray[count][1] + " raised to the power " + myArray[count][2] + " (" + myArray[count][3] + ") = " + myArray[count][4] + "</li>";
        newNumber += myArray[count][4];
    }

    newHtml += "</ol><ul><li>The resulting sum is: " + newNumber + "</li><ul>";
    document.getElementById("arrayView").innerHTML = newHtml;
    document.getElementById("baseTenInput").value = newNumber;
}

function isValidChar(value) {
    var chartTest = "";
    var isValid = true;
    value = value.toLowerCase();
    var allowedCharsArray = allowedChars();

    for (var x = 0; x < value.length; x ++) {
        chartTest = value.charAt(x).toString();
        if (allowedCharsArray.indexOf(chartTest) == -1) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

function allowedChars(){
    switch (baseX) {
        case 2:
            return ["0", "1"];
            break;
        case 3:
            return ["0", "1", "2"];
            break;
        case 5:
            return ["0", "1", "2", "3", "4"];
            break;
        case 8:
            return ["0", "1", "2", "3", "4", "5", "6", "7"];
            break;
        case 10:
            return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            break;
        case 16:
            return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            break;
        default:
            return [];
            break;
    }
}

function changeBase() {
    if (document.getElementById("base2").checked) {
        baseX = 2;
    }
    if (document.getElementById("base3").checked) {
        baseX = 3;
    }
    if (document.getElementById("base5").checked) {
        baseX = 5;
    }
    if (document.getElementById("base8").checked) {
        baseX = 8;
    }
    if (document.getElementById("base16").checked) {
        baseX = 16;
    }
    document.getElementById("btnBaseX").innerHTML = "Convert to Base " + baseX + " &rarr;";
    document.getElementById("baseXLabel").innerHTML = "Base " + baseX + ": ";
}

function callClearValues() {
    document.getElementById("arrayView").innerHTML = "";
    document.getElementById("baseTenInput").value = "";
    document.getElementById("baseXInput").value = "";
}
