import {Heap} from "./heap.js";

const arrayContainer = document.querySelector(".array-visual");
const insertInput = document.getElementById("insert-input");
const insertButton = document.getElementById("insert-button");
const insertError = document.getElementById("insert-error");

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
            insertError.classList.add("hidden");
            insertInput.value = "";
        }
        else {
            insertError.innerHTML = validation;
            insertError.classList.remove("hidden");
        }
    });

}

const setup = () => {
    setupArrayVisual();
    setupInsertButton();
}

const animateArrayStep = (index, callback) => {
    setupArrayVisual();
    const cell = document.getElementById(`cell-${index}`);
    cell.classList.add("touched");
    setTimeout(callback, 1000);
    setTimeout(() => {
        cell.classList.remove("touched");
    }, 1000);
}

setup();