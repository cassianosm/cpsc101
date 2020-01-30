var exampleArray = [5, 16, 19, 25, 37, 44, 56, 62, 79, 81, 99, 100, 105, 117, 200, 300];
var animationSpeed = 500;
var running = false;
var algorithm = "sequential";
var counter = 0;
var copyArray = [];
var itemsThatAreNot = [];
var newArray = [];
var middleIndex;
var middleItem;
var resultMessage = "";
var timer;

window.onload = updateDisplay;

function myKeyPress(event) {
    if (event.keyCode == 13) {
        callSearch();
    }
}

function callSearch() {
    if (!running) {
        counter = 0;
        let itemToSearch = document.getElementById("searchItem").value;
        if (itemToSearch != "" && !isNaN(+itemToSearch)){
            resultMessage = "";
            itemsThatAreNot.length = 0;
            algorithm == "sequential" ? sequentialSearch(+itemToSearch, exampleArray) : binarySearch(+itemToSearch, exampleArray);
        } else {
            alert("Please enter a valid number");
        }
    }
}

function binarySearch(searchValue, array) {
    copyArray.length = 0;
    copyArray = array.slice();
    var minIndex = 0;
    var maxIndex = copyArray.length - 1;
    middleIndex = Math.floor((copyArray.length - 1) / 2);
    middleItem = copyArray[middleIndex];
    running = true;
    updateDisplay();

    if (searchValue == middleItem) {
        counter ++;
        resultMessage = "Number " + middleItem + " found in cell " + exampleArray.indexOf(middleItem) + ". Total comparison(s): " + counter;
        updateDisplay();
        running = false;
    } else if (searchValue < middleItem) {
        counter++;
        newArray.length = 0;
        newArray = copyArray.splice(0, middleIndex);
        itemsThatAreNot = itemsThatAreNot.concat(copyArray);
        timer = setTimeout(function() {
            binarySearch(searchValue, newArray);
        }, animationSpeed);
    } else if (searchValue > middleItem) {
        counter++;
        newArray.length = 0;
        newArray = copyArray.splice(middleIndex + 1, maxIndex);
        itemsThatAreNot = itemsThatAreNot.concat(copyArray);
        timer = setTimeout(function() {
            binarySearch(searchValue, newArray);
        }, animationSpeed);
    } else {
        resultMessage = "Number " + searchValue + " not found. Total comparison(s): " + counter;
        running = false;
        updateDisplay();
    }
}

function sequentialSearch(searchValue, array) {
    copyArray.length = 0;
    copyArray = array.slice();
    middleItem = copyArray[0];
    running = true;
    updateDisplay();
    var item;

    if (searchValue == middleItem){
        counter += 1;
        resultMessage = "Number " + searchValue + " found in cell " + exampleArray.indexOf(searchValue) + ". Total comparison(s): " + counter;
        updateDisplay();
        running = false;
    } else {
        if (copyArray.length > 0) {
            newArray.length = 0;
            item = copyArray.shift();
            newArray = copyArray.slice();
            itemsThatAreNot.push(item);
            if (middleItem > searchValue) {
                counter += 1;
                resultMessage = "Number " + searchValue + " not found. Total comparison(s): " + counter + ". Remaining values in list are greater than the number.";
                middleItem = -1;
                updateDisplay();
                running = false;
            } else {
                counter += 1;
                timer = setTimeout(function() {
                    sequentialSearch(searchValue, newArray);
                }, animationSpeed);
            }
        } else {
            middleItem = -1;
            resultMessage = "Number " + searchValue + " not found. Total comparison(s): " + counter;
            updateDisplay();
            running = false;
        }
    }
}

function updateDisplay(){
    let originalArrayIndex = exampleArray.indexOf(middleItem);
    var newHtml = "";
    for (let x = 0; x < exampleArray.length; x++){
        newHtml += "<li id='" + x + "'";
        if (x == originalArrayIndex) {
            newHtml += " class='current'";
        }
        if (itemsThatAreNot.length > 0){
            for (let y = 0; y < itemsThatAreNot.length; y++){
                let areNotIndex = exampleArray.indexOf(itemsThatAreNot[y]);
                if (areNotIndex == x) {
                    newHtml += " class='not-it'";
                }
            }
        }
        newHtml += ">"+exampleArray[x]+"</li>";
    }
    document.getElementById("search").innerHTML = newHtml;
    document.getElementById("arrayView").innerHTML = resultMessage;
}

function changeAlgorithm() {
    if (document.getElementById("sequential").checked){
        algorithm = "sequential";
    } else {
        algorithm = "binary";
    }
}

function loadExample(value) {
    if (value > 0) {
        document.getElementById("searchItem").value = value;
        if (value == 99 || value == 20) {
            document.getElementById("sequential").checked = true;
        } else {
            document.getElementById("binary").checked = true;
        }
        if (running) {
            clearTimeout(timer);
            running = false;
        }
        changeAlgorithm();
        callSearch();
    }
}
