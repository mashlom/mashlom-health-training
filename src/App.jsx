import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Home, Check, X, ArrowLeft, Trophy, Star } from "lucide-react";
import "./commoncss/global.css";
import quizData from "./data/quizData.json";

const HomeButton = ({ onClick, text = "" }) => (
  <Button
    onClick={onClick}
    className="flex items-center gap-2 bg-[var(--buttons-background-color)] text-[var(--buttons-color)] transition-all duration-300"
  >
    <Home className="w-4 h-4" />
    {text && <span>{text}</span>}
  </Button>
);

const HomePage = ({ onTopicSelect }) => (
  <Card className="max-w-lg mx-auto mt-8 p-6 bg-[var(--page-background-color)] border-[var(--border-color)]">
    <CardContent className="space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-[var(--page-font-color)]">
        שאלות הכנה למבחנים ברפואה דחופה
      </h1>

      <div className="text-l text-center mb-6 text-[var(--page-font-color)]">
        שאלות הכנה לשלב א ברפואה דחופה ע"פ, th10 edition edition Medicine
        Emergency s'Rosen
      </div>
      <div className="space-y-4">
        <Button
          className="w-full text-lg bg-[var(--buttons-background-color)] text-[var(--buttons-color)] transition-all duration-300"
          onClick={() => onTopicSelect("random")}
        >
          <div className="w-full text-center" dir="ltr">
            שאלות על כל החומר
          </div>
        </Button>
        {quizData.quizTopics.map((topic) => (
          <Button
            key={topic.id}
            className="w-full text-lg bg-[var(--buttons-background-color)] text-[var(--buttons-color)] transition-all duration-300"
            onClick={() => onTopicSelect(topic.id)}
          >
            <div className="w-full text-center" dir="ltr">
              {topic.title}
            </div>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuizPage = ({ questions, onComplete, onHome }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledQuestions(shuffleArray(questions));
  }, [questions]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (index === shuffledQuestions[currentQuestion].correct) {
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

  if (shuffledQuestions.length === 0) return null;

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
            {shuffledQuestions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => !showAnswer && handleAnswer(index)}
                disabled={showAnswer}
                className={`w-full min-h-[3.5rem] px-4 py-3 text-right rounded-lg border border-[var(--border-color)] ${
                  showAnswer
                    ? index === shuffledQuestions[currentQuestion].correct
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
                    (index === shuffledQuestions[currentQuestion].correct ? (
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

const ScorePage = ({ score, onHome }) => {
  const getMessage = (score) => {
    if (score >= 90) return "מעולה! שליטה מרשימה בחומר!";
    if (score >= 80) return "כל הכבוד! תוצאה מצויינת!";
    if (score >= 70) return "עבודה טובה! קרוב למצויין!";
    if (score >= 60) return "לא רע! יש מקום לשיפור";
    return "המשך להתאמן, אתה יכול להשתפר!";
  };

  const getIcon = (score) => {
    if (score >= 80) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (score >= 60) return <Star className="w-8 h-8 text-blue-500" />;
    return (
      <Trophy className="w-8 h-8 text-[var(--buttons-background-color)]" />
    );
  };

  return (
    <Card className="max-w-lg mx-auto mt-8 bg-[var(--page-background-color)]">
      <CardContent className="p-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--header-background)] border-4 border-[var(--border-color)] flex items-center justify-center shadow-lg transform transition-transform duration-200">
            {getIcon(score)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-6xl font-bold text-[var(--buttons-background-color)] transform transition-transform duration-200">
            {score}
          </div>
          <div className="text-sm text-[var(--header-text-color)]">נקודות</div>
        </div>

        <div className="w-full h-4 bg-[var(--header-background)] rounded-full p-1 border border-[var(--border-color)]">
          <div
            className="h-full bg-[var(--buttons-background-color)] rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${score}%`,
              boxShadow: "0 0 8px var(--buttons-background-color)",
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-[var(--header-text-color)] px-1">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>

        <div className="text-lg font-semibold text-[var(--page-font-color)] bg-[var(--header-background)] p-4 rounded-lg border border-[var(--border-color)] shadow-md">
          {getMessage(score)}
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <HomeButton
            onClick={onHome}
            text="חזור לתפריט"
            className="transform hover:scale-105 transition-transform duration-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(null);

  const handleTopicSelect = (topicId) => {
    if (topicId === "random") {
      // Get all questions from all topics
      const allQuestions = quizData.quizTopics.reduce((acc, topic) => {
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
    setCurrentPage("quiz");
  };

  const handleQuizComplete = (score) => {
    setFinalScore(score);
    setCurrentPage("score");
  };

  const handleRestart = () => {
    setCurrentPage("home");
    setCurrentQuestions([]);
    setFinalScore(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-[700px] mx-auto">
      <header className="w-full h-[50px] bg-[var(--header-background)] border border-[var(--border-color)] flex justify-between items-center">
        <img
          src="/assets/IconOnly_mashlomme.png"
          alt="Emek Logo"
          className="h-[42px] w-[80px] rounded-[50px] object-contain"
        />
        <span className="flex-1 text-[var(--header-text-color)] text-center font-semibold text-[13px] font-helvetica">
          mashlom.me - כלי עזר לצוות רפואה
        </span>
        <div className="w-[80px]" />
      </header>

      <main className="w-full flex-grow bg-[var(--main-content-background-color)] border border-[var(--border-color)] overflow-y-auto text-center h-[calc(92dvh-45px)]">
        <div dir="rtl">
          {currentPage === "home" && (
            <HomePage onTopicSelect={handleTopicSelect} />
          )}
          {currentPage === "quiz" && currentQuestions.length > 0 && (
            <QuizPage
              questions={currentQuestions}
              onComplete={handleQuizComplete}
              onHome={handleRestart}
            />
          )}
          {currentPage === "score" && (
            <ScorePage score={finalScore} onHome={handleRestart} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
