var array1 = [20, 80, 35, 60];
var array2 = [80, 55, 20, 41];
var array3 = [140, 75, 320, 280, 125];
var array4 = [50, 30, 40, 90, 50];
var animationArray = [];
var initialArray = [];
var fcfsArray = [];
var sjfArray = [];
var copyArray = [];
var roundRobinArray = [];
var rowId = 0;
var totalCount = 0;
var algorithm = "fcfs";
var quantumSize = 50;
var newQuantum = 50;
var quantumTimer = 50;
var maxId = 0;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var width = c.width;
var height = c.height;
var x0 = 10;
var y0 = 50;
var textPos0 = 54;
var chosenExample = 1;
var animationSpeed = 15;
var running = false;
var currentRunning = "fcfs";
var myDisplay = new Display();
var turnaroundTime = 0;
var turnAroundHtml = "";
var messageHtml = "";

function loadExample(value) {
    if(!running){
        if (value > 0){
            chosenExample = value;
            generateAllArrays();
        }
    }
}

window.onload = generateAllArrays;

function generateAllArrays() {
    initialArray.length = 0;
    fcfsArray.length = 0;
    sjfArray.length = 0;
    copyArray.length = 0;
    roundRobinArray.length = 0;
    if (chosenExample == 1) {
        initialArray = array1.slice();
    }
    if (chosenExample == 2) {
        initialArray = array2.slice();
    }
    if (chosenExample == 3) {
        initialArray = array3.slice();
    }
    if (chosenExample == 4) {
        initialArray = array4.slice();
    }
    maxId = initialArray.length -1;
    for (let x = 0; x < initialArray.length; x++) {
        fcfsArray.push(new Process(initialArray[x], x, x, true));
        sjfArray.push(new Process(initialArray[x], x, x, true));
        copyArray.push(new Process(initialArray[x], x, x, true));
    }
    sjfArray.sort(function(a,b){
        return a.size - b.size;
    });
    //splitting and generating round robin array.
    while (totalInArray(copyArray) > 0) {
        for (let t = 0; t <= maxId; t ++){
            if (copyArray[t].size > 0) {
                if (copyArray[t].size <= quantumSize) {
                    roundRobinArray.push(new Process(copyArray[t].size, copyArray[t].id, t, true));
                    copyArray[t].size -= copyArray[t].size;
                } else {
                    roundRobinArray.push(new Process(quantumSize, copyArray[t].id, t, false));
                    copyArray[t].size -= quantumSize;
                }
            }
        }
    }
    //updating all objects' information in each array.
    updateTotalTime(fcfsArray);
    updateOrder(sjfArray);
    updateTotalTime(sjfArray);
    updateOrder(roundRobinArray);
    updateTotalTime(roundRobinArray);
    displayArray();
}

function totalInArray(array){
    let total = 0;
    for (let x = 0; x < array.length; x++){
        total += array[x].size;
    }
    return total;
}

function updateOrder(array) {
    for (let x = 0; x < array.length; x ++) {
        array[x].order = x;
    }
}

function updateTotalTime(array) {
    let countSum = 0;
    for (let x = 0; x < array.length; x ++) {
        countSum += array[x].size;
        array[x].totalTime = countSum;
        array[x].startPosition = countSum - array[x].size;
        if(array[x].isLast){
            array[x].finishTime = countSum;
        }
        if (x == array.length - 1) {
            array[x].isEnd = true;
        }
    }
}

function Process(size, id, order, isLast) {
    this.size = size;
    this.id = id;
    this.order = order;
    this.isLast = isLast;
    this.totalTime = 0;
    this.finishTime = 0;
    this.startPosition = 0;
    this.displayed = 0;
    this.isEnd = false;
    this.move = function(value) {
        if ((this.displayed + value) <= this.size) {
            this.displayed += value;
            this.drawBox();
        }
    }
    this.drawBox = function() {
        ctx.fillStyle = this.colorChanger(this.id);
        ctx.fillRect(x0 + this.startPosition, y0-15, this.displayed, 30);
        if (isLast && this.displayed == this.size) {
            ctx.fillStyle = "#000000";
            ctx.save();
            ctx.translate(x0 + this.startPosition + this.displayed-5, y0 - 20);
            ctx.rotate(-55 * Math.PI/180);
            ctx.textBaseline="middle";
            ctx.fillText("P"+ this.id, 0, 0);
            ctx.restore();
            ctx.save();
            ctx.translate(x0 + this.startPosition + this.displayed, y0 + 20);
            ctx.rotate(-55 * Math.PI/180);
            ctx.textBaseline = "middle";
            ctx.textAlign = "end";
            ctx.fillText(this.totalTime, 0, 0);
            ctx.restore();
        }
    }
    this.colorChanger = function(number) {
        switch (number % 5) {
            case 0:
                return "#1E90FF";//dodger blue
                break;
            case 1:
                return "#FA8072";//salmon
                break;
            case 2:
                return "#DEB887";//burly wood
                break;
            case 3:
                return "#2E8B57";//sea green
                break;
            case 4:
                return "#008B8B";//darkcyan
                break;
            case 5:
                return "#20B2AA";//light sea green
                break;
            default:
                return "#FFFFE0"//light yellow
        }
    }
}

