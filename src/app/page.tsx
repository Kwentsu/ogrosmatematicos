'use client';

import { useState } from 'react';
import ConfigMenu from '@/components/ConfigMenu';
import GameScreen from '@/components/GameScreen';
import ResultsScreen from '@/components/ResultsScreen';

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'finite' | 'infinite';

export interface GameConfig {
  operations: Operation[];
  difficulty: Difficulty;
  mode: GameMode;
  questionCount?: number;
}

export interface GameStats {
  correct: number;
  incorrect: number;
  totalTime: number;
  questions: Array<{
    question: string;
    correctAnswer: number;
    userAnswer: number | null;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

type GameState = 'config' | 'playing' | 'results';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('config');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    setGameState('playing');
  };

  const endGame = (stats: GameStats) => {
    setGameStats(stats);
    setGameState('results');
  };

  const resetGame = () => {
    setGameState('config');
    setGameConfig(null);
    setGameStats(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-400 to-green-600">
      {gameState === 'config' && (
        <ConfigMenu onStartGame={startGame} />
      )}
      
      {gameState === 'playing' && gameConfig && (
        <GameScreen 
          config={gameConfig} 
          onGameEnd={endGame}
        />
      )}
      
      {gameState === 'results' && gameStats && (
        <ResultsScreen 
          stats={gameStats} 
          onPlayAgain={resetGame}
        />
      )}
    </main>
  );
}
