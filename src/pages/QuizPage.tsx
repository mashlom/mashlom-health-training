import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Check, X, ArrowLeft, Home } from 'lucide-react';

interface Question {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

interface QuizPageProps {
  questions: Question[];
  onComplete: (score: number) => void;
  onHome: () => void;
}

const HomeButton: React.FC<{ onClick: () => void; text?: string }> = ({ 
  onClick, 
  text = "" 
}) => (
  <Button
    onClick={onClick}
    className="quiz-home-button"
  >
    <Home className="w-4 h-4" />
    {text && <span>{text}</span>}
  </Button>
);

const QuizPage: React.FC<QuizPageProps> = ({ questions, onComplete, onHome }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);

  useEffect(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledQuestions(shuffleArray(questions));
  }, [questions]);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const currentQ = shuffledQuestions[currentQuestion];

      const answersWithIndices = currentQ.answers.map((answer, index) => ({
        text: answer,
        isCorrect: index === currentQ.correct,
      }));

      const shuffled = [...answersWithIndices].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffled.findIndex((answer) => answer.isCorrect);

      setShuffledAnswers(shuffled.map((answer) => answer.text));
      setCorrectAnswerIndex(newCorrectIndex);
    }
  }, [currentQuestion, shuffledQuestions]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (index === correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      onComplete(Math.round((score / shuffledQuestions.length) * 100));
    }
  };

  if (shuffledQuestions.length === 0 || !shuffledAnswers.length) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="bg-[var(--page-background-color)] rounded-lg overflow-hidden">
        <div className="bg-[var(--header-background)] p-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center flex-row">
            <div className="text-sm font-medium text-[var(--header-text-color)]">
              שאלה {currentQuestion + 1} מתוך {shuffledQuestions.length}
            </div>
            <HomeButton onClick={onHome} />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--page-font-color)] leading-relaxed">
              {shuffledQuestions[currentQuestion].question}
            </h2>
          </div>

          <div className="space-y-4">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => !showAnswer && handleAnswer(index)}
                disabled={showAnswer}
                className={`w-full min-h-[3.5rem] px-4 py-3 text-right rounded-lg border border-[var(--border-color)] ${
                  showAnswer
                    ? index === correctAnswerIndex
                      ? "bg-green-100 border-green-300 text-[var(--page-font-color)]"
                      : selectedAnswer === index
                      ? "bg-[#fff0f0] border-[#ff9999] text-[var(--page-font-color)]"
                      : "bg-[var(--header-background)] text-[var(--page-font-color)]"
                    : "bg-[var(--header-background)] text-[var(--page-font-color)] hover:opacity-80"
                } transition-colors duration-200 focus:outline-none`}
              >
                <div className="flex justify-between items-center">
                  <span className="flex-1">{answer}</span>
                  {showAnswer &&
                    (index === correctAnswerIndex ? (
                      <Check className="w-5 h-5 text-green-600 ml-2 shrink-0" />
                    ) : selectedAnswer === index ? (
                      <X className="w-5 h-5 text-[#ff9999] ml-2 shrink-0" />
                    ) : null)}
                </div>
              </button>
            ))}
          </div>

          {showAnswer && (
            <div className="mt-8 space-y-6">
              <div className="bg-[var(--header-background)] p-4 rounded-lg border border-[var(--buttons-background-color)]">
                <h3 className="font-semibold text-[var(--page-font-color)] mb-2">
                  הסבר:
                </h3>
                <p className="text-[var(--header-text-color)]">
                  {shuffledQuestions[currentQuestion].explanation}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={nextQuestion}
                  className="bg-[var(--buttons-background-color)] text-[var(--buttons-color)] px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  {currentQuestion + 1 === shuffledQuestions.length
                    ? "סיים"
                    : "הבא"}
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;