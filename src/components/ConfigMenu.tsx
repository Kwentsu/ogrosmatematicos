'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GameConfig, Operation, Difficulty, GameMode } from '@/app/page';

interface ConfigMenuProps {
  onStartGame: (config: GameConfig) => void;
}

export default function ConfigMenu({ onStartGame }: ConfigMenuProps) {
  const [operations, setOperations] = useState<Operation[]>(['addition']);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<GameMode>('finite');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const operationLabels = {
    addition: 'Adição (+)',
    subtraction: 'Subtração (-)',
    multiplication: 'Multiplicação (×)',
    division: 'Divisão (÷)'
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  };

  const handleOperationChange = (operation: Operation) => {
    setOperations(prev => 
      prev.includes(operation)
        ? prev.filter(op => op !== operation)
        : [...prev, operation]
    );
  };

  const handleStart = () => {
    if (operations.length === 0) {
      alert('Selecione pelo menos uma operação!');
      return;
    }

    const config: GameConfig = {
      operations,
      difficulty,
      mode,
      ...(mode === 'finite' && { questionCount })
    };

    onStartGame(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 relative overflow-hidden">
      {/* Floating elements for decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🌟</div>
        <div className="absolute top-20 right-20 text-4xl animate-pulse">🎯</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{animationDelay: '1s'}}>📚</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse" style={{animationDelay: '2s'}}>🏆</div>
        <div className="absolute top-1/2 left-5 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="absolute top-1/3 right-5 text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>🎮</div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 max-w-lg w-full mx-auto border-4 border-yellow-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4 space-x-4">
              <div className="animate-bounce">
                <Image
                  src="/Azul.png"
                  alt="Ogro Azul"
                  width={80}
                  height={80}
                  className="drop-shadow-lg"
                />
              </div>
              <div className="animate-bounce" style={{animationDelay: '0.2s'}}>
                <Image
                  src="/Red.png"
                  alt="Ogro Vermelho"
                  width={80}
                  height={80}
                  className="drop-shadow-lg"
                />
              </div>
              <div className="animate-bounce" style={{animationDelay: '0.4s'}}>
                <Image
                  src="/Yellow.png"
                  alt="Ogro Amarelo"
                  width={80}
                  height={80}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Ogros Matemáticos
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              🎲 Configure seu jogo e divirta-se aprendendo! 🎲
            </p>
          </div>

          <div className="space-y-6">
            {/* Operações */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🔢 Escolha as Operações:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(operationLabels) as Operation[]).map((operation) => (
                  <button
                    key={operation}
                    onClick={() => handleOperationChange(operation)}
                    className={`p-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                      operations.includes(operation)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border-2 border-green-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {operationLabels[operation]}
                  </button>
                ))}
              </div>
            </div>

            {/* Dificuldade */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                ⚡ Dificuldade:
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(difficultyLabels) as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                      difficulty === diff
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {diff === 'easy' && '😊'} {diff === 'medium' && '😎'} {diff === 'hard' && '🔥'}
                    <br />
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>

            {/* Modo de Jogo */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🎯 Modo de Jogo:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('finite')}
                  className={`p-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                    mode === 'finite'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  🎪 Número Fixo
                </button>
                <button
                  onClick={() => setMode('infinite')}
                  className={`p-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                    mode === 'infinite'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  ♾️ Infinito
                </button>
              </div>
            </div>

            {/* Número de Questões */}
            {mode === 'finite' && (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  📊 Quantas Questões?
                </h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="flex-1 h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold min-w-[4rem] text-center text-xl shadow-lg">
                    {questionCount}
                  </div>
                </div>
              </div>
            )}

            {/* Botão Iniciar */}
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-xl border-4 border-yellow-300 hover:border-orange-300"
            >
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-2">🚀</span>
                COMEÇAR A AVENTURA!
                <span className="text-2xl ml-2">🎉</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}