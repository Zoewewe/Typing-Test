const sentences = [
    "Computers process over 2.5 billion instructions per second.",
    "The first computer virus was created in 1983.",
    "The average computer contains over 1,000 components.",
    "The first electronic computer weighed over 27 tons.",
    "The world's first computer programmer was a woman."
];

let currentSentenceIndex = 0;
let currentLetterIndex = 0;
let startTime, endTime;
let testResults = [];

const typingText = document.getElementById("typing-text");
const typingInput = document.getElementById("typing-input");
const results = document.getElementById("results");
const restartButton = document.getElementById("restart-button");

// prevent user from deleting mistakes
typingInput.addEventListener("keydown", function (event) {
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow") || event.ctrlKey) {
        event.preventDefault();
    }
});

// prevent users from right clicking
typingInput.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});

function displayNextSentence() {
    currentLetterIndex = 0;
    typingInput.value = ""; // clears input box
    const sentence = sentences[currentSentenceIndex];
    typingText.innerHTML = sentence
        .split("")
        .map((char, index) => {
            return `<span id="char-${index}" class="sentence-char">${char}</span>`;
        })
        .join("");
}

function startTest() {
    currentSentenceIndex = 0;
    displayNextSentence();
    typingInput.focus();
    startTime = new Date();
}

function endTest() {
    endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    const typedText = typingInput.value.trim();
    const correctText = sentences[currentSentenceIndex].slice(0, typedText.length);
    let correctCount = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === correctText[i]) {
            correctCount++;
        }
    }
    const accuracy = (typedText.length === 0) ? 0 : (correctCount / typedText.length) * 100;
    const speed = Math.round((typedText.length / duration) * 60);

    testResults.push({ speed, accuracy });

    results.innerHTML += `
    <tr>
      <td>${currentSentenceIndex + 1}</td>
      <td>${speed} WPM</td>
      <td>${accuracy.toFixed(2)}%</td>
    </tr>
  `;

    currentSentenceIndex++;
    if (currentSentenceIndex < sentences.length) {
        displayNextSentence();
    } else {
        displayAverageResults();
        typingText.textContent = "Test completed!";
        typingInput.style.display = "none"; // removes the input box at the end
        restartButton.style.display = "block";
        restartButton.addEventListener("click", function () {
            window.location.reload();
        });

    }
}

function displayAverageResults() {
    const totalTests = testResults.length;
    const totalSpeed = testResults.reduce((acc, curr) => acc + curr.speed, 0);
    const averageSpeed = totalSpeed / totalTests;
    const totalAccuracy = testResults.reduce((acc, curr) => acc + curr.accuracy, 0);
    const averageAccuracy = totalAccuracy / totalTests;

    results.innerHTML += `
    <tr>
      <td>Average</td>
      <td>${averageSpeed.toFixed(2)} WPM</td>
      <td>${averageAccuracy.toFixed(2)}%</td>
    </tr>
  `;
}

typingInput.addEventListener("input", function (event) {
    const typedText = typingInput.value;
    const chars = document.getElementsByClassName("sentence-char");
    for (let i = 0; i < chars.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === sentences[currentSentenceIndex][i]) {
                chars[i].classList.remove("incorrect");
                chars[i].classList.add("correct");
            } else {
                chars[i].classList.remove("correct");
                chars[i].classList.add("incorrect");
            }
            if (i === typedText.length - 1) {
                chars[i].classList.add("typed");
            } else {
                chars[i].classList.remove("typed");
            }
        } else {
            chars[i].classList.remove("correct", "incorrect", "typed");
        }
    }

    if (typedText.length >= sentences[currentSentenceIndex].length) {
        endTest();
    }
});

startTest();