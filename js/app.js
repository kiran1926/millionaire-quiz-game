/* Category  : Quiz Game : Who wants to be a Millionaire ?  

     Key Features of the Game : 

       1. Multiple Choice Questions: Players can select answers from four options.
       2. Timer: Players have 30 seconds to answer each question.
       3. Lifelines: Players can use lifelines such as 50:50, Ask the Audience, and Call a Friend.
       4. Scoring System: Players earn points based on the number of questions answered correctly.
       5. Audio Effects: The game features sound effects for correct and wrong answers, as well as background music. */
//  ============================ 1. Initialize Game Data   ====================================
// constants : 
const hint = document.getElementById('hint-text');
// generateSounds
let mainThemePlay = "";
let wrongPlay = "";
let correctPlay = "";
let callPlay = "";
let fifty50Play = "";
let audiencePlay = "";
let inGamePlay = "";

//selectors
const questionText = document.querySelector(".question-text");
const options = document.querySelectorAll(".option");
const nextQuestionBtn = document.querySelector(".next-question");

// 1. Initialize player data : name

const playerName = document.getElementById('name');

// 2. Money Ladder : array of numbers for each questionIndex upto top prize

const progressChart = [
    {
        id: 1,
        price: 0,
    },
    {
        id: 2,
        price: 100
    },
    {
        id: 3,
        price: 200
    },
    {
        id: 4,
        price: 300
    },
    {
        id: 5,
        price: 500
    },
    {
        id: 6,
        price: 1000
    },
    {
        id: 7,
        price: 2000
    },
    {
        id: 8,
        price: 4000
    },
    {
        id: 9,
        price: 8000
    },
    {
        id: 10,
        price: 16000
    },
    {
        id: 11,
        price: 32000
    },
    {
        id: 12,
        price: 64000
    },
    {
        id: 13,
        price: 125000
    },
    {
        id: 14,
        price: 250000
    },
    {
        id: 15,
        price: 500000
    },
    {
        id: 16,
        price: 1000000
    }

]

// 3. create a list of questions :
let quiz = [];
let questionIndex = 0;
let fiftyFiftyUsed = false;
let friendlyHintUsed = false;
let audiencePollUsed = false;
nextQuestionBtn.disabled = true;
//  ============================== json call ========================================

