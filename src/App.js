//CSS
import './App.css';

//React
import {useState, useEffect, useCallback} from 'react'

//Dados
import { wordsList } from './data/words';

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}  
]
function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)

  const [palavraEscolhida, setPalavraEscolhida] = useState("")
  const [categoriaEscolhida, setCategoriaEscolhida] = useState("")
  const [letras, setLetras] = useState([]) //Lista de letras

  const [words] = useState(wordsList)

  const [letrasAdvinhadas, setLetrasAdvinhadas] = useState([])
  const [letrasErradas, setLetrasErradas] = useState([])

  const [lifes, setLifes] = useState(3)
  const [score, setScore] = useState(0)

  const escolherPalavraECategoria = useCallback(() => {
    //Seleciona uma categoria aleatória
    const categorias = Object.keys(words)

    let indiceAleatorio = Math.floor(Math.random() * Object.keys(categorias).length)
    const categoria = categorias[indiceAleatorio]

    //Seleciona uma palavra aleatória
    indiceAleatorio = Math.floor(Math.random() * words[categoria].length)
    const palavra = words[categoria][indiceAleatorio]


    return {palavra, categoria}
  }, [words])

  const startGame = useCallback(() => {
    clearStatesLetras()
    //Escolha da palavra e escolha da categoria
    const {palavra, categoria} = escolherPalavraECategoria()
    console.log(`Palavra e categotia selecionadas: ${palavra} | ${categoria}`)

    //Criar um Array com as letras da palavra
    let letrasPalavra = palavra.split("")
    letrasPalavra = letrasPalavra.map((letra) => letra.toLowerCase())
    console.log(`Letras da palavra: ${letrasPalavra}`)

    //Setar os estados (variaveis)
    setPalavraEscolhida(palavra)
    setCategoriaEscolhida(categoria)
    setLetras(letrasPalavra)
    setGameStage(stages[1].name)
  }, [escolherPalavraECategoria])

  //Funcao pra processar a letra que o usuario digita no input
  const verifyLetter = (letra) => {
    console.log(letra)

    const letraNormalizada = letra.toLowerCase()//Retirar letra maiuscula e acentos

    //Verificar se a letra já foi usada de alguma forma
    if(letrasErradas.includes(letraNormalizada) || letrasAdvinhadas.includes(letraNormalizada)){
      return; //Retorna sem o usuario perder uma chance
    }

    //Colocando uma letra advinhada ou removendo uma chance
    if(letras.includes(letraNormalizada)){
      //A letra tá certa
      setLetrasAdvinhadas((atualLetrasAdvinhadas) => [
        ...atualLetrasAdvinhadas, letraNormalizada
      ]) //Add a letra advinhada no array 
    }else{
      //Letra errada
      setLetrasErradas((atualLetrasErradas) => [
        ...atualLetrasErradas, letraNormalizada
      ]) 

      setLifes((atualLifes) => atualLifes - 1)
    }
  }

  const clearStatesLetras = () => {
    setLetrasAdvinhadas([])
    setLetrasErradas([])
  }
  //Vai monitorar a contagem de lifes sempre que forem alteradas
  useEffect(() => {
    if(lifes <= 0){
      //Game Over -> Precisamos resetar todos os dados
      clearStatesLetras()
      setGameStage(stages[2].name)
    } 
  }, [lifes])
  
  //Monitorar quando o usuário ganhou o jogo sempre que ele acertar uma letra
  useEffect(() => {

    const letrasUnicas = [...new Set(letras)] //Cria um Array com letras unicas
    
    //Condição de ganho
    if(letrasUnicas.length === letrasAdvinhadas.length){
      setScore((atualScore) => atualScore + 100)
    
      startGame()
    }

    //Reseta o game
    console.log(letrasUnicas)

  }, [letrasAdvinhadas, letras, startGame])

  //Reinicar jogo
  const retry = () => {
    setScore(0)
    setLifes(3)
    setGameStage(stages[0].name)
  }
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          palavraEscolhida={palavraEscolhida} 
          categoriaEscolhida={categoriaEscolhida} 
          letras={letras} 
          letrasAdvinhadas={letrasAdvinhadas} 
          letrasErradas={letrasErradas} 
          lifes={lifes} 
          score={score}/> )}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