function displayArray() {
    let newValue = "<ul id='processList'>";
    newValue += "<li><span>Process</span><span>Total</span><span>Finished</span><span>Remaining</span><span>Finished at</span></li>";
    for (let count = 0; count < fcfsArray.length; count ++) {
        newValue += "<li id='pr"+fcfsArray[count].id+"'><span>P"+fcfsArray[count].id +"</span>";
        newValue += " <span>" + fcfsArray[count].size + "</span>";
        newValue += " <span id='counter"+fcfsArray[count].id+"'>0</span>";
        newValue += " <span id='remaining"+fcfsArray[count].id+"'>"+fcfsArray[count].size+"</span>";
        newValue += " <span id='done"+fcfsArray[count].id+"'></span></li>";
    }
    newValue += "</ul>";
    document.getElementById("processView").innerHTML = newValue;
}

function changeAlgorithm(NewAlgorithm) {
    algorithm = NewAlgorithm;
}

function Display() {
    this.drawRectangle = function () {
        ctx.clearRect(0, 0, width, height);
    };
    this.drawRectangle();
}

function callStartAnimation() {
    if (newQuantum != quantumSize) {//this means user changed quantum
        quantumSize = newQuantum;
        generateAllArrays();
    }
    quantumTimer = quantumSize;
    if (algorithm == "fcfs") {
        currentRunning = "fcfs";
        startAnimation(fcfsArray);
    } else if (algorithm == "sjf") {
        currentRunning = "sjf";
        startAnimation(sjfArray);
    } else {
        currentRunning = "roundRobin";
        startAnimation(roundRobinArray);
    }
}

function startAnimation(array) {
    if (!running) {
        displayArray();
        turnaroundTime = 0;
        messageHtml = "";
        turnAroundHtml = "Average Turnaround Time: (";
        document.getElementById("quatumSpent").innerHTML = "Left in Quantum: ";
        document.getElementById("turnaroundTimeHtml").innerHTML = "Average Turnaround Time: ";
        animationArray.length = 0;
        for (let count = 0; count < array.length; count ++) {
            animationArray.push(new Process(array[count].size, array[count].id, array[count].order, array[count].isLast));
        }
        updateOrder(animationArray);
        updateTotalTime(animationArray);
        myDisplay.drawRectangle();
        myVar = setInterval(function(){ moveGantt(animationArray) }, animationSpeed);
        running = true;
    } else {
        alert("Process running. Please wait or stop current process.");
    }
}

function changeQuantum(userQuantum) {
    if (userQuantum != "" && !isNaN(+userQuantum) && +userQuantum > 0 && Number.isInteger(+userQuantum)){
        newQuantum = +userQuantum;
    } else {
        alert("Please enter a positive integer for the Quantum");
    }
}

function stopAnimation() {
    if (running) {
        clearInterval(myVar);
        running = false;
        rowId = 0;
        totalCount = 0;
    }
}

function moveGantt(array) {
    let timeSpent = 0;
    let remaining = 0;
    let id = "";
    let id2 = "";
    let liId = "";
    let liHtml;
    if (totalCount < array[array.length-1].finishTime) {
        if (array[rowId].displayed < array[rowId].size){
            if (quantumTimer == 0) {
                quantumTimer = quantumSize;
            }
            array[rowId].move(1);
            totalCount ++;
            id = "counter"+array[rowId].id;
            timeSpent = +document.getElementById(id).innerHTML;
            timeSpent++;
            document.getElementById(id).innerHTML = timeSpent;
            id2 = "remaining"+array[rowId].id;
            remaining = +document.getElementById(id2).innerHTML;
            remaining --;
            quantumTimer --;
            document.getElementById(id2).innerHTML = remaining;
            if(array[rowId].isLast == true && array[rowId].displayed == array[rowId].size){
                turnaroundTime += array[rowId].totalTime;
                turnAroundHtml += array[rowId].totalTime.toString();
                if (totalCount == array[array.length-1].totalTime) {
                    turnAroundHtml += ") / " + (maxId +1);
                } else {
                    turnAroundHtml += " + ";
                }
                document.getElementById("done"+array[rowId].id).innerHTML = array[rowId].totalTime;
            }
        } else {
            rowId++;
        }
        document.getElementById("totalTimeSpent").innerHTML = "Total: " + totalCount;
        if (currentRunning == "roundRobin") {
            document.getElementById("quatumSpent").innerHTML = "Left in Quantum: " + quantumTimer;
        }
    } else {
        document.getElementById("quatumSpent").innerHTML = "Left in Quantum: ";
        turnaroundTime /= (maxId + 1);
        turnAroundHtml += " = " + turnaroundTime.toFixed(2);
        document.getElementById("turnaroundTimeHtml").innerHTML = turnAroundHtml;
        stopAnimation();
    }
}
