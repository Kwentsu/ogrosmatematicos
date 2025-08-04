'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GameConfig, GameStats, Operation, Difficulty } from '@/app/page';

interface GameScreenProps {
  config: GameConfig;
  onGameEnd: (stats: GameStats) => void;
}

interface Question {
  question: string;
  correctAnswer: number;
  options: number[];
}

const ogres = [
  { name: 'Azul', src: '/Azul.png', color: 'blue' },
  { name: 'Red', src: '/Red.png', color: 'red' },
  { name: 'Yellow', src: '/Yellow.png', color: 'yellow' }
];

export default function GameScreen({ config, onGameEnd }: GameScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [gameStats, setGameStats] = useState<GameStats['questions']>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [gameStartTime] = useState<number>(Date.now());
  const [showFeedback, setShowFeedback] = useState<{show: boolean, isCorrect: boolean, correctAnswer?: number}>({
    show: false,
    isCorrect: false
  });
  const [ogrePositions, setOgrePositions] = useState<number[]>([]);

  const generateRandomNumber = (difficulty: Difficulty, operation: Operation) => {
    const ranges = {
      easy: { min: 1, max: operation === 'multiplication' || operation === 'division' ? 5 : 10 },
      medium: { min: operation === 'division' ? 2 : 1, max: operation === 'multiplication' || operation === 'division' ? 10 : 50 },
      hard: { min: operation === 'division' ? 5 : 1, max: operation === 'multiplication' || operation === 'division' ? 15 : 100 }
    };
    
    const range = ranges[difficulty];
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  };

  const generateQuestion = useCallback((): Question => {
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    let num1, num2, result, questionText;

    switch (operation) {
      case 'addition':
        num1 = generateRandomNumber(config.difficulty, operation);
        num2 = generateRandomNumber(config.difficulty, operation);
        result = num1 + num2;
        questionText = `${num1} + ${num2} = ?`;
        break;
      case 'subtraction':
        num1 = generateRandomNumber(config.difficulty, operation);
        num2 = generateRandomNumber(config.difficulty, operation);
        if (num2 > num1) [num1, num2] = [num2, num1]; // Ensure positive result
        result = num1 - num2;
        questionText = `${num1} - ${num2} = ?`;
        break;
      case 'multiplication':
        num1 = generateRandomNumber(config.difficulty, operation);
        num2 = generateRandomNumber(config.difficulty, operation);
        result = num1 * num2;
        questionText = `${num1} × ${num2} = ?`;
        break;
      case 'division':
        num2 = generateRandomNumber(config.difficulty, operation);
        result = generateRandomNumber(config.difficulty, operation);
        num1 = num2 * result; // Ensure exact division
        questionText = `${num1} ÷ ${num2} = ?`;
        break;
      default:
        num1 = 1; num2 = 1; result = 2; questionText = '1 + 1 = ?';
    }

    // Generate wrong options
    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 2) {
      const wrong: number = result + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      if (wrong !== result && wrong > 0) {
        wrongOptions.add(wrong);
      }
    }

    const options = [result, ...Array.from(wrongOptions)];
    
    return {
      question: questionText,
      correctAnswer: result,
      options: options.sort(() => Math.random() - 0.5) // Shuffle options
    };
  }, [config]);

  // Assign random positions to ogres
  const assignOgrePositions = useCallback((options: number[]) => {
    const positions = [0, 1, 2];
    return positions.sort(() => Math.random() - 0.5);
  }, []);

  const nextQuestion = useCallback(() => {
    const question = generateQuestion();
    const positions = assignOgrePositions(question.options);
    
    setCurrentQuestion(question);
    setOgrePositions(positions);
    setQuestionStartTime(Date.now());
    setShowFeedback({show: false, isCorrect: false});
  }, [generateQuestion, assignOgrePositions]);

  const handleOgreClick = (ogreIndex: number) => {
    if (!currentQuestion || showFeedback.show) return;

    const selectedAnswer = currentQuestion.options[ogrePositions[ogreIndex]];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    // Update stats
    const questionStat = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer: selectedAnswer,
      isCorrect,
      timeSpent
    };

    setGameStats(prev => [...prev, questionStat]);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1)
    }));

    // Show feedback
    setShowFeedback({
      show: true,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer
    });

    // Move to next question or end game
    setTimeout(() => {
      if (config.mode === 'finite' && questionNumber >= (config.questionCount || 5)) {
        // End game
        const totalTime = Date.now() - gameStartTime;
        const finalStats: GameStats = {
          correct: score.correct + (isCorrect ? 1 : 0),
          incorrect: score.incorrect + (isCorrect ? 0 : 1),
          totalTime,
          questions: [...gameStats, questionStat]
        };
        onGameEnd(finalStats);
      } else {
        setQuestionNumber(prev => prev + 1);
        nextQuestion();
      }
    }, 2000);
  };

  const endInfiniteGame = () => {
    const totalTime = Date.now() - gameStartTime;
    const finalStats: GameStats = {
      correct: score.correct,
      incorrect: score.incorrect,
      totalTime,
      questions: gameStats
    };
    onGameEnd(finalStats);
  };

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl text-white">Carregando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-green-400">
      {/* Background Scenario - Fixed size container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl aspect-[4/3] mx-auto">
          <Image
            src="/Cenário.png"
            alt="Cenário do jogo"
            fill
            className="object-contain"
            priority
          />
          
          {/* Ogres positioned over the stones */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Container positioned specifically over the stones area */}
            <div className="absolute bottom-[42%] left-1/2 transform -translate-x-1/2 flex justify-center space-x-[12%] w-[85%]">
              {ogres.map((ogre, index) => (
                <div key={ogre.name} className="relative flex flex-col items-center">
                  {/* Answer number above ogre */}
                  <div className="mb-2 z-20">
                    <div className="bg-white border-4 border-yellow-400 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-lg lg:text-2xl font-bold text-gray-800">
                        {currentQuestion.options[ogrePositions[index]]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Ogre */}
                  <button
                    onClick={() => handleOgreClick(index)}
                    disabled={showFeedback.show}
                    className="relative transform transition-all duration-200 hover:scale-110 focus:scale-110 disabled:cursor-not-allowed hover:animate-pulse"
                  >
                    <Image
                      src={ogre.src}
                      alt={`Ogro ${ogre.name}`}
                      width={80}
                      height={80}
                      className="drop-shadow-lg lg:w-24 lg:h-24"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Question Area - positioned over the scroll */}
          <div className="absolute bottom-[8%] left-1/2 transform -translate-x-1/2 w-[85%] max-w-md">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-500 rounded-2xl p-4 lg:p-6 shadow-2xl">
              <div className="text-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h2>
                <p className="text-sm lg:text-base text-gray-600">
                  Clique no ogro com a resposta correta!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent text-white">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold bg-black/50 px-3 py-1 rounded-full">
            {config.mode === 'finite' 
              ? `${questionNumber}/${config.questionCount || 5}`
              : `#${questionNumber}`
            }
          </span>
          <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-bold">
            ✅ {score.correct}
          </span>
          <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
            ❌ {score.incorrect}
          </span>
        </div>
        {config.mode === 'infinite' && (
          <button
            onClick={endInfiniteGame}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🏁 Finalizar
          </button>
        )}
      </div>

      {/* Subtle Feedback Notification */}
      {showFeedback.show && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-lg border-2 backdrop-blur-sm ${
            showFeedback.isCorrect 
              ? 'bg-green-100/90 border-green-400 text-green-800' 
              : 'bg-red-100/90 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {showFeedback.isCorrect ? '🎉' : '😅'}
              </span>
              <div>
                <div className="font-bold">
                  {showFeedback.isCorrect ? 'Parabéns!' : 'Tente de novo!'}
                </div>
                {!showFeedback.isCorrect && (
                  <div className="text-sm">
                    Resposta: <span className="font-bold">{showFeedback.correctAnswer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}