const historicalEvents = [
    { name: "First moon landing", date: "1969-07-20" },
    { name: "Fall of the Berlin Wall", date: "1989-11-09" },
    // Add more historical events
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateRandomDate(eventDate) {
    const days = Math.floor(Math.random() * 365) - 182;
    const newDate = new Date(eventDate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

const eventDescription = document.querySelector(".event-description");
const dateDisplayValue = document.querySelector(".date-display-value");
const btnBefore = document.querySelector(".btn-before");
const btnAfter = document.querySelector(".btn-after");
const scoreValue = document.querySelector(".score-value");
const startGameBtn = document.querySelector("#start-game");

let currentIndex = 0;
let currentEvent = null;
let currentDate = null;
let score = 0;

function startGame() {
    shuffle(historicalEvents);
    currentIndex = 0;
    showNextEvent();
}

function showNextEvent() {
    if (currentIndex < historicalEvents.length) {
        currentEvent = historicalEvents[currentIndex++];
        currentDate = generateRandomDate(currentEvent.date);
        eventDescription.textContent = currentEvent.name;
        dateDisplayValue.textContent = formatDate(currentDate);
    } else {
        alert("Game over! Your final score is: " + score);
        startGame();
    }
}

btnBefore.addEventListener("click", () => {
    const eventDate = new Date(currentEvent.date);
    if (eventDate < currentDate) {
        score++;
    } else {
        score = 0;
    }
    scoreValue.textContent = score;
    showNextEvent();
});

btnAfter.addEventListener("click", () => {
    const eventDate = new Date(currentEvent.date);
    if (eventDate > currentDate) {
        score++;
    } else {
        score = 0;
    }
    scoreValue.textContent = score;
    showNextEvent();
});

startGameBtn.addEventListener("click", startGame);
