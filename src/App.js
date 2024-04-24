import React, { useState, useEffect } from 'react';
import './App.css';

// constants defining the dimensions & properties of the game board, paddles, and ball
const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 20;
const BALL_SPEED = 3;
const PAUSE_TIME = 1000; // 1 second pause after scoring

function App() {
  const [paddle1Y, setPaddle1Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [paddle2Y, setPaddle2Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(BOARD_WIDTH / 2 - BALL_SIZE / 2);
  const [ballY, setBallY] = useState(BOARD_HEIGHT / 2 - BALL_SIZE / 2);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // handles keyboard input for paddle movement 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setPaddle2Y(prevY => Math.max(prevY - PADDLE_SPEED, 0));
      } else if (e.key === 'ArrowDown') {
        setPaddle2Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
      } else if (e.key === 'w') {
        setPaddle1Y(prevY => Math.max(prevY - PADDLE_SPEED, 0));
      } else if (e.key === 's') {
        setPaddle1Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // handles ball movement, collisions, and scoring
  useEffect(() => {
    const moveBall = setInterval(() => {
      if (isPaused) return;
      const newBallX = ballX + ballSpeedX;
      const newBallY = ballY + ballSpeedY;

      // check to make sure the ball is in bounds
      if (newBallY <= 0 || newBallY >= BOARD_HEIGHT - BALL_SIZE) {
        setBallSpeedY(prevSpeedY => -prevSpeedY);
      }

      // handles scoring and pausing after scoring 
      if (newBallX <= 0) {
        setScore2(prevScore => prevScore + 1);
        setIsPaused(true); 
        setTimeout(() => {
          resetBall();
          setIsPaused(false); 
        }, PAUSE_TIME);
      } else if (newBallX >= BOARD_WIDTH - BALL_SIZE) {
        setScore1(prevScore => prevScore + 1);
        setIsPaused(true);
        setTimeout(() => {
          resetBall();
          setIsPaused(false); 
        }, PAUSE_TIME);
      } else if ((newBallX <= PADDLE_WIDTH && newBallY + BALL_SIZE >= paddle1Y && newBallY <= paddle1Y + PADDLE_HEIGHT) ||
                 (newBallX + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH && newBallY + BALL_SIZE >= paddle2Y && newBallY <= paddle2Y + PADDLE_HEIGHT)) {
        setBallSpeedX(prevSpeedX => -prevSpeedX);
      }

      setBallX(newBallX);
      setBallY(newBallY);
    }, 20);

    return () => clearInterval(moveBall);
  }, [ballX, ballY, paddle1Y, paddle2Y, ballSpeedX, ballSpeedY, isPaused]);

  const resetBall = () => { // resets the ball position
    setBallX(BOARD_WIDTH / 2 - BALL_SIZE / 2);
    setBallY(BOARD_HEIGHT / 2 - BALL_SIZE / 2);
    setBallSpeedX(BALL_SPEED);
    setBallSpeedY(BALL_SPEED);
  };

  const resetGame = () => { // resets both players score counts 
    setScore1(0);
    setScore2(0);
    resetBall();
  };
  
  const pause = () => {
    setIsPaused(prevPaused => !prevPaused);
  }

  // renders the game components and scoreboard
  return (
    <div className="App">
      <div className="board">
        <div className="paddle" style={{ top: paddle1Y, left: 0 }} />
        <div className="paddle" style={{ top: paddle2Y, right: 0 }} />
        <div className="ball" style={{ top: ballY, left: ballX }} />
      </div>
      <div className="scoreboard">
        <div> Player 1: {score1}</div>
        <div> Player 2: {score2}</div>
      </div>
      <button className="custom" onClick={resetGame}>Restart Game</button>
      <button className="custom" onClick={pause}>Pause/Unpause</button>
    </div>
  );
}

export default App;
