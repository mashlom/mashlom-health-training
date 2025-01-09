import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import quizData from './data/quizData.json';

// Import components
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ScorePage from './pages/ScorePage';

// Import styles
import './commoncss/global.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'quiz' | 'score'>('home');
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleTopicSelect = (topicId: string) => {
    if (topicId === "random") {
      // Get all questions from all topics
      const allQuestions = quizData.quizTopics.reduce<any[]>((acc, topic) => {
        return [...acc, ...topic.questions];
      }, []);

      // Randomly select 10 questions
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 10);

      setCurrentQuestions(selectedQuestions);
    } else {
      const selectedTopic = quizData.quizTopics.find(
        (topic) => topic.id === topicId
      );
      setCurrentQuestions(selectedTopic ? selectedTopic.questions : []);
    }
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);
    setCurrentPage('score');
  };

  const handleRestart = () => {
    setCurrentPage('home');
    setCurrentQuestions([]);
    setFinalScore(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-[700px] mx-auto">
      <Header />
      <main className="w-full flex-grow bg-[var(--main-content-background-color)] border border-[var(--border-color)] overflow-y-auto text-center h-[calc(92dvh-45px)]">
        <div dir="rtl">
          {currentPage === 'home' && (
            <HomePage onTopicSelect={handleTopicSelect} />
          )}
          {currentPage === 'quiz' && currentQuestions.length > 0 && (
            <QuizPage
              questions={currentQuestions}
              onComplete={handleQuizComplete}
              onHome={handleRestart}
            />
          )}
          {currentPage === 'score' && (
            <ScorePage score={finalScore!} onHome={handleRestart} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;