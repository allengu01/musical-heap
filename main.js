import {Heap} from "./heap.js";

const arrayContainer = document.querySelector(".array-visual");
const insertInput = document.getElementById("insert-input");
const insertButton = document.getElementById("insert-button");
const insertError = document.getElementById("insert-error");
const removeButton = document.getElementById("remove-button");
const removeError = document.getElementById("remove-error");

var audioCtx = new (window.AudioContext || window.webkitAudioContext);
var canvas = document.getElementById('heap-canvas');
var canvasContainer = document.getElementById('canvas-container');
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight - 100;
var canvasCtx = canvas.getContext('2d');
canvasCtx.font = '14px sans-serif';
canvasCtx.textAlign = 'center';
canvasCtx.textBaseline = 'middle';
canvasCtx.lineWidth = 2;
var heap = new Heap();

const setupArrayVisual = () => {
    arrayContainer.innerHTML = '';
    for (var i = 1; i <= heap.size(); i++) {
        var arrayCell = document.createElement("div");
        arrayCell.classList.add("array-cell");
        arrayCell.id = `cell-${i}`;
        arrayCell.innerHTML = `${heap.get(i)}`;
        arrayContainer.appendChild(arrayCell);
    }
}

const validateInsertAction = () => {
    const MIN_VAL = -100, MAX_VAL = 100;
    if (insertInput.value === "") {
        return "Please input a value.";
    }
    else {
        const insertValue = parseInt(insertInput.value);
        if (MIN_VAL <= insertValue && insertValue <= MAX_VAL) {
            return "";
        }
        else {
            return `Value must be between ${MIN_VAL} and ${MAX_VAL}.`
        }
    }
}

const setupInsertButton = () => {
    insertButton.addEventListener('click', (e) => {
        const validation = validateInsertAction();
        if (validation === "") {
            heap.insert(parseInt(insertInput.value), animateArrayStep);
            insertError.innerHTML = "";
            insertInput.value = "";
        }
        else {
            insertError.innerHTML = validation;
        }
    });
}

const validateRemoveAction = () => {
    if (heap.size() > 0) {
        return "";
    }
    else {
        return "No elements in heap."
    }
}

const setupRemoveButton = () => {
    removeButton.addEventListener('click', (e) => {
        const validation = validateRemoveAction();
        if (validation === "") {
            heap.remove(animateArrayStep);
            removeError.innerHTML = "";
        }
        else {
            removeError.innerHTML = validation;
        }
    });
}

const setup = () => {
    setupArrayVisual();
    setupInsertButton();
    setupRemoveButton();
}

const playNote = (frequency) => {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    var gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    var now = audioCtx.currentTime;
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    oscillator.start(now);
    oscillator.stop(now + 1.5);
}

const drawEdge = (x1, y1, x2, y2) => {
    const angle = Math.atan2(y1 - y2, x2- x1);
    const xDel = 25 * Math.cos(angle), yDel = 25 * Math.sin(angle);
    canvasCtx.beginPath();
    canvasCtx.moveTo(x1 + xDel, y1 - yDel);
    canvasCtx.lineTo(x2 - xDel, y2 + yDel);
    canvasCtx.stroke();
}

const drawNode = (index, indicatorIndex, x, y, xSpacing, ySpacing=80) => {
    if (index === indicatorIndex) {
        canvasCtx.fillStyle = 'coral';
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 25, 0, 2 * Math.PI);
        canvasCtx.fill();
        canvasCtx.fillStyle = 'black';
    }
    
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, 25, 0, 2 * Math.PI);
    canvasCtx.stroke();
    canvasCtx.fillText(`${heap.get(index)}`, x, y);

    const leftChildIndex = 2 * index, rightChildIndex = 2 * index + 1;
    if (heap.get(leftChildIndex) !== undefined) {
        drawNode(leftChildIndex, indicatorIndex, x - xSpacing, y + ySpacing, xSpacing / 2);
        drawEdge(x, y, x - xSpacing, y + ySpacing);
    }
    if (heap.get(rightChildIndex) !== undefined) {
        drawNode(rightChildIndex, indicatorIndex, x + xSpacing, y + ySpacing, xSpacing / 2);
        drawEdge(x, y, x + xSpacing, y + ySpacing);
    }
}

const drawHeap = (indicatorIndex) => {
    if (heap.size() === 0) {
        return;
    }
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const numLevels = Math.floor(Math.log2(heap.size()));
    const rootX = canvas.width / 2;
    const rootY = canvas.height / 2 - numLevels / 2 * 80;
    drawNode(1, indicatorIndex, rootX, rootY, 160);
}

const animateArrayStep = (index, callback) => {
    setupArrayVisual();
    drawHeap(index);
    const cell = document.getElementById(`cell-${index}`);
    setTimeout(() => {
        if (cell) {
        cell.classList.add("touched");
        playNote(440 * Math.pow(2, (index - 1) / 12));
    }}, 0);
    setTimeout(() => {
        if (cell) {
            cell.classList.remove("touched");
        }
    }, 600);
    setTimeout(callback, 1000);
}

setup();