import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [fruits, setFruits] = useState([]);
  const [gameShaking, setGameShaking] = useState(false);
  const [gameOver, setGameOver] = useState(false); // Track game over state

  const fruitTypes = [
    { name: 'apple', points: 1, image: 'apple.png' },
    { name: 'banana', points: 2, image: 'banana.png' },
    { name: 'orange', points: 3, image: 'orange.png' },
    { name: 'watermelon', points: 5, image: 'watermelon.png' },
    { name: 'chili', points: 0, image: 'chili.png' },
  ];

  // Start game function
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setGameOver(false); // Reset game over state
    setFruits([]);
  };

  // Handle slicing the fruit
  const sliceFruit = (id, type) => {
    if (!gameActive) return;

    if (type === 'chili') {
      setGameShaking(true);
      setTimeout(() => setGameShaking(false), 500); // Shake effect for 0.5s
    } else {
      const fruitToSlice = fruits.find((fruit) => fruit.id === id);
      if (fruitToSlice) {
        setScore((prev) => prev + fruitToSlice.points);
      }
    }

    // Remove sliced fruit
    setFruits((prev) => prev.filter((fruit) => fruit.id !== id));
  };

  // Spawn fruits faster by reducing interval time (to 600ms)
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
    }, 600); // Spawn fruits faster

    return () => clearInterval(spawnInterval);
  }, [gameActive, fruits.length]);

  // Game timer and "Game Over" handling
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          setGameOver(true); // Show "Game Over" message
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
              src={`/images/${fruit.image}`}
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
