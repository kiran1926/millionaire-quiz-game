/* Category  : Quiz Game : Who wants to be a Millionaire ?  

     Key Features of the Game : 

       1. Multiple Choice Questions: Players can select answers from four options.
       2. Timer: Players have 30 seconds to answer each question.
       3. Lifelines: Players can use lifelines such as 50:50, Ask the Audience, and Call a Friend.
       4. Scoring System: Players earn points based on the number of questions answered correctly.
       5. Audio Effects: The game features sound effects for correct and wrong answers, as well as background music. */

//parts of the game :

//  ============================ 1. Initialize Game Data   ====================================

// 1. Initialize player data : name, currentQuestionIndex, score, moneyEarned, lifelines

// 2. Money Ladder : array of numbers for each questionIndex upto top prize

// 3. create a list of questions :

/* question : "statement";
    answers : ["4 options of possible answers" ] ;
    correct answer : Index of correct answer ; 
*/

//  ============================ 2. Function startGame()   ===================================

/* FUNCTION startGame()
    PLAY backgroundMusic;
    CALL loadQuestion();
    CALL startTimer();
*/

//  ============================  3. Load the question   ======================================

/* 
    loadQuestion();
    display currentQuestion;
    display answer options;
    reset timer to 30sec;
    show available lifelines; 
*/

//  ============================   4. startTimer()  ===========================================

/*
    set to 30sec;
    loop every 1 sec ;
    decrement by 1;
    display updated time;
    if timer is 0 then call timesUp() function;
*/

//  ============================   5. Answer Selection   ======================================

/*
    function chooseAnswer(answerIdx);
    check if selected answer index is equal to correct answer index, return true, green color;
    if not equal return false, red color, game over, reset game;
    if chooses lifelines then call lifelines() function;
    disable chosen lifeline;
*/

//  ============================ 6. lifelines() function   ======================================

/*
    1. useFiftyFifty();
    2. useAskAudience();
    3. usePhoneAFriend();
*/
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
*/

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

 //  ============================ 11. Event Handlers  =========================================
/*
     Event Handler for Answer Selection
     Event Handler for Next Button
     Event Handler for Restart Button
     Event Handler for Lifelines
*/


//  ============================ 12. Advancing functionalies  ======================================