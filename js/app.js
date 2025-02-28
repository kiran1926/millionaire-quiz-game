/* Category  : Quiz Game : Who wants to be a Millionaire ?  

     Key Features of the Game : 

       1. Multiple Choice Questions: Players can select answers from four options.
       2. Timer: Players have 30 seconds to answer each question.
       3. Lifelines: Players can use lifelines such as 50:50, Ask the Audience, and Friendly Hint.
       4. Scoring System: Players earn points based on the number of questions answered correctly.
       5. Audio Effects: The game features sound effects for correct and wrong answers, as well as background music. */

//  ============================ 1. Initialize Game Data   ====================================

// constants :
let quiz = [];
let questionIndex = 0;
const hint = document.getElementById("hint-text");
const questionText = document.querySelector(".question-text");
const options = document.querySelectorAll(".option");
const nextQuestionBtn = document.querySelector(".next-question");
const startGameBtn = document.getElementById("startGameBtn");
const startThemeAudio = new Audio("../assets/startGameBtn.mp3");
const selectAnsAudio = new Audio("../assets/optionsId.mp3");
const correctAnswerAudio = new Audio("../assets/nextQuestionBtn.mp3");
const wrongAnsAudio = new Audio("../assets/wrongAns.mp3");
const hintAudio = new Audio("../assets/friendly-hint.mp3");
const fiftyFiftyAudio = new Audio("../assets/fifty-fifty.mp3");
const audiencePollAudio = new Audio("../assets/audience-poll.mp3");
const questionAudio = new Audio("../assets/question.mp3");
const restartThemeAudio = new Audio("../assets/startGameBtn.mp3");
const winnerAudio = new Audio("../assets/winner.mp3");
let playerName = "";
let playerScore = 0;
let correctAnswersCount = 0;
let fiftyFiftyUsed = false;
let friendlyHintUsed = false;
let audiencePollUsed = false;
nextQuestionBtn.disabled = true;

const progressChart = [
  {
    id: 1,
    price: 0,
  },
  {
    id: 2,
    price: 100,
  },
  {
    id: 3,
    price: 200,
  },
  {
    id: 4,
    price: 300,
  },
  {
    id: 5,
    price: 500,
  },
  {
    id: 6,
    price: 1000,
  },
  {
    id: 7,
    price: 2000,
  },
  {
    id: 8,
    price: 4000,
  },
  {
    id: 9,
    price: 8000,
  },
  {
    id: 10,
    price: 16000,
  },
  {
    id: 11,
    price: 32000,
  },
  {
    id: 12,
    price: 64000,
  },
  {
    id: 13,
    price: 125000,
  },
  {
    id: 14,
    price: 250000,
  },
  {
    id: 15,
    price: 500000,
  },
  {
    id: 16,
    price: 1000000,
  },
];

const scoreMap = {
  0: 100, // Question 1 - $0
  1: 200, // Question 2 - $100
  2: 300, // Question 3 - $200
  3: 500, // Question 4 - $300
  4: 1000, // Question 5 - $500
  5: 2000, // Question 6 - $1000
  6: 4000, // Question 7 - $2000
  7: 8000, // Question 8 - $4000
  8: 16000, // Question 9 - $8000
  9: 32000, // Question 10 - $16000
  10: 64000, // Question 11 - $32000
  11: 125000, // Question 12 - $64000
  12: 250000, // Question 13 - $125000
  13: 500000, // Question 14 - $250000
  14: 1000000, // Question 15 - $500000
};
//  ============================== json call ========================================

const loadQuiz = () => {
  return fetch("questions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      quiz = data;
    })
    .catch((error) => console.error("Failed to load questions: ", error));
};

// first show this when loads
window.onload = function () {
  showNameModal();
};

function showNameModal() {
  const modal = document.getElementById("gameEndModal");
  const nameSection = document.getElementById("nameSection");
  nameSection.style.display = "block";
  modal.style.display = "block";
}

// ============================= setting the volume  ========================================
startThemeAudio.volume = 0.07;
correctAnswerAudio.volume = 0.07;
wrongAnsAudio.volume = 0.07;
questionAudio.volume = 0.07;
fiftyFiftyAudio.volume = 0.07;
audiencePollAudio.volume = 0.07;
hintAudio.volume = 0.07;
restartThemeAudio.volume = 0.07;

//  ============================ 2. Function startGame()   ===================================

const startGame = () => {
  playerName = document.getElementById("playerName").value;
  localStorage.setItem("playerName", playerName);
  loadQuiz().then(() => {
    loadQuestion();
    startThemeAudio.play();
    showProgress(progressChart);
    setActiveProgressScore(questionIndex);
    closeModal();
  });
};

//  ============================  3. Load the question   ======================================

function loadQuestion() {
  if (questionIndex < quiz.length) {
    options.forEach((option) => {
      option.classList.remove("correct", "wrong", "flash-correct");
      option.style.pointerEvents = "auto"; // Enable clicking again
    });
    questionText.innerText = `Q ${questionIndex + 1}. \xa0\xa0\xa0 ${
      quiz[questionIndex].question
    } `;

    const optionLabels = ["A", "B", "C", "D"];
    options.forEach((option, index) => {
      option.innerHTML = `<span>${optionLabels[index]}.</span> \xa0\xa0\xa0 ${quiz[questionIndex].options[index]}`;
      option.setAttribute("data-answer", quiz[questionIndex].options[index]); // for catching only answer in data-answer
    });
    startTimer();
  } else {
    endGame();
  }
}

