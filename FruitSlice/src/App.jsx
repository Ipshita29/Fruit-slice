import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [fruits, setFruits] = useState([])

  const fruitTypes = [
    { name: 'apple', points: 1, image: 'apple.png' },
    { name: 'banana', points: 2, image: 'banana.png' },
    { name: 'orange', points: 3, image: 'orange.png' },
    { name: 'watermelon', points: 5, image: 'watermelon.png' },
    { name: 'bomb', points: 0, image: 'bomb.png' }, // Bomb that ends the game
  ]

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameActive(true)
    setFruits([])
  }

  const sliceFruit = (id, type) => {
    if (!gameActive) return

    if (type === 'bomb') {
      setGameActive(false) // End game if bomb is cut
      return
    }

    const fruitToSlice = fruits.find(fruit => fruit.id === id)
    if (fruitToSlice) {
      setScore(prev => prev + fruitToSlice.points)
    }

    setFruits(prev => prev.filter(fruit => fruit.id !== id))
  }

  useEffect(() => {
    if (!gameActive) return

    const spawnInterval = setInterval(() => {
      if (fruits.length < 10) {
        const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)]
        const newFruit = {
          id: Date.now() + Math.random(),
          type: randomFruit.name,
          points: randomFruit.points,
          image: randomFruit.image,
          left: Math.random() * 80 + 10,
          top: Math.random() * 60 + 10,
        }
        setFruits(prev => [...prev, newFruit])
      }
    }, 1000)

    return () => clearInterval(spawnInterval)
  }, [gameActive, fruits.length])

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, timeLeft])

  return (
    <div className="game-container">
      <h1>Fruit Slice Game</h1>

      {!gameActive ? (
        <div className="start-screen">
          <button onClick={startGame}>Start Game</button>
          {timeLeft === 0 && <p>Game Over! Your score: {score}</p>}
          {!timeLeft && score === 0 && <p>Be careful! Don't cut bombs!</p>}
        </div>
      ) : (
        <div className="game-screen">
          <div className="game-info">
            <p>Time: {timeLeft}s</p>
            <p>Score: {score}</p>
          </div>

          <div className="game-area">
            {fruits.map(fruit => (
              <img
                key={fruit.id}
                src={`images/${fruit.image}`}
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
        </div>
      )}
    </div>
  )
}

export default App
