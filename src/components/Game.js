import { useState, useRef } from 'react'
import './Game.css'

const Game = ({verifyLetter, palavraEscolhida, categoriaEscolhida, letras, letrasAdvinhadas, letrasErradas, lifes, score}) => {

    const [letra, setLetra] = useState("")
    const letraInputRef = useRef(null)

    const handleSubmit = (event) => {
        event.preventDefault()

        verifyLetter(letra)

        setLetra("")
        letraInputRef.current.focus() //Coloca o cursor automaticamente após enviar o form na jogada
    }
    
    return (
    <div className="game">
        <p className="points">
            <span>Pontuação: {score}</span>
        </p>
        <h1>Advinhe a palavra</h1>
        <h3 className="tip">
            Dica sobre a palavra: <span>{categoriaEscolhida}</span>
        </h3>
        <p>Você ainda tem {lifes} tentativa(s).</p>
        <div className="wordContainer">
            {letras.map((letra, i) => (
                letrasAdvinhadas.includes(letra) ? (
                    <span key={i} className='letter'>{letra}</span>
                ) : (
                    <span key={i} className='blankSquare'></span>
                )
            ))}
        </div>

        <div className="letterContainer">
            <p>Tente advinhar uma letra da palavra:</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="letter" maxLength="1" required onChange={(event) => (setLetra(event.target.value))} value={letra} ref={letraInputRef}/>
                <button>Jogar!</button>
            </form>
        </div>

        <div className="wrongLettersContainer">
            <p>Letras já utilizadas:</p>
            {letrasErradas.map((letra, i) => (
                <span key={i}>{letra} </span>
            ))}
        </div>
    </div>
  )
}

export default Game