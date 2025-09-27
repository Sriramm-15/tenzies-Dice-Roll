import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [rollCount, setRollCount] = useState(0)
    const [time, setTime] = useState(0)
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
        
        let intervalId
        if (!gameWon) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
        }
        
        return () => clearInterval(intervalId)

    }, [gameWon, dice])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function resetGame() {
        setDice(generateAllNewDice())
        setRollCount(0)
        setTime(0)
    }
    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
            setRollCount(prevCount => prevCount + 1)
        } else {
            resetGame()
        }
    }

    function hold(id) {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.id === id ?
                    { ...die, isHeld: !die.isHeld } :
                    die
            ))
        }
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won in {time} seconds with {rollCount} rolls! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="game-stats">
                <p>Rolls: {rollCount}</p>
                <p>Time: {time}s</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}