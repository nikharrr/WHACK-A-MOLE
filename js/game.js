const timer = document.querySelector(".timer");
const pointsDisplay = document.querySelector(".points");
const popUp = document.querySelector(".modal-overlay");
const finalScoreDisplay = document.getElementById("final-score");
const gameBoard = document.querySelector(".game-board"); // New selector

let timeLeft = 60;
let score = 0;
let gameActive = false;
let lastHole;
let stayTime;

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty') || 'easy'; // Default to easy
    console.log("Current Difficulty:",difficulty);

    createDifficulty(difficulty);
    gameActive = true;
    updateTimer();
    popUpRandomMole();
};

function createDifficulty(difficulty) {
    if(difficulty=='easy') {
        stayTime = 3000;
        holes = 9;
        gameBoard.style.gridTemplateColumns = "repeat(3, 2fr)";
    }else if(difficulty=='medium') {
        stayTime = 2000;
        holes = 12;
        gameBoard.style.gridTemplateColumns = "repeat(4, 2fr)";
    }else {
        stayTime = 1000;
        holes = 15;
        gameBoard.style.gridTemplateColumns = "repeat(5, 2fr)";
    }

    while(holes--){
        const hole = document.createElement("div");
        hole.classList.add("hole");
        gameBoard.appendChild(hole);
    }
}
// Handle clicks using Event Delegation
gameBoard.addEventListener("click",(e) => {
    // Check if the clicked element is a mole
    if (e.target.classList.contains("mole")) {
        score++;
        pointsDisplay.innerText = score;
        e.target.parentElement.innerHTML = ""; // Remove mole immediately on whack
    }

    // Check if the clicked element is a bomb
    if (e.target.classList.contains("bomb")) {
        endGame();
    }
});

function updateTimer() {
    const update = setInterval(() => {
        if (!gameActive) {
            clearInterval(update);
            return;
        }
        timeLeft--;
        timer.innerText = `00 : ${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(update);
            endGame();
        }
    },1000);
}

function getRandomHole() {
    const holes = document.querySelectorAll(".hole");
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) return getRandomHole();
    lastHole = hole;
    return hole;
}

function popUpRandomMole() {
    if (!gameActive) return;

    const hole = getRandomHole();
    let isBomb = Math.random() < 0.2; // 20% chance for a bomb
    let characterClass = isBomb ? "bomb" : "mole";

    // Inject character with 'active' class for the animation
    hole.innerHTML = `<div class="${characterClass} active"></div>`;

    // Stay up for a random duration
    setTimeout(() => {
        if (hole.innerHTML !== "") {
            hole.innerHTML = ""; // Clear hole if not whacked
        }
        if (gameActive) popUpRandomMole();
    },stayTime);
}

function endGame() {
    gameActive = false;
    popUp.style.display = "flex";
    if (finalScoreDisplay) {
        finalScoreDisplay.innerText = score;
    }
}