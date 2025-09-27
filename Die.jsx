export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    const pips = Array(props.value).fill(0).map((_, i) => <span className="pip" key={i} />)
    
    return (
        <button 
            className={`die-face die-num-${props.value}`}
            style={styles}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >
            {pips}
        </button>
    )
}