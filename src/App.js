import React, { useState, useEffect } from 'react';
import './App.css';

// constants defining the dimensions & properties of the game board, paddles, and ball
const BOARD_WIDTH = 722;
const BOARD_HEIGHT = 457;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 110;
const BALL_SIZE = 19;
const BALL_START_X = (BOARD_WIDTH / 2 - BALL_SIZE / 2);
const BALL_START_Y = (BOARD_HEIGHT / 2 - BALL_SIZE / 2);
var PADDLE_SPEED = 20;//variable PADDLE_SPEED allows us to either stop the paddles from moving while the game is paused
var BALL_SPEED = 5;
const PAUSE_TIME = 2500;// 1 second pause after scoring
const MAX_SCORE = 3;// max score to end the game
var loser = "";
var computerState = false; 


function App() {

  const [paddle1Y, setPaddle1Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [paddle2Y, setPaddle2Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(BALL_START_X);
  const [ballY, setBallY] = useState(BALL_START_Y);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [gameState, setGameState] = useState("pending");
  const [appName, setAppName] = useState("App");
  const [computerState, setComputerState] = useState(false); 

  useEffect(() => { 

    if (gameState != "running") {return};// don't run if game hasn't started

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setPaddle2Y(prevY => Math.max(prevY - PADDLE_SPEED, 0));
      } else if (e.key === 'ArrowDown') {
        setPaddle2Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
      }  else if (!computerState){ 
        if (e.key === 'w') {
          setPaddle1Y(prevY => Math.max(prevY - PADDLE_SPEED, 0));
        } else if (e.key === 's') {
          setPaddle1Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
        }  
      } 
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, [gameState, computerState]);

  useEffect(() => {
   if (gameState != "running") {return};

    if (computerState){
      if (ballY < (paddle2Y + PADDLE_HEIGHT/ 2)){
        setTimeout(setPaddle1Y(prevY => Math.max(prevY - PADDLE_SPEED, 0)), 100)
      } else if (ballY > (paddle2Y + PADDLE_HEIGHT/2)){
        setTimeout(setPaddle1Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT)), 100)
      }      
    }
 
    const moveBall = setInterval(() => {
        const newBallX = ballX + ballSpeedX;
        const  newBallY = ballY + ballSpeedY;

        // check to make sure the ball is in bounds
        if (newBallY <= 0 || newBallY >= BOARD_HEIGHT - BALL_SIZE) {
            setBallSpeedY(prevSpeedY => -prevSpeedY);
        }

        // handles scoring and pausing after scoring
        if (newBallX <= 0 && (gameState == "running")) { // Add gameState == "running" check
            
          setScore2(prevScore => prevScore + 1);
            if (score2 + 1 === MAX_SCORE) {
              gameOver();
            } else {
                player2Scored();
            }

        } else if (newBallX >= BOARD_WIDTH - BALL_SIZE && (gameState == "running")) { // Add gameState == "running" check
          
          setScore1(prevScore => prevScore + 1);
          if (score1 + 1 === MAX_SCORE) {
              
            gameOver();

          } else {
              
            player1Scored();

          }
        
        } else if (
            (newBallX <= PADDLE_WIDTH &&
                newBallY + BALL_SIZE >= paddle1Y &&
                newBallY <= paddle1Y + PADDLE_HEIGHT) ||
            (newBallX + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH &&
                newBallY + BALL_SIZE >= paddle2Y &&
                newBallY <= paddle2Y + PADDLE_HEIGHT)
        ) {
            
          setBallSpeedX(prevSpeedX => -prevSpeedX);
          setBallSpeedX(prevSpeedX => prevSpeedX * 1.1);
          setBallSpeedY(prevSpeedY => prevSpeedY * 1.1);
          PADDLE_SPEED = PADDLE_SPEED * 1.1; 

        }
    
        setBallX(newBallX);
        setBallY(newBallY);       

  }, 20);

  return () => clearInterval(moveBall); 
  
}, [gameState, ballX, ballY, paddle1Y, paddle2Y, ballSpeedX, ballSpeedY, score1, score2, computerState]);

  function startGame() {
    // Start the game when the start button is clicked
    setGameState("running");
  }

  function resetBall() {

    setBallX(BALL_START_X);
    setBallY(BALL_START_Y);
    setBallSpeedX(BALL_SPEED);
    setBallSpeedY(BALL_SPEED);
    PADDLE_SPEED = 20;

  }

  function player1Scored(){    

    setGameState("player-1-scored");
    setTimeout(function () {
      resetBall();
      setGameState("running");
    }, PAUSE_TIME);

  }

  function player2Scored() {

    setGameState("player-2-scored");
    setTimeout(function () {
      resetBall();
      setGameState("running");
    }, PAUSE_TIME);

  }

  function pause() {

    if (gameState != "paused"){
      PADDLE_SPEED = 0;
      setGameState("paused");
    } else {
      PADDLE_SPEED = 20;
      setGameState("running");
    }

  }

  function resetGame() {
    
    // resets all components
    setGameState("pending");
    setScore1(0);
    setScore2(0);
    resetBall();
    setPaddle1Y(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setPaddle2Y(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    PADDLE_SPEED = 20;

  };


  function gameOver(){

    setGameState("over");
    resetBall();
    if (computerState){

      if(score1 > score2){
        loser = "Player 1";
      } else if (score1 < score2){
        loser = "Computer"
      }

    } else if (!computerState) {

      if(score1 > score2){
        loser = "Player 1";
      } else if (score1 < score2){
        loser = "Player 2"
      }

    }
  }

  function changeBackground(){

    if(appName == "App"){
      setAppName("App2");
    } else if(appName == "App2"){
      setAppName("App3");
    }
    else if (appName == "App3") {
      setAppName("App4");
    }
    else if (appName == "App4") {
      setAppName("App5");
    }
    else {
      setAppName("App");
    }

  }

  function changeGameAI(){

    if(computerState){

      setComputerState(false);  
      resetGame();

    } else if (!computerState){

      setComputerState(true); 
      resetGame(); 
      
    }

  }

  // array of funny quotes for the loser
  const funnyQuotes = [
    `"Looks like ${loser} needs more practice!"`,
    `"Better luck next time, ${loser}!"`,
    `"Is ${loser} even trying? 😜"`,
    `"It's okay ${loser}, losing builds character!"`,
    `"Don't worry ${loser}, it's just a game!"`, 
    `"Looks like ${loser} should stick to knitting!"`,
    `"Did ${loser} mistake this for a nap?"`,
    `"Keep calm, ${loser}, it's not the end of the world... just the game."`,
    `"Quick, someone give ${loser} a consolation cookie!"`,
    `"You know ${loser}, they say practice makes... less terrible?"`,
    `"Did ${loser} forget to turn on their game mode?"`,
    `"Looks like ${loser} is having a bad hair day... in the game."`,
    `"If at first you don't succeed, blame lag like ${loser} does."`,
    `"Is ${loser} trying to set a record for most losses?"`,
  ];

  // randomly select a funny quote for the loser
  const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

  // renders the game components and scoreboard

  return (
    <div className= {appName}>

      <div className="all-elements">

        <div className="title">
          PONG: Remastered
        </div>

        <p></p>
        <p></p>

        <div className="scoreboard">
            <div>SCORE</div>
            <div>{score1} : {score2}</div>
        </div>

        <p></p>

        <div className="board">
          <div className="paddle" style={{ top: paddle1Y, left: 0 }} />
          <div className="paddle" style={{ top: paddle2Y, right: 0 }} />
          <div className="ball" style={{ top: ballY, left: ballX }} />
        </div>

          <div className="output-print">
              {(gameState == "running") && <div>‎ </div>}
              {(gameState == "pending")&& <div>Click on "Start Game" to Start</div>}
              {(gameState == "paused") && <div>Game is Paused</div>}
              {(gameState == "player-2-scored") && <div>Player 1 Scored!</div>}
              {((gameState == "player-1-scored") && !computerState) && <div>Player 2 Scored!</div>}
              {((gameState == "player-1-scored") && computerState) && <div>The Computer Scored!</div>}
              {(gameState == "over") && <div>Game Over! {loser} is the loser! </div>}
              {(gameState == "over") && <div>{randomQuote}</div>}
          </div>

        <div className="vertical-elements">
        
        {(gameState == "pending") && (
          <button className="custom" onClick={startGame}>
            Start Game
          </button>
        )}
  
        {((gameState == "paused") && ((gameState != "player-1-scored") || (gameState == "player-2-scored"))) &&  (
          <button className="custom" onClick={pause}>
            Resume
          </button>
        )}
        
        {(gameState == "running") && (
          <button className="custom" onClick={pause}>
            Pause
          </button>
        )}
  
        {(((gameState == "paused") || (gameState == "over")) && ((gameState != "player-1-scored") || (gameState == "player-2-scored"))) && (
          <button className="custom" onClick={resetGame}>
            Restart
          </button>
        )}
        
        {(!computerState && ((gameState != "player-1-scored") && (gameState != "player-2-scored")))&&(
          <button className="custom" onClick={changeGameAI}>
            Player vs. AI
          </button>
        )}

        {(computerState && ((gameState != "player-1-scored") && (gameState != "player-2-scored")))&&(
          <button className="custom" onClick={changeGameAI}>
            Player vs. Player
          </button>
        )}

          {((gameState == "paused") || (gameState == "pending") || (gameState == "over")) && (
            <button className= "custom" onClick={changeBackground}>
              Change Background
            </button>
          )}
          
         
        </div>
      </div> 
    </div>
  );
}

export default App;
