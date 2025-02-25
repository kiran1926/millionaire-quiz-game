/* Category  : Quiz Game : Who wants to be a Millionaire ?  

     Key Features of the Game : 

       1. Multiple Choice Questions: Players can select answers from four options.
       2. Timer: Players have 30 seconds to answer each question.
       3. Lifelines: Players can use lifelines such as 50:50, Ask the Audience, and Call a Friend.
       4. Scoring System: Players earn points based on the number of questions answered correctly.
       5. Audio Effects: The game features sound effects for correct and wrong answers, as well as background music. */

//parts of the game :

//  ============================ 1. Initialize Game Data   ====================================

// 1. Initialize player data : name

const playerName = document.getElementById('name');

// 2. Money Ladder : array of numbers for each questionIndex upto top prize

const moneyChart = [
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
let questionIndex = 0;
let quiz = [];
//fetch questions from questions.json
fetch("questions.json")
    .then(response => response.json())
    .then (data => {
        quiz = data;
        console.log(quiz);
        startGame();
    })
    .catch(error =>console.error(error));

// generateSounds
let mainThemePlay = "";
let wrongPlay = "";
let correctPlay = "";
let callPlay = "";
let fifty50Play = "";
let audiencePlay = "";
let inGamePlay = "";

//selectors
let questionText = document.querySelector(".question-text");
let options = document.querySelectorAll(".option");
let nextQuestionBtn = document.querySelector(".next-question");

//  ============================ 2. Function startGame()   ===================================

function startGame(){
    loadQuestion();
    startTimer();
    // mainThemePlay.play();
};

//  ============================  3. Load the question   ======================================

/*  TODO:
    show available lifelines; 
*/
function loadQuestion() {
  if (questionIndex < quiz.length) {
    questionText.innerText = quiz[questionIndex].question;
    console.log(questionText);
    options.forEach((option, index) => {
      option.innerText = quiz[questionIndex].options[index];
      
    });
  }else {
    //end game and show result
    endGame();
  }
}
loadQuestion();

//  ============================   4. startTimer()  ===========================================

function startTimer(){
    let timeLeft = 30;
    const timer = setInterval(function(){
        document.getElementById('thirtySec').innerText = timeLeft;
        timeLeft-- ;
        if( timeLeft < 0) {
            clearInterval(timer);
            // wrongPlay.play();
            endGame();
        }
    }, 1000); //updates every second
}
function afterThirtySec() {
    console.log("time's up");
}
startTimer(afterThirtySec);

//  ============================   5. Answer Selection   ======================================

function checkAnswer(event) {
  const selectedOption = event.target;
  if (selectedOption.classList.contains("option")) {
    if (selectedOption.innerText === quiz[questionIndex].answer) {
    //   correctPlay.play(); //sound
      questionIndex++;
      loadQuestion();
    } else if (selectedOption.innerText !== quiz[questionIndex].answer) {
    //   wrongPlay.play();
      endGame();
    } // need to add lifeline logic - if chooses lifelines then call lifelines() function;
    //disable chosen lifeline;
  }
}
//  ============================ 6. lifelines() function   ======================================
/*
    1. useFiftyFifty();
    2. useAskAudience();
    3. usePhoneAFriend();
*/
let fiftyFiftyUsed = false;
let phoneAFriendUsed = false;
let audiencePollUsed = false;

// 1.fifty-fifty
function useFiftyFifty(event) {
   if(fiftyFiftyUsed) return alert ("Lifeline used");
   const correctAnswer = quiz[questionIndex].answer;
   let incorrectAnswers = [];
   options.forEach(option => {
    if(option.innerText !== correctAnswer){
        incorrectAnswers.push(option);
    }
   });
   let removeOptions = 0;
   while(removeOptions < 2 && incorrectAnswers.length > 0){
    const randomIdx = Math.floor(Math.random() * incorrectAnswers.length);
    incorrectAnswers[randomIdx].innerText = "";
    incorrectAnswers.splice(randomIdx, 1);
    removeOptions++ ;
   }
   //disable fifty after use
   fiftyFiftyUsed = true;
   document.getElementById('fiftyFifty').disabled = true;
}

// 2. Audience poll 

function useAudiencePoll (event) {
    if(audiencePollUsed) return alert("lifeline used");
    const correctAnswer = quiz[questionIndex].answer;
    let polls = [];
    let totalPercent = 100;

    options.forEach(option => {
        let percentage;
        if(option.innerText === correctAnswer){
         percentage = Math.floor(Math.random() * 30) + 30; // correct answer from 30 to 60 percent possibility
        } else {
            percentage = Math.floor(Math.random() * 40) ;  // incorrect from 0 to 40 percent
        }
        polls.push({option: option.innerText, percentage: percentage});
        totalPercent -= percentage ;
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
}

// phone a friend or friendlyHint()

//  ============================ 6. updateScoreAndMoney function   ======================================

/*
    function updateScoreAndMoney();
*/

//  ============================ 7. nextQuestion function  =====================================

/*
    function nextQuestion();
    INCREMENT currentQuestionIndex BY 1;
    IF currentQuestionIndex < LENGTH OF questions Then
        call loadQuestion();
        call startTimer();
    ELSE
        call endGame();
*/

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

//  ============================ 9. Restart Game function  =====================================

/*
    function restartGame();
    set everything to initial stage;
*/

//  ============================ 10. Event Listeners  =========================================

/*
    1. for answer
    2. for nextquestion
    3. for restart
    4. for lifelines - 3 buttons
    5. for ending game

*/
//event bubbling- adding on parent options
document.getElementById('optionsId').addEventListener('click', checkAnswer);
document.getElementById('fifty-fifty').addEventListener('click', useFiftyFifty);
document.getElementById('audience-poll').addEventListener('click', useAudiencePoll);
document.getElementById('friendly-hint').addEventListener('click', useFriendlyHint);
 //  ============================ 11. Event Handlers  =========================================
/*
     Event Handler for Answer Selection
     Event Handler for Next Button
     Event Handler for Lifelines
*/


//  ============================ 12. Advancing functionalies  ======================================