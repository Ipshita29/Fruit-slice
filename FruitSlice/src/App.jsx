import { useState, useEffect } from 'react';
import './App.css';
import appleImg from './assets/apple.png';
import bananaImg from './assets/banana.png';
import orangeImg from './assets/orange.png';
import watermelonImg from './assets/watermelon.png';
import chiliImg from './assets/chilli.png';

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [fruits, setFruits] = useState([]);
  const [gameShaking, setGameShaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const fruitTypes = [
    { name: 'apple', points: 1, image: appleImg },
    { name: 'banana', points: 2, image: bananaImg },
    { name: 'orange', points: 3, image: orangeImg },
    { name: 'watermelon', points: 5, image: watermelonImg },
    { name: 'chili', points: 0, image: chiliImg }, 
  ];

  
  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setGameActive(true);
    setGameOver(false); 
    setFruits([]);
  };


  const sliceFruit = (id, type) => {
    if (!gameActive) return;

    if (type === 'chili') {
      setGameActive(false);
      setGameOver(true); 
      setGameShaking(true);
      setTimeout(() => setGameShaking(false), 500);
    } else {
      const fruitToSlice = fruits.find((fruit) => fruit.id === id);
      if (fruitToSlice) {
        setScore((prev) => prev + fruitToSlice.points);
      }
    }
    setFruits((prev) => prev.filter((fruit) => fruit.id !== id));
  };

  useEffect(() => {
    if (!gameActive) return;

    const spawnInterval = setInterval(() => {
      if (fruits.length < 10) {
        const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
        const newFruit = {
          id: Date.now() + Math.random(),
          type: randomFruit.name,
          points: randomFruit.points,
          image: randomFruit.image,
          left: Math.random() * 80 + 10,
          top: Math.random() * 60 + 10,
        };
        setFruits((prev) => [...prev, newFruit]);
      }
    }, 600); 

    return () => clearInterval(spawnInterval);
  }, [gameActive, fruits.length]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  return (
    <div className={`game-container ${gameShaking ? 'shake' : ''}`}>
      <h1>Fruit Slice!</h1>

      <div className="scoreboard">
        <p>Time: {timeLeft}s</p>
        <p>Score: {score}</p>
      </div>

      {!gameActive && gameOver && (
        <p className="game-over-message">Game Over! Your score: {score}</p>
      )}

      {!gameActive ? (
        <div className="start-screen">
          <button onClick={startGame}>Start Game</button>
          {gameOver && <p>Try again to beat your score!</p>}
        </div>
      ) : (
        <div className="game-area">
          {fruits.map((fruit) => (
            <img
              key={fruit.id}
              src={fruit.image}
              alt={fruit.type}
              className="fruit"
              style={{
                left: `${fruit.left}%`,
                top: `${fruit.top}%`,
              }}
              onClick={() => sliceFruit(fruit.id, fruit.type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
