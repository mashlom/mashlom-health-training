import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button, HomeButton } from "../components/Button";
import { Check, X, ArrowLeft } from "lucide-react";
import quizData from "../data/quizData.json";
import { getConfig } from "../config/env";
// Remove the quizData import since we'll fetch from API

interface Question {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

declare global {
  interface Window {
    toggleDataSource?: (useMongo: boolean) => void;
    getCurrentDataSource?: () => string;
  }
}

const QuizPage: React.FC = () => {
  const { department, topicId } = useParams<{
    department: string;
    topicId: string;
  }>();
  const navigate = useNavigate();
  const config = getConfig();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const [useMongoDB, setUseMongoDB] = useState<boolean>(() => {
    try {
      const storedValue = localStorage.getItem("useMongoDBSource");
      return storedValue === "true";
    } catch {
      return false;
    }
  });

  // Define window functions type
  interface CustomWindow extends Window {
    toggleDataSource: (useMongo: boolean) => void;
    getCurrentDataSource: () => string;
  }

  // Setup window functions immediately when component mounts
  useEffect(() => {
    // Explicitly declare window with custom interface
    const customWindow = window as unknown as CustomWindow;

    // Define the functions
    customWindow.toggleDataSource = (useMongo: boolean) => {
      setUseMongoDB(useMongo);
      try {
        localStorage.setItem("useMongoDBSource", String(useMongo));
      } catch (error) {
        console.error("LocalStorage error:", error);
      }
      console.log(`Using ${useMongo ? "MongoDB" : "JSON"} data source`);
    };

    customWindow.getCurrentDataSource = () => {
      return useMongoDB ? "MongoDB" : "JSON";
    };

    // Cleanup
    return () => {
      try {
        delete (customWindow as any).toggleDataSource;
        delete (customWindow as any).getCurrentDataSource;
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };
  }, [useMongoDB]); // Include useMongoDB in dependencies

  const fetchQuestions = async () => {
    try {
      let questionsToUse: Question[] = [];

      if (useMongoDB) {
        const baseUrl = config.REACT_APP_API_BASE_URL;
        const endpoint = topicId === "random" ? "random" : `topics/${topicId}`;
        const response = await fetch(`${baseUrl}/api/trainings/${endpoint}`);
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching questions:", data);
          return;
        }

        questionsToUse = topicId === "random" ? data : data.questions;
      } else {
        if (topicId === "random") {
          const allQuestions = quizData.quizTopics.reduce<Question[]>(
            (acc, topic) => [...acc, ...topic.questions],
            []
          );
          questionsToUse = [...allQuestions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
        } else {
          const topic = quizData.quizTopics.find((t) => t.id === topicId);
          if (!topic) {
            navigate(`/${department}`);
            return;
          }
          questionsToUse = topic.questions;
        }
      }

      if (questionsToUse?.length > 0) {
        setShuffledQuestions(
          [...questionsToUse].sort(() => 0.5 - Math.random())
        );
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topicId, useMongoDB]);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const currentQ = shuffledQuestions[currentQuestion];
      const answersWithIndices = currentQ.answers.map((answer, index) => ({
        text: answer,
        isCorrect: index === currentQ.correct,
      }));

      const shuffled = [...answersWithIndices].sort(() => Math.random() - 0.5);
      setCorrectAnswerIndex(shuffled.findIndex((answer) => answer.isCorrect));
      setShuffledAnswers(shuffled.map((answer) => answer.text));
    }
  }, [currentQuestion, shuffledQuestions]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (index === correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      navigate(`/${department}/quiz/${topicId}/finish`, {
        state: { score: Math.round((score / shuffledQuestions.length) * 100) },
      });
    }
  };

  const handleHome = () => {
    navigate(`/${department}`);
  };

  if (shuffledQuestions.length === 0 || !shuffledAnswers.length) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="overflow-hidden">
        <div id="question-header" className="bg-[var(--page-font-color)] p-1">
          <div className="flex justify-between items-center flex-row px-5">
            <div className="text-sm font-medium text-white">
              שאלה {currentQuestion + 1} מתוך {shuffledQuestions.length}
            </div>
            <HomeButton
              onClick={handleHome}
              className="flex items-center justify-center gap-2 p-2 text-white hover:text-gray-200 transition-colors duration-200"
              text="חזרה לעמוד השאלות"
            />
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
                className={`w-full min-h-[3.5rem] px-4 py-3 text-right rounded-lg border ${
                  showAnswer
                    ? index === correctAnswerIndex
                      ? "bg-green-100 border-green-300 text-[var(--page-font-color)]"
                      : selectedAnswer === index
                      ? "bg-[#fff0f0] border-[#ff9999] text-[var(--page-font-color)]"
                      : "bg-white border-gray-200 text-[var(--page-font-color)] opacity-50"
                    : "bg-white border-gray-200 text-[var(--page-font-color)] hover:bg-gray-50"
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
              <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                <h3 className="font-semibold text-[var(--page-font-color)] mb-2">
                  הסבר:
                </h3>
                <p className="text-[var(--header-text-color)]">
                  {shuffledQuestions[currentQuestion].explanation}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-[var(--page-font-color)] text-[var(--buttons-color)] px-6 py-2 rounded-lg flex items-center gap-2"
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
