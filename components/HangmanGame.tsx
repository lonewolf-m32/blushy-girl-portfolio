'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw, Trophy, X } from 'lucide-react'

interface HangmanGameProps {
  isDarkMode?: boolean
}

const WORDS = [
  'JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'ANGULAR', 'PYTHON', 'DATABASE',
  'ALGORITHM', 'FRAMEWORK', 'DEVELOPER', 'PROGRAMMING', 'SOFTWARE',
  'COMPUTER', 'KEYBOARD', 'MONITOR', 'NETWORK', 'SECURITY', 'ENCRYPTION',
  'BACKEND', 'FRONTEND', 'FULLSTACK', 'DEPLOYMENT', 'CONTAINER', 'KUBERNETES',
  'MACHINE', 'LEARNING', 'ARTIFICIAL', 'INTELLIGENCE', 'QUANTUM', 'BLOCKCHAIN',
  'VIRTUAL', 'REALITY', 'AUGMENTED', 'INTERFACE', 'TERMINAL', 'COMMAND',
  'FUNCTION', 'VARIABLE', 'CONSTANT', 'ARRAY', 'OBJECT', 'STRING',
  'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'PROMISE', 'ASYNC',
  'AWAIT', 'CALLBACK', 'CLOSURE', 'PROTOTYPE', 'INHERITANCE', 'POLYMORPHISM'
]

const MAX_WRONG_GUESSES = 6

export default function HangmanGame({ isDarkMode = false }: HangmanGameProps) {
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [score, setScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(randomWord)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameStatus('playing')
  }

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    if (gameStatus !== 'playing') return

    const wordLetters = new Set(word.split(''))
    const guessedWordLetters = new Set(Array.from(guessedLetters).filter(letter => word.includes(letter)))

    if (wordLetters.size === guessedWordLetters.size && word.length > 0) {
      setGameStatus('won')
      setScore(prev => prev + 1)
      setGamesPlayed(prev => prev + 1)
    } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus('lost')
      setGamesPlayed(prev => prev + 1)
    }
  }, [guessedLetters, wrongGuesses, word, gameStatus])

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return

    const newGuessedLetters = new Set(guessedLetters)
    newGuessedLetters.add(letter)
    setGuessedLetters(newGuessedLetters)

    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1)
    }
  }

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <div
        key={index}
        className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold border-b-4 ${
          isDarkMode ? 'border-cyan-400 text-white' : 'border-rose-500 text-slate-900'
        }`}
      >
        {guessedLetters.has(letter) ? letter : ''}
      </div>
    ))
  }

  const renderHangman = () => {
    const parts = [
      <circle key="head" cx="140" cy="70" r="20" stroke="currentColor" strokeWidth="3" fill="none" />,
      <line key="body" x1="140" y1="90" x2="140" y2="150" stroke="currentColor" strokeWidth="3" />,
      <line key="leftArm" x1="140" y1="110" x2="110" y2="130" stroke="currentColor" strokeWidth="3" />,
      <line key="rightArm" x1="140" y1="110" x2="170" y2="130" stroke="currentColor" strokeWidth="3" />,
      <line key="leftLeg" x1="140" y1="150" x2="120" y2="180" stroke="currentColor" strokeWidth="3" />,
      <line key="rightLeg" x1="140" y1="150" x2="160" y2="180" stroke="currentColor" strokeWidth="3" />
    ]

    return (
      <svg width="200" height="200" className={isDarkMode ? 'text-cyan-400' : 'text-rose-500'}>
        <line x1="10" y1="190" x2="90" y2="190" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="190" x2="50" y2="20" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="3" />
        <line x1="140" y1="20" x2="140" y2="50" stroke="currentColor" strokeWidth="3" />
        {parts.slice(0, wrongGuesses)}
      </svg>
    )
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <Card
      className={`p-6 sm:p-8 backdrop-blur-sm shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Hangman Game
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Guess the word before running out of tries!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-cyan-500/20' : 'bg-rose-100'
            }`}>
              <Trophy className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`} />
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {score}/{gamesPlayed}
              </span>
            </div>
            <Button
              onClick={startNewGame}
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-full transition-all duration-300 ${
                isDarkMode ? 'hover:bg-cyan-500/20 text-cyan-400' : 'hover:bg-rose-200 text-rose-600'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="flex items-center justify-center">
            {renderHangman()}
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {renderWord()}
            </div>

            <div className="text-center">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Wrong guesses: {wrongGuesses}/{MAX_WRONG_GUESSES}
              </p>
            </div>
          </div>
        </div>

        {gameStatus !== 'playing' && (
          <div
            className={`p-6 rounded-xl text-center space-y-4 ${
              gameStatus === 'won'
                ? isDarkMode
                  ? 'bg-green-500/20 border-2 border-green-400/50'
                  : 'bg-green-100 border-2 border-green-400'
                : isDarkMode
                ? 'bg-red-500/20 border-2 border-red-400/50'
                : 'bg-red-100 border-2 border-red-400'
            }`}
          >
            <h3
              className={`text-2xl font-bold ${
                gameStatus === 'won'
                  ? isDarkMode
                    ? 'text-green-400'
                    : 'text-green-700'
                  : isDarkMode
                  ? 'text-red-400'
                  : 'text-red-700'
              }`}
            >
              {gameStatus === 'won' ? 'You Won!' : 'Game Over!'}
            </h3>
            {gameStatus === 'lost' && (
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                The word was: <span className="font-bold">{word}</span>
              </p>
            )}
            <Button
              onClick={startNewGame}
              className={`${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
              } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              Play Again
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <p className={`text-sm font-medium text-center ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Select a letter:
          </p>
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
            {alphabet.map(letter => {
              const isGuessed = guessedLetters.has(letter)
              const isCorrect = isGuessed && word.includes(letter)
              const isWrong = isGuessed && !word.includes(letter)

              return (
                <Button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={isGuessed || gameStatus !== 'playing'}
                  className={`h-10 sm:h-12 text-sm sm:text-base font-bold transition-all duration-300 ${
                    isCorrect
                      ? isDarkMode
                        ? 'bg-green-500/30 text-green-400 hover:bg-green-500/40'
                        : 'bg-green-200 text-green-700 hover:bg-green-300'
                      : isWrong
                      ? isDarkMode
                        ? 'bg-red-500/30 text-red-400 hover:bg-red-500/40'
                        : 'bg-red-200 text-red-700 hover:bg-red-300'
                      : isDarkMode
                      ? 'bg-cyan-500/20 text-white hover:bg-cyan-500/30'
                      : 'bg-rose-100 text-slate-900 hover:bg-rose-200'
                  } ${isGuessed ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {letter}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