const loadQuiz = () => {
  return fetch("questions.json")
  .then(response => {
    if(!response.ok) {
        throw new Error (`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
    .then(data => {
        quiz = data;
    })
    .catch(error => console.error("Failed to load questions: ", error));
}

//  ============================ 2. Function startGame()   ===================================

const startGame = () => {
    loadQuiz().then(() => {
        loadQuestion();
        showProgress(progressChart);
        setActiveProgressScore(questionIndex);
    });
    // mainThemePlay.play();
};
startGame();

//  ============================  3. Load the question   ======================================

function loadQuestion() {
    if (questionIndex < quiz.length) {
      questionText.innerText = `Q ${questionIndex + 1}. \xa0\xa0\xa0 ${quiz[questionIndex].question} `;
      
      const optionLabels = ['A', 'B', 'C', 'D'];
      options.forEach((option, index) => {
        option.innerHTML = `<span>${optionLabels[index]}.</span> \xa0\xa0\xa0 ${quiz[questionIndex].options[index]}`;
        option.setAttribute("data-answer", quiz[questionIndex].options[index]); // for catching only answer in data-answer
      });
      startTimer();
    }else {
      //end game and show result
      endGame();
    }
  }

//  ============================   4. startTimer()  ===========================================

let timer;
function startTimer(){
    let timeLeft = 30;
    //clear previous timer if exists
    if(timer){
        clearInterval(timer);
    }
    timer = setInterval(function(){
        document.getElementById('thirtySec').innerText = timeLeft;
        timeLeft-- ;
        if( timeLeft < 0) {
            clearInterval(timer);
            // wrongPlay.play();
            endGame();
        }
    }, 1000); //updates every second
}

//  ============================   5. Answer Selection   ======================================

function checkAnswer(event) {
    const selectedOption = event.target;
    if (selectedOption.classList.contains("option")) {
      const selecetedAnswer = selectedOption.getAttribute("data-answer");
      
      options.forEach(option => option.style.pointerEvents = "none"); // disable further click on other options
      if (selecetedAnswer === quiz[questionIndex].answer) {

        selectedOption.classList.add("correct"); //turn color green
      //   correctPlay.play(); //sound
        clearInterval(timer);
        setActiveProgressScore(questionIndex);
        // nextQuestion();
        nextQuestionBtn.disabled = false;
        // questionIndex++;
        // loadQuestion();
        
      } else {
      //   wrongPlay.play();
      selectedOption.classList.add("wrong"); // turns red
        clearInterval(timer);
        endGame();
      
          // Flash the correct answer
          options.forEach(option => {
            if (option.getAttribute("data-answer") === quiz[questionIndex].answer) {
                option.classList.add("flash-correct");
            }
        });
      }
    }
  }

//  ============================ 6. lifelines() function   ======================================
/*
    1. useFiftyFifty();
    2. useAskAudience();
    3. usePhoneAFriend();
*/
// 1.fifty-fifty
function useFiftyFifty(event) {
   if(fiftyFiftyUsed) return alert ("Lifeline used");
   const correctAnswer = quiz[questionIndex].answer;
   let incorrectAnswers = [];
   options.forEach(option => {
    if(option.getAttribute("data-answer") !== correctAnswer){
        incorrectAnswers.push(option);
    }
   });
   let removeOptions = 0;
   while(removeOptions < 2 && incorrectAnswers.length > 0){
    const randomIdx = Math.floor(Math.random() * incorrectAnswers.length);
    incorrectAnswers[randomIdx].innerText = "";
    incorrectAnswers[randomIdx].setAttribute("data-answer", "");
    incorrectAnswers.splice(randomIdx, 1);
    removeOptions++ ;
   }
   //disable fifty after use
   fiftyFiftyUsed = true;
   document.getElementById('fifty-fifty').disabled = true;
}

// 2. =================================   Audience poll  ===================================================

function useAudiencePoll (event) {
    if(audiencePollUsed) return alert("lifeline used");
    const correctAnswer = quiz[questionIndex].answer;
    let polls = [];
    let totalPercent = 100;

    options.forEach(option => {
        if(option.innerText.trim() === "") return;
        let percentage;
        if(option.getAttribute("data-answer") === correctAnswer){
         percentage = Math.floor(Math.random() * 30) + 30; // correct answer from 30 to 60 percent possibility
        } else {
            percentage = Math.floor(Math.random() * 40) ;  // incorrect from 0 to 40 percent
        }
        polls.push({option: option.innerText, percentage: percentage});
        totalPercent -= percentage;
    });
    //adjust percentages to sum up 100%
    if(totalPercent > 0){
        const randomIdx = Math.floor(Math.random() * polls.length);
        polls[randomIdx].percentage += totalPercent;
    }
    //display poll results
    const pollList = document.getElementById('pollList');
    pollList.innerText = "";
    polls.forEach(result => {
        const listItem = document.createElement('li');
        listItem.innerText = `${result.option} : ${result.percentage} %`;
        pollList.appendChild(listItem);
    });
    document.getElementById('pollResults').style.display = "block";

    audiencePollUsed = true;
    document.getElementById('audience-poll').disabled = true;
}

// ================================= phone a friend or friendlyHint()  ===============================

function useFriendlyHint (event) {
    if(friendlyHintUsed) return alert("lifeline used");
    hint.style.display = hint.style.display === "none" ? 'block' : 'none';
    render();
   friendlyHintUsed = true;
    document.getElementById('friendly-hint').disabled = true;
}

//  ============================ 9. Restart Game function  =====================================

function restart(){
    questionIndex = 0;
    fiftyFiftyUsed = false;
    friendlyHintUsed = false;
    audiencePollUsed = false;
    nextQuestionBtn.disabled = true;
    // loadQuestion();
    startGame();
    //document.getElementById('restart').style.display = 'none';
}
//  ============================ progress set show  =========================================

const showProgress = (progressChart) => {
    let progress = document.querySelector(".progress");
    let progressData = "";

    progressChart =progressChart.sort((a, b) => b.price - a.price);

    progressChart.forEach((item, index) => {
        if(item.price === 1000 || item.price === 32000 || item.price === 1000000){
            
            item.price = item.price.toLocaleString();
            progressData += `<div class= "progressinSafe"> $ ${item.price}</div>` ;

        } else {
            item.price = item.price.toLocaleString();
            progressData += `<div class= "progressin"> $ ${item.price}</div>` ;
        }        
    });
    progress.innerHTML = progressData;
}
//  ============================ 6. updateScoreAndMoney function   ======================================

//populate progress section
// const populateProgressSection = () => {
//     const questionProgressMap = progressChart.map((price, index) => ({
//         questionNumber: index,
//         questionAnsweredCorrectly: false,
//         price,
//       }));
// }

const setActiveProgressScore = (questionIndex) => {
    let currentQuestion = questionIndex + 1;
    let progress = document.querySelector(".progress");
    let progressSetData = progress.querySelectorAll("div");
    let progressDataLength = progressSetData.length;

    // Ensure the index is within the valid range
    if (currentQuestion < progressDataLength) {
        // Remove the active class from all elements
        progressSetData.forEach(div => div.classList.remove("active"));
        
        // Set the active class based on the question index
        progressSetData[progressDataLength - currentQuestion].classList.add("active");
    } else {
        console.log("Index out of bounds");
    }
};

//  ============================ 7. nextQuestion function  =====================================

const nextQuestion = (event) => {
    nextQuestionBtn.disabled = true; 
    questionIndex++;
    setActiveProgressScore(questionIndex);
    if (questionIndex < quiz.length) {
        loadQuestion(); 
        // startTimer();    
    } else {
        endGame();
    }
}
// Call nextQuestion() to move through the questions

//  ============================ 8. endGame()  ===============================================
/*
    function endGame()
    STOP backgroundMusic
    DISPLAY message "completed"
    DISPLAY score
    PLAY gameEndSound
    DISPLAY restart 
*/function endGame(){
 console.log("game over!");
};
//  ============================ 10. Event Listeners  =========================================

/*
    1. for answer
    2. for nextquestion
    3. for restart
    4. for lifelines - 3 buttons
    5. for ending game
*/
nextQuestionBtn.addEventListener("click", nextQuestion);
//event bubbling- adding on parent options
document.getElementById('optionsId').addEventListener('click', (event) => {
    console.log(event.target); // Check if you're getting the correct clicked element
    checkAnswer(event);
});
document.getElementById('fifty-fifty').addEventListener('click', useFiftyFifty);
document.getElementById('audience-poll').addEventListener('click', useAudiencePoll);
document.getElementById('friendly-hint').addEventListener('click', useFriendlyHint);
//document.getElementById('restart').addEventListener('click', restartGame);
 //  ============================ 11. Render  =========================================

function render (){
        hint.textContent =  `💡 Hint : ${quiz[questionIndex].hint}`;
}