//  ============================   4. startTimer()  ===========================================

let timer;
function startTimer() {
  let timeLeft = 30;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(function () {
    document.getElementById("thirtySec").innerText = timeLeft;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      wrongAnsAudio.play();
      endGame();
    }
  }, 1000);
}

//  ============================   5. Answer Selection   ======================================

function checkAnswer(event) {
  startThemeAudio.pause();
  fiftyFiftyAudio.pause();
  audiencePollAudio.pause();
  hintAudio.pause();
  questionAudio.pause();
  const selectedOption = event.target;
  if (selectedOption.classList.contains("option")) {
    const selectedAnswer = selectedOption.getAttribute("data-answer");

    options.forEach((option) => (option.style.pointerEvents = "none")); // disable further click on other options
    if (selectedAnswer === quiz[questionIndex].answer) {
      selectedOption.classList.add("correct");
      //turn color green
      correctAnswerAudio.play();
      correctAnswersCount++;
      //update score
      playerScore = scoreMap[questionIndex];
      console.log(playerScore);
      clearInterval(timer);
      setActiveProgressScore(questionIndex);

      nextQuestionBtn.disabled = false;

      if (correctAnswersCount === quiz.length) {
        checkWinner();
      }
    } else {
      wrongAnsAudio.play();
      selectedOption.classList.add("wrong");

      options.forEach((option) => {
        if (option.getAttribute("data-answer") === quiz[questionIndex].answer) {
          option.classList.add("flash-correct");
        }
        clearInterval(timer);
        endGame();
      });
    }
  }
}
//  ============================ 6. lifelines() function   ======================================

// 1.fifty-fifty
function useFiftyFifty(event) {
  console.log(fiftyFiftyUsed);
  if (fiftyFiftyUsed) return;
  fiftyFiftyAudio.play();
  const correctAnswer = quiz[questionIndex].answer;
  let incorrectAnswers = [];
  options.forEach((option) => {
    if (option.getAttribute("data-answer") !== correctAnswer) {
      incorrectAnswers.push(option);
    }
  });
  let removeOptions = 0;
  while (removeOptions < 2 && incorrectAnswers.length > 0) {
    const randomIdx = Math.floor(Math.random() * incorrectAnswers.length);
    incorrectAnswers[randomIdx].innerText = "";
    incorrectAnswers[randomIdx].setAttribute("data-answer", "");
    incorrectAnswers.splice(randomIdx, 1);
    removeOptions++;
  }

  fiftyFiftyUsed = true;
  document.getElementById("fifty-fifty").disabled = true;
}

// 2. =================================   Audience poll  ===================================================

function useAudiencePoll(event) {
  if (audiencePollUsed) return;
  questionAudio.pause();
  audiencePollAudio.play();

  document.getElementById("audiencePollChart").style.display = "block";
  document.getElementById("pollResults").style.display = "block";

  const correctAnswer = quiz[questionIndex].answer;
  let polls = [];
  let totalPercent = 100;

  options.forEach((option) => {
    if (option.innerText.trim() === "") return;
    let percentage;
    if (option.getAttribute("data-answer") === correctAnswer) {
      percentage = Math.floor(Math.random() * 30) + 30; // correct answer from 30 to 60 percent possibility
    } else {
      percentage = Math.floor(Math.random() * 40); // incorrect from 0 to 40 percent
    }
    polls.push({ option: option.innerText, percentage: percentage });
    totalPercent -= percentage;
  });

  if (totalPercent > 0) {
    const randomIdx = Math.floor(Math.random() * polls.length);
    polls[randomIdx].percentage += totalPercent;
  }

  document.getElementById("pollResults").style.display = "block";

  //convert data to chart
  const labels = polls.map((item) => item.option);
  const data = polls.map((item) => item.percentage);

  generateAudiencePollChart(labels, data);

  audiencePollUsed = true;
  document.getElementById("audience-poll").disabled = true;
}

//  ========== generate bar chart  ========

function generateAudiencePollChart(labels, data) {
  const ctx = document.getElementById("audiencePollChart").getContext("2d");

  if (window.audienceChart) {
    window.audienceChart.destroy();
  }

  window.audienceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Audience Poll (%)",
          data: data,
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginZero: true,
          max: 100,
          title: {
            display: true,
            text: "percentage",
          },
        },
      },
    },
  });
}

// clear bar chart
function clearAudiencePollChart() {
  if (window.audienceChart) {
    window.audienceChart.destroy();
    window.audienceChart = null;
  }

  document.getElementById("audiencePollChart").style.display = "none";

  const pollList = document.getElementById("pollList");
  pollList.innerHTML = "";
  document.getElementById("pollResults").style.display = "none";
}

// ================================= phone a friend or friendlyHint()  ===============================

