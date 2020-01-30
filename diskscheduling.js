var exampleArray = [19, 4, 21, 3, 97, 40, 50, 62, 10, 86, 2];
var animationArray = [];
var userInputArray = [];
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var initPos = 25;
var textPos0 = initPos + 4;
var animationSpeed = 100;
var textArea = document.getElementById("arrayInput");
var running = false;
var nextValueY;

function DiskImage (initialPosition) {
    this.position = initialPosition;
    this.numbers = [];
    this.algorithm = "fcfs";
    this.totalTracks = 0;
    this.nextPosition = 0;
    this.direction = "up";
    this.drawRectangle = function () {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#FFFF66";
        ctx.fillRect(40, initPos, 30, 400);
        ctx.fillStyle = "#000000";
        ctx.fillText("0", 30, textPos0);
        ctx.fillText("99", 20 , 396 + textPos0);
    };
    this.drawNumbers = function () {
        ctx.fillStyle = "#000000";
        if (this.numbers.length > 0) {
            let z = 0;
            for (let x = 0; x < this.numbers.length; x ++){
                z = this.numbers[x] * 4;
                z += textPos0;
                ctx.fillText(this.numbers[x], 75, z);
            }
        }
        this.drawPosition();
        this.drawTotalTracks();
    };
    this.drawPosition = function () {
        ctx.fillStyle = "#000000";
        ctx.fillText("Position: " + this.position, 95 ,textPos0);
    };
    this.drawNextPosition = function () {
        ctx.fillStyle = "#000000";
        if (isNaN(this.nextPosition)) {
            ctx.fillText("Next: ", 95, textPos0 + 40);
        } else {
            ctx.fillText("Next: " + this.nextPosition, 95, textPos0 + 40);
        }
    };
    this.drawTotalTracks = function () {
        ctx.fillStyle = "#000000";
        ctx.fillText("Total tracks: " + this.totalTracks, 95, textPos0 + 20);
    };
    this.drawHead = function (pos = this.position) {
        pos = (initPos + 4 * pos);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(40, pos, 30, 5);
    };
    this.move = function (newPosition) {
        this.drawRectangle();
        this.drawHead(newPosition);
        if (newPosition > this.position) {
            this.direction = "up";
        } else {
            this.direction = "down";
        }
        this.position = newPosition;
        this.drawNumbers();
        this.drawNextPosition();
    };
    this.drawRectangle();
    this.drawHead();
    this.drawPosition();
    this.drawNextPosition();
    this.drawTotalTracks();
}

var myDisk = new DiskImage(50);

function changeAlgorithm(algorithm) {
    myDisk.algorithm = algorithm;
}

function loadUserArray() {
    userInputArray.length = 0;
    var userArray = textArea.value.split("\n");
    for (let count = 0; count < userArray.length; count ++) {
        if (!isNaN(userArray[count]) && userArray[count] != "" && Number(userArray[count]) < 100 && Number(userArray[count]) >= 0 && Number.isInteger(Number(userArray[count]))) {
            userInputArray.push(+userArray[count]);
        } else {
            userInputArray.length = 0;
            break;
        }
    }
}

function loadExample() {
    let newValue = "";
    for (let count = 0; count < exampleArray.length; count ++) {
        newValue += exampleArray[count] + (count == exampleArray.length - 1 ? "" : "\n");
    }
    textArea.value = newValue;
}

function startAnimation() {
    if (!running) {
        loadUserArray();
        animationArray.length = 0;
        animationArray = userInputArray.slice();
        myDisk.position = 50;
        myDisk.totalTracks = 0;
        myDisk.direction = "up";
        if (animationArray.length > 0) {
            if (myDisk.algorithm == "sstf") {
                orderArrayShortestSeekTimeFirst();
            }
            if (myDisk.algorithm == "scan") {
                orderArrayScan();
            }
            nextValueY = animationArray[0];
            myDisk.numbers = animationArray;
            myDisk.nextPosition = nextValueY;
            myDisk.drawNumbers();
            myVar = setInterval(moveHead, animationSpeed);
            running = true;
        } else {
        alert("Please enter one valid positive integer (0 - 99) per line and don't leave empty lines.");
        }
    } else {
        alert("Process running. Please wait or stop current process.");
    }
}

function stopAnimation() {
    if (running) {
        clearInterval(myVar);
        running = false;
    }
}

function moveHead() {
    let x;
    if (animationArray.length > 0){
        if (myDisk.position > nextValueY) {
            x = myDisk.position - 1;
            myDisk.move(x);
            myDisk.totalTracks++;
        } else if (myDisk.position < nextValueY) {
            x = myDisk.position + 1;
            myDisk.move(x);
            myDisk.totalTracks++;
        } else {
            myDisk.drawNumbers();
            animationArray.shift();
            nextValueY = animationArray[0];
            myDisk.nextPosition = nextValueY;
            myDisk.drawRectangle();
            myDisk.drawHead();
            myDisk.drawNumbers();
            myDisk.drawNextPosition();
        }
    } else {
        stopAnimation();
    }
}

function orderArrayShortestSeekTimeFirst() {
    let temporaryArray = animationArray.slice();
    let newArray = [], y, position = myDisk.position;
    if (temporaryArray.length > 1) {
        let shortestDitanceItem, shortestDitanceItemIndex;
        while (temporaryArray.length > 0) {
            y = findNextPoint(position, temporaryArray)
            newArray.push(y);
            position = y;
            temporaryArray.splice(temporaryArray.indexOf(y), 1);
        }
        animationArray.length = 0;
        animationArray = newArray.slice();
        temporaryArray.length = 0;
    }
}

function findNextPoint(startPoint, myArray) {
    let shortestDitanceItem, distance = 100, absolute;
    if (myArray.length > 1) {
        for (let x = 0; x < myArray.length; x++){
            absolute = Math.abs(myArray[x] - startPoint);
            if (absolute <= distance){
                distance = absolute;
                shortestDitanceItem = myArray[x];
            }
        }
    } else {
        shortestDitanceItem = myArray[0];
    }
    return shortestDitanceItem;
}

function orderArrayScan() {
    let tempScanArray = [];
    let divisionPoint = 0;
    let hasSmallerNumbers = false;
    let hasBiggersNumbers = false;
    tempScanArray.length = 0;
    tempScanArray = animationArray.slice();
    tempScanArray.sort(function(a, b) {
        return a - b;
    });
    for (let count = 0; count < tempScanArray.length; count ++){
        if (tempScanArray[count] >= myDisk.position) {
            hasBiggersNumbers = true;
        }
        if (tempScanArray[count] < myDisk.position) {
            hasSmallerNumbers = true;
        }
        if (tempScanArray[count] >= myDisk.position && divisionPoint == 0) {
            divisionPoint = tempScanArray.indexOf(tempScanArray[count]);
        }
    }
    let biggerNumbersArray = [];
    let smallerNumbersArray = [];

    if (hasBiggersNumbers && hasSmallerNumbers) {
        biggerNumbersArray = tempScanArray.slice(divisionPoint);
        smallerNumbersArray = tempScanArray.slice(0, divisionPoint);
        smallerNumbersArray.sort(function(a, b) {
            return b - a;
        });
        tempScanArray.length = 0;
        if (myDisk.direction == "up") {
            tempScanArray = biggerNumbersArray.concat(smallerNumbersArray);
        } else {
            tempScanArray = smallerNumbersArray.concat(biggerNumbersArray);
        }
    } else if (hasSmallerNumbers) {
        smallerNumbersArray = tempScanArray.slice();
        smallerNumbersArray.sort(function(a, b) {
            return b - a;
        });
        tempScanArray.length = 0;
        tempScanArray = smallerNumbersArray;
    } else {
        biggerNumbersArray = tempScanArray.slice();
        tempScanArray.length = 0;
        tempScanArray = biggerNumbersArray;
    }
    animationArray.length = 0;
    animationArray = tempScanArray.slice();
    tempScanArray.length = 0;
}

function insertDuringExecution() {
    let inputValue = document.getElementById("inputValue").value;
    if (!isNaN(inputValue) && inputValue != "" && Number(inputValue) < 100 && Number(inputValue) >= 0 && Number.isInteger(Number(inputValue))) {
        inputValue = Number(inputValue);
        if (running) {
            clearInterval(myVar);
            running = false;
            animationArray.push(inputValue);
            if (myDisk.algorithm == "sstf") {
                orderArrayShortestSeekTimeFirst();
            }
            if (myDisk.algorithm == "scan") {
                orderArrayScan();
            }
            nextValueY = animationArray[0];
            myDisk.numbers = animationArray;
            myDisk.nextPosition = nextValueY;
            myDisk.drawNumbers();
            myVar = setInterval(moveHead, animationSpeed);
            running = true;
        }
        let newValue = textArea.value;
        if (newValue == "") {
            newValue = inputValue
        } else {
            newValue += "\n" + inputValue;
        }
        document.getElementById("inputValue").value = "";
        textArea.value = newValue;
    } else {
        alert("Please enter one valid positive integer (0 - 99) per line and don't leave empty lines.");
    }
}

function myKeyPress(event) {
    if (event.keyCode == 13) {
        insertDuringExecution();
    }
}
