'use client';

import { GameStats } from '@/app/page';

interface ResultsScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
}

export default function ResultsScreen({ stats, onPlayAgain }: ResultsScreenProps) {
  const totalQuestions = stats.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0;
  const averageTime = totalQuestions > 0 ? Math.round(stats.totalTime / totalQuestions / 1000) : 0;
  const totalTimeSeconds = Math.round(stats.totalTime / 1000);
  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = totalTimeSeconds % 60;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Excelente! Você é um gênio da matemática! 🏆", color: "text-yellow-600", emoji: "🌟" };
    if (accuracy >= 80) return { message: "Muito bem! Continue assim! 🎉", color: "text-green-600", emoji: "👏" };
    if (accuracy >= 70) return { message: "Bom trabalho! Você está melhorando! 👍", color: "text-blue-600", emoji: "💪" };
    if (accuracy >= 50) return { message: "Continue praticando, você vai conseguir! 💪", color: "text-orange-600", emoji: "📚" };
    return { message: "Não desista! A prática leva à perfeição! 🌈", color: "text-purple-600", emoji: "🎯" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Parabéns!
          </h1>
          <p className={`text-xl ${performance.color} font-semibold`}>
            {performance.message}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-sm text-green-700">Acertos</div>
          </div>
          
          <div className="bg-red-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.incorrect}</div>
            <div className="text-sm text-red-700">Erros</div>
          </div>
          
          <div className="bg-blue-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-blue-700">Precisão</div>
          </div>
          
          <div className="bg-purple-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
            </div>
            <div className="text-sm text-purple-700">Tempo Total</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas Detalhadas</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Questões:</span>
              <span className="font-bold text-gray-800">{totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tempo Médio/Questão:</span>
              <span className="font-bold text-gray-800">{averageTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Melhor Sequência:</span>
              <span className="font-bold text-gray-800">{getBestStreak()}🔥</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questões Rápidas (&lt;5s):</span>
              <span className="font-bold text-gray-800">{getQuickAnswers()}⚡</span>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revisão das Questões</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {stats.questions.map((question, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  question.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-lg ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {question.isCorrect ? '✅' : '❌'}
                  </span>
                  <span className="font-medium text-gray-700">{question.question}</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{Math.round(question.timeSpent / 1000)}s</div>
                  {!question.isCorrect && (
                    <div className="text-green-600 font-medium">
                      Resp: {question.correctAnswer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🎮 Jogar Novamente
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Ogros Matemáticos - Meus Resultados!',
                  text: `Acabei de jogar Ogros Matemáticos! Acertei ${stats.correct} de ${totalQuestions} questões (${accuracy}% de precisão)! 🧌📊`,
                  url: window.location.href,
                });
              } else {
                const text = `Acabei de jogar Ogros Matemáticos! Acertei ${stats.correct} de ${totalQuestions} questões (${accuracy}% de precisão)! 🧌📊`;
                navigator.clipboard.writeText(text);
                alert('Resultado copiado para a área de transferência!');
              }
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            📱 Compartilhar
          </button>
        </div>
      </div>
    </div>
  );

  function getBestStreak(): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (const question of stats.questions) {
      if (question.isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

  function getQuickAnswers(): number {
    return stats.questions.filter(q => q.timeSpent < 5000).length;
  }
}