'use client';

import { useState } from 'react';
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            🧌 Ogros Matemáticos
          </h1>
          <p className="text-gray-600">
            Configure seu jogo e divirta-se aprendendo!
          </p>
        </div>

        <div className="space-y-6">
          {/* Operações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Escolher Operações:
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(operationLabels) as Operation[]).map((operation) => (
                <label 
                  key={operation}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={operations.includes(operation)}
                    onChange={() => handleOperationChange(operation)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">
                    {operationLabels[operation]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dificuldade */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Dificuldade:
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(difficultyLabels) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    difficulty === diff
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficultyLabels[diff]}
                </button>
              ))}
            </div>
          </div>

          {/* Modo de Jogo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Modo de Jogo:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('finite')}
                className={`p-3 rounded-lg font-medium transition-all ${
                  mode === 'finite'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Número Fixo
              </button>
              <button
                onClick={() => setMode('infinite')}
                className={`p-3 rounded-lg font-medium transition-all ${
                  mode === 'infinite'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Infinito
              </button>
            </div>
          </div>

          {/* Número de Questões */}
          {mode === 'finite' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Número de Questões:
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-bold min-w-[3rem] text-center">
                  {questionCount}
                </span>
              </div>
            </div>
          )}

          {/* Botão Iniciar */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
          >
            🎮 Iniciar Jogo!
          </button>
        </div>
      </div>
    </div>
  );
}