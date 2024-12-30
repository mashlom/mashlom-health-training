import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Home, ArrowRight, Award, Check, X } from "lucide-react";
import "./commoncss/global.css";

const pulmonaryQuestions = [
  {
    question:
      "בכמה אחוז מהמטופלים לא קיימת דיספניאה (הסימפטום השכיח ביותר בהקשר של PE)?",
    answers: ["7", "12", "18", "25"],
    correct: 1,
    explanation:
      "ב-12% מהמטופלים לא קיימת דיספניאה, למרות שזהו הסימפטום השכיח ביותר ב-PE",
  },
  {
    question: "קריש דם במי מהבאים יחשב ל-superficial thrombosis?",
    answers: [
      "short saphenous",
      "anterior tibial",
      "posterior tibial",
      "peroneal veins",
    ],
    correct: 0,
    explanation:
      "ה-short saphenous נחשב לוריד שטחי, ולכן קריש בו יחשב ל-superficial thrombosis",
  },
  {
    question:
      "בדיקת D DIMER למטופל עם סבירות נמוכה ל-intravascular thrombus, היא בעלת רגישות גבוהה ביותר ל:",
    answers: [
      "proximal DVT",
      "distal DVT",
      "PE",
      "אין הבדל ברגישות בהתייחס לסעיפים הנ״ל",
    ],
    correct: 3,
    explanation:
      "בדיקת D-DIMER היא בעלת רגישות דומה לכל סוגי הקרישים התוך-ורידיים",
  },
  {
    question:
      "איזו בדיקה מהבאות הכי מדוייקת לצורך הערכת DVT ב-pelvic veins and IVC?",
    answers: ["CT V", "US", "MRI", "תשובות א+ג מדוייקות באותה המידה"],
    correct: 3,
    explanation: "CT ו-MRI שניהם מדוייקים באותה המידה להערכת DVT באגן וב-IVC",
  },
];

const mechanicalVentilationQuestions = [
  {
    question:
      "מה נכון לגבי ההבדלים הפיזיולוגים בין נשימה ספונטנית, להנשמה בלחץ חיובי?",
    answers: [
      "אין הבדל בהפרש הלחצים בין חדר שמאל לאבי העורקים בשני סוגי ההנשמות",
      "בנשימה ספונטנית, הפרש הלחצים בין חדר שמאל לאבי העורקים, גדול יותר מהפרש הלחצים בין חדר שמאל לאבי העורקים בזמן הנשמה בלחץ חיובי",
      "בנשימה ספונטנית, הפרש הלחצים בין חדר שמאל לאבי העורקים, קטן יותר מהפרש הלחצים בין חדר שמאל לאבי העורקים בזמן הנשמה בלחץ חיובי",
      "בזמן הנשמה בלחץ חיובי ישנה עלייה בתפוקת הלב",
    ],
    correct: 2,
    explanation:
      "בנשימה ספונטנית, הפרש הלחצים בין חדר שמאל לאבי העורקים קטן יותר מאשר בזמן הנשמה בלחץ חיובי",
  },
  {
    question: "מה הכוונה במונח inspiratory flow rate?",
    answers: [
      "כמות הנשימות/הנשמות בזמן מסויים",
      "משך הנשימה בזמן אינספיריום",
      "מהירות זרימת האוויר במערכת ההנשמה",
      "זהו מונח המתקיים רק בזמן הנשמה במצב של volume-controlled ventilation",
    ],
    correct: 2,
    explanation:
      "inspiratory flow rate מתייחס למהירות זרימת האוויר במערכת ההנשמה",
  },
  {
    question: "מה מהבאים נכון?",
    answers: [
      "בזמן הנשמה ב-Pressure-controlled ventilation ה-inspiratory flow rate נשאר קבוע",
      "בזמן הנשמה ב-volume-controlled ventilation ה-end-inspiratory alveolar pressure נשאר קבוע",
      "לחולה ARDS מורדם ומונשם, מומלצת הנשמה מסוג Pressure-controlled ventilation",
      "לחולה עם salicylate toxicity מורדם ומונשם, מומלצת הנשמה מסוג Pressure-controlled ventilation",
    ],
    correct: 2,
    explanation:
      "לחולי ARDS, הנשמה מסוג Pressure-controlled ventilation מומלצת יותר",
  },
  {
    question: "הנשמת מטופל במנשם הנמצא במצב של Assist-control. מה נכון?",
    answers: [
      "הנשימה הספונטנית של המטופל תאפס מחדש את קצב ההנשמות של המנשם",
      "במצב של Assist-control קצב ההנשמות הוא קבוע, ואין תוספת או גריעה של מספר הנשמות, גם אם המטופל מנסה לנשום בכוחות עצמו",
      "Assist-control זהו מצב מנשם הבטוח לחולה עם סכנה לאיוורור יתר",
      "ה-Tidal volume תמיד קבוע במצב של Assist-control",
    ],
    correct: 1,
    explanation:
      "במצב Assist-control, קצב ההנשמות נשאר קבוע ללא תלות בנשימות הספונטניות של המטופל",
  },
  {
    question:
      "איזה פרמטר מהבאים אחראי על סיום מתן סיוע בהנשמה (end of inhalation) כאשר המנשם מכוון ל-Continuous Spontaneous Ventilation?",
    answers: ["Tidal volume", "inspiratory flow", "Target pressure", "PEEP"],
    correct: 1,
    explanation:
      "ה-inspiratory flow אחראי על סיום מתן סיוע בהנשמה במצב של Continuous Spontaneous Ventilation",
  },
  {
    question: "מה נכון בהתייחס ל-Positive End-Expiratory Pressure?",
    answers: [
      "מקטין את ה-shunt הקיים בריאות",
      "מקטין את הנפח המת הקיים בריאות",
      "מקטין את ה-FRC",
      "מגדיל את ההחזר הורידי אל העלייה הימנית",
    ],
    correct: 0,
    explanation: "PEEP מקטין את ה-shunt הקיים בריאות",
  },
  {
    question:
      "בהסתמך על מחקרים, מה נכון בהתייחס להנשמה לא פולשנית מסוג NPPV אצל חולים עם דלקת ריאות?",
    answers: [
      "NPPV אצל חולים עם דלקת ריאות, הוכחה כיעילה",
      "הנשמה NPPV ממושכת, מפחיתה את הצורך באינטובציה אצל חולים עם דלקת ריאות",
      "הנשמה מסוג NPPV אינה מומלצת בשום שלב כחלק מהטיפול אצל חולה עם דלקת ריאות",
      "אם ישנו כשלון טיפולי באמצעות NPPV אצל חולה עם דלקת ריאות, מומלץ לבצע אינטובציה מוקדם ככל הניתן",
    ],
    correct: 1,
    explanation:
      "הנשמה NPPV ממושכת יכולה להפחית את הצורך באינטובציה אצל חולים עם דלקת ריאות",
  },
  {
    question:
      "מה הנכון לגבי ROX index אצל מטופל המונשם באמצעות High-Flow Nasal Cannula, ועם הערכים הבאים: RR - 25, SPO2 - 97%, FIO2 - 50%?",
    answers: [
      "מומלץ לבדוק ROX לאחר כשעה עם הנשמה באמצעות HFNC",
      "למטופל זה קיים סיכוי גבוה לכישלון באמצעות HFNC",
      "למטופל זה קיים סיכוי נמוך לכישלון באמצעות HFNC",
      "חסרים נתונים בשאלה בכדי לקבוע מהו ה-ROX index",
    ],
    correct: 2,
    explanation:
      "עם הערכים הנתונים, למטופל קיים סיכוי נמוך לכישלון באמצעות HFNC",
  },
  {
    question:
      "ביצעת אינטובציה, וחיברת מטופל למכונת הנשמה. המכונה החלה לצפצף, ולסמן HIGH PIP אולם Pplat בגדר הנורמה. מה הכי סביר באבחנה מבדלת?",
    answers: [
      "bronchospasm",
      "Pneumothorax",
      "Abdominal distention",
      "Inadequate sedation",
    ],
    correct: 0,
    explanation:
      "bronchospasm (התכווצות סימפונות) הוא הגורם הסביר ביותר במצב זה",
  },
  {
    question:
      "ביצעת אינטובציה, וחיברת מטופל למכונת הנשמה. המכונה החלה לצפצף. שמת לב כי המטופל איננו יציב המודינמית והסטורציה במגמת ירידה. מה הדבר הראשון אשר תעשה?",
    answers: [
      "אשתק את המטופל",
      "אעמיק את הסדציה",
      "אנתק את המכונה ואנשים עם אמבו",
      "אבצע POCUS",
    ],
    correct: 2,
    explanation: "הפעולה הראשונה היא לנתק את המכונה ולהנשים את המטופל עם אמבו",
  },
];

const HomeButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="outline"
    className="fixed top-4 left-4 flex items-center gap-2 bottom-menu-color"
  >
    <Home className="w-4 h-4" />
    דף הבית
  </Button>
);

const HomePage = ({ onTopicSelect }) => (
  <Card className="max-w-lg mx-auto mt-8 p-6">
    <CardContent className="space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6">בחר נושא</h1>
      <div className="space-y-4">
        <Button
          className="w-full text-lg"
          onClick={() => onTopicSelect("pulmonaryQuestions")}
        >
          תסחיף ריאתי ופקקת ורידים עמוקה
        </Button>
        <Button
          className="w-full text-lg"
          onClick={() => onTopicSelect("mechanicalVentilationQuestions")}
        >
          אוורור מכני ותמיכה אוורור לא פולשני
        </Button>
      </div>
    </CardContent>
  </Card>
);

const QuizPage = ({ questions, onComplete, onHome }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      onComplete(Math.round((score / questions.length) * 100));
    }
  };

  return (
    <>
      <HomeButton onClick={onHome} />
      <Card className="max-w-2xl mx-auto mt-8 p-6">
        <CardContent className="space-y-4">
          <div className="text-sm mb-4">
            שאלה {currentQuestion + 1} מתוך {questions.length}
          </div>
          <h2 className="text-xl font-semibold mb-4">
            {questions[currentQuestion].question}
          </h2>
          <div className="space-y-3">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Button
                key={index}
                className={`w-full text-right justify-between ${
                  showAnswer
                    ? index === questions[currentQuestion].correct
                      ? "bg-green-500 hover:bg-green-600"
                      : selectedAnswer === index
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                    : ""
                }`}
                onClick={() => !showAnswer && handleAnswer(index)}
                disabled={showAnswer}
              >
                <span>{answer}</span>
                {showAnswer &&
                  (index === questions[currentQuestion].correct ? (
                    <Check className="w-5 h-5" />
                  ) : selectedAnswer === index ? (
                    <X className="w-5 h-5" />
                  ) : null)}
              </Button>
            ))}
          </div>
          {showAnswer && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">הסבר:</h3>
                <p>{questions[currentQuestion].explanation}</p>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={nextQuestion}
                  className="flex items-center gap-2"
                >
                  {currentQuestion + 1 === questions.length ? "סיים" : "הבא"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const ScorePage = ({ score, onRestart, onHome }) => (
  <Card className="max-w-lg mx-auto mt-8 p-6 text-center">
    <CardContent className="space-y-6">
      <Award className="w-16 h-16 mx-auto text-yellow-500" />
      <h1 className="text-3xl font-bold">ציון סופי</h1>
      <p className="text-4xl font-bold text-primary">{score}</p>
      <Button onClick={onRestart} className="flex items-center gap-2 mx-auto">
        <Home className="w-4 h-4" />
        התחל מחדש
      </Button>
    </CardContent>
  </Card>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [quizType, setQuizType] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  const handleTopicSelect = (topic) => {
    setQuizType(topic);
    setCurrentPage("quiz");
  };

  const handleQuizComplete = (score) => {
    setFinalScore(score);
    setCurrentPage("score");
  };

  const handleRestart = () => {
    setCurrentPage("home");
    setQuizType(null);
    setFinalScore(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-[700px] mx-auto">
      {/* Header */}
      <header className="header w-full flex justify-between items-center">
        <img
          src="/assets/emek_logo.png"
          alt="Mashlom Logo"
          className="header-mashlom-logo"
        />
        <span className="header-text">mashlom.me - כלי עזר לצוות רפואה</span>
        <img
          src="/assets/IconOnly_mashlomme.png"
          alt="Emek Logo"
          className="header-emek-logo"
        />
      </header>

      {/* Main Content */}
      <main className="main-content w-full flex-grow">
        <div dir="rtl">
          {currentPage === "home" && (
            <HomePage onTopicSelect={handleTopicSelect} />
          )}
          {currentPage === "quiz" && (
            <QuizPage
              questions={
                quizType === "pulmonaryQuestions"
                  ? pulmonaryQuestions
                  : mechanicalVentilationQuestions
              }
              onComplete={handleQuizComplete}
              onHome={handleRestart}
            />
          )}
          {currentPage === "score" && (
            <ScorePage
              score={finalScore}
              onRestart={handleRestart}
              onHome={handleRestart}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
