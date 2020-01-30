var myArray = [];
var myDisplay = document.getElementById("objectDiv");
var stack, description, btnAddLabel, btnRemoveLabel, viewClass, topLabel, bottomLabel;
var addedInput = document.getElementById("addInput");
var timeInterval, running = false;

window.onload = function() {
    defineBehaviour();
};

function hideShow(element) {
    let x = document.getElementById(element);
    if (x.className === "hide") {
        x.className = "show";
    } else {
        x.className = "hide";
    }
}

function defineBehaviour() {
    if (document.getElementById("stack").checked) {
        stack = true;
        description = "Stack";
        btnAddLabel = "Push";
        btnRemoveLabel = "Pop";
        viewClass = "showAsStack";
        topLabel = "&larr; Top";
        bottomLabel = "&larr; Bottom";
    }
    if (document.getElementById("queue").checked) {
        stack = false;
        description = "Queue";
        btnAddLabel = "Enqueue";
        btnRemoveLabel = "Dequeue";
        viewClass = "showAsQueue";
        topLabel = "&larr; Head";
        bottomLabel = "&larr; Tail";
    }
    if (document.getElementById("random").checked) {
        stack = Math.random() >= 0.5 ? true : false;
        description = "Item";
        btnAddLabel = "Add";
        btnRemoveLabel = "Remove";
        viewClass = "showAsMystery";
        topLabel = "";
        bottomLabel = "";
    }
    document.getElementById("btnAdd").innerHTML = btnAddLabel;
    document.getElementById("btnRemove").innerHTML = btnRemoveLabel;
    document.getElementById("objectDiv").className = viewClass;
    document.getElementById("arrayTopLabel").innerHTML = topLabel;
    document.getElementById("arrayBottomLabel").innerHTML = bottomLabel;
}

function changeBehaviour() {
    defineBehaviour();
    displayArray();
}

function generateRandomArray() {
    randomArray();
    displayArray();
}

function randomArray(){
    myArray.length = 0;
    for (let i = 0; i < 10; i++) {
        myArray.push(Math.floor((Math.random() * 100) + 1));
    }
}

function displayArray() {
    let arrayHtml = "<ol id='arrayDisplay'";
    if (stack) {
        arrayHtml += "reversed start='" + (myArray.length -1) + "'>";
        for (let x = myArray.length -1; x >= 0; x--) {
            arrayHtml += "<li><span class='arrayItems'>" + myArray[x] + "</span></li>";
        }
    } else {
        arrayHtml += "start='0'>";
        for (let y = 0; y < myArray.length; y++) {
            arrayHtml += "<li><span class='arrayItems'>" + myArray[y] + "</span></li>";
        }
    }
    arrayHtml += "</ol>";
    myDisplay.innerHTML = arrayHtml;
}

function myKeyPress(event) {
    if (event.keyCode == 13) {
        addToArray();
    }
}

function addToArray() {
    if (addedInput.value != "" && !isNaN(+addedInput.value) && Number.isInteger(+addedInput.value) && Number(addedInput.value) >= 0 && Number(addedInput.value) < 100) {
        if (myArray.length < 10) {
            myArray.push(Number(addedInput.value));
            addedInput.value = "";
        } else {
            alert(description + " is Full");
        }
    }  else {
        alert("Please enter a positive integer (0 - 99)!");
    }
    displayArray();
}

function removeFromArray() {
    let itemRemoved;
    if (myArray.length > 0) {
        if (myArray.length == 1) {
            clearInterval(timeInterval);
            running = false;
        }
        if (stack) {
            itemRemoved = myArray.pop();
        } else {
            itemRemoved = myArray.shift();
        }
        displayArray();
        document.getElementById("itemRemoved").innerHTML = itemRemoved;
    } else {
        alert(description + " is Empty");
        document.getElementById("itemRemoved").innerHTML = "";
    }
}

function animatedClear() {
    if (myArray.length > 0 && !running) {
        timeInterval = setInterval(removeFromArray, 500);
        running = true;
    }
}
