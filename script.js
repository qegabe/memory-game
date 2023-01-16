const gameContainer = document.getElementById("game");
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');
const scoreP = document.querySelector('#score');
const bestP = document.querySelector('#best');
let score = 0;

const COLORS = [];
//change this for more or less cards
const maxColors = 10;

//generate random colors
function addColors() {
    for (let i = 0; i < maxColors; i++) {
        const randRGB = randomRGB()
        COLORS.push(randRGB);
        COLORS.push(randRGB);
    }
}


function randomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

addColors()
let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    //newDiv.classList.add(color);
    newDiv.dataset.color = color;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

const flippedCards = [];

function handleCardClick(event) {
    if (flippedCards.length < 2) {
        event.target.style.backgroundColor = event.target.dataset.color;
        if (flippedCards[0] !== event.target) {
            flippedCards.push(event.target);
        }
        
        if (flippedCards.length === 2) checkMatching();
    }
  //console.log("you just clicked", event.target);
}

function checkMatching() {
    if (flippedCards[0].dataset.color === flippedCards[1].dataset.color) {
        flippedCards[0].removeEventListener('click', handleCardClick);
        flippedCards[1].removeEventListener('click', handleCardClick);
        flippedCards.length = 0;
    } else {
        setTimeout(function() {
            flippedCards[0].style.backgroundColor = '';
            flippedCards[1].style.backgroundColor = '';
            flippedCards.length = 0;
        }, 1000);
    }
    score++;
    scoreP.innerText = `Guesses: ${score}`;

    if (checkComplete()) {
        resetButton.removeAttribute('hidden');
        if (localStorage.bestScore !== undefined) {
            if (parseInt(localStorage.bestScore) > score) {
                localStorage.setItem('bestScore', score);
            }
            bestP.innerText = `Lowest Guesses: ${localStorage.getItem('bestScore')}`;
        } else {
            localStorage.setItem('bestScore', score);
            bestP.innerText = `Lowest Guesses: ${score}`;
        }
        bestP.removeAttribute('hidden');
    }
}

function checkComplete() {
    let isCompleted = true;
    for (const child of gameContainer.children) {
        if (child.dataset.color !== child.style.backgroundColor) {
            isCompleted = false;
            break;
        }
    }

    return isCompleted;
}

startButton.addEventListener('click', function() {
    createDivsForColors(shuffledColors);
    startButton.setAttribute('hidden', 'true');
});

resetButton.addEventListener('click', function() {
    gameContainer.innerHTML = '';
    COLORS.length = 0;
    addColors()
    shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    score = 0;
    scoreP.innerText = `Guesses: ${score}`;
    resetButton.setAttribute('hidden', 'true');
});

//display best score if it exists
if (localStorage.bestScore !== undefined) {
    bestP.innerText = `Lowest Guesses: ${localStorage.getItem('bestScore')}`;
    bestP.removeAttribute('hidden');
}