function useFriendlyHint(event) {
  if (friendlyHintUsed) return;
  hintAudio.play();
  hint.style.display = hint.style.display === "none" ? "block" : "none";
  render();
  friendlyHintUsed = true;
  document.getElementById("friendly-hint").disabled = true;
}

//  ============================ 9. Restart Game function  =====================================

function restart() {
  questionIndex = 0;
  fiftyFiftyUsed = false;
  friendlyHintUsed = false;
  audiencePollUsed = false;
  nextQuestionBtn.disabled = true;
  document.getElementById("audience-poll").disabled = false;
  document.getElementById("fifty-fifty").disabled = false;
  document.getElementById("friendly-hint").disabled = false;
  startGame();
  wrongAnsAudio.pause();
  showProgress(progressChart);
  setActiveProgressScore(questionIndex);
  clearAudiencePollChart();
}

//  ============================ progress set show  =========================================

const showProgress = (progressChart) => {
  let progress = document.querySelector(".progress");
  let progressData = "";

  progressChart = progressChart.sort((a, b) => b.price - a.price);

  progressChart.forEach((item, index) => {
    if (item.price === 1000 || item.price === 32000 || item.price === 1000000) {
      item.price = item.price.toLocaleString();
      progressData += `<div class= "progressinSafe"> $ ${item.price}</div>`;
    } else {
      item.price = item.price.toLocaleString();
      progressData += `<div class= "progressin"> $ ${item.price}</div>`;
    }
  });
  progress.innerHTML = `ScoreBoard <br> ${playerName} won : $ ${playerScore}  ${progressData}`;
  console.log(playerScore);
};
//  ============================ 6. updateScoreAndMoney function   ======================================

const setActiveProgressScore = (questionIndex) => {
  let currentQuestion = questionIndex + 1;
  let progress = document.querySelector(".progress");
  let progressSetData = progress.querySelectorAll("div");
  let progressDataLength = progressSetData.length;

  if (currentQuestion <= progressDataLength) {
    progressSetData.forEach((div) => div.classList.remove("active"));
    //active based on question
    progressSetData[progressDataLength - currentQuestion].classList.add(
      "active"
    );
  } else {
    console.log("Index out of bounds");
  }
};

//  ============================ 7. nextQuestion function  =====================================

const nextQuestion = (event) => {
  nextQuestionBtn.disabled = true;
  correctAnswerAudio.pause();
  questionAudio.play();
  clearAudiencePollChart();
  questionIndex++;
  showProgress(progressChart);
  setActiveProgressScore(questionIndex);

  if (questionIndex < quiz.length) {
    loadQuestion();
  } else {
    checkWinner();
  }
};

//  ============================ 8. checkWinner  ===============================================

const checkWinner = () => {
  if (questionIndex === quiz.length) {
    questionAudio.pause();
    winnerAudio.play();

    showModal(true);
    clearInterval(timer);
  }
};

//  ============================ 8. endGame()  ===============================================

function endGame() {
  questionAudio.pause();
  fiftyFiftyAudio.pause();
  audiencePollAudio.pause();
  hintAudio.pause();
  clearInterval(timer);
  showModal(false);
}

//  ============================ result message  =============================================

function showModal(isWinner) {
  const modal = document.getElementById("gameEndModal");
  const heading = document.getElementById("endGameHeading");
  const endMessage = document.getElementById("endGameMessage");
  const emoji = document.getElementById("emoji");

  const nameSection = document.getElementById("nameSection");

  nameSection.style.display = "none";
  modal.style.display = "none";

  if (isWinner) {
    emoji.textContent = "🏆";
    heading.textContent = "🎊🎊Congratulations!🎊🎊";
    endMessage.textContent = `You are a Millionaire! Your score is $ ${playerScore}`;
  } else {
    emoji.textContent = "👎👎";
    heading.textContent = "Game Over!";
    endMessage.textContent = "Better luck next time!";
  }
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("gameEndModal");
  modal.style.display = "none";
  winnerAudio.pause();
  wrongAnsAudio.pause();
}

function exitGame(event) {
  endGame();
}

//  ============================ 10. Event Listeners  ==============================

nextQuestionBtn.addEventListener("click", nextQuestion);
document.getElementById("startGameBtn").addEventListener("click", startGame);
document.getElementById("optionsId").addEventListener("click", checkAnswer);
document.getElementById("fifty-fifty").addEventListener("click", useFiftyFifty);
document
  .getElementById("audience-poll")
  .addEventListener("click", useAudiencePoll);
document
  .getElementById("friendly-hint")
  .addEventListener("click", useFriendlyHint);
document.getElementById("restartGame").addEventListener("click", restart);
document.getElementById("exitGame").addEventListener("click", exitGame);
document.getElementById("audiencePollChart").style.display = "block";
document.getElementById("gameRules").addEventListener("click", (evt) => {
  const rulesAudio = new Audio("../assets/rules.mp3");
  rulesAudio.play();
  rulesAudio.volume = 0.1;
});
//  ============================ 11. Render  =========================================

function render() {
  hint.textContent = `💡 Hint : ${quiz[questionIndex].hint}`;
}
