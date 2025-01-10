import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button, HomeButton } from "../components/Button";
import { Trophy, Star, Home } from "lucide-react";

interface LocationState {
  score: number;
}

const ScorePage: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // If no score in state, redirect to department home
  if (typeof state?.score !== "number") {
    navigate(`/${department}`);
    return null;
  }

  const score = state.score;

  const getMessage = (score: number): string => {
    if (score >= 90) return "מעולה! שליטה מרשימה בחומר!";
    if (score >= 80) return "כל הכבוד! תוצאה מצויינת!";
    if (score >= 70) return "עבודה טובה! קרוב למצויין!";
    if (score >= 60) return "לא רע! יש מקום לשיפור";
    return "המשך להתאמן, אתה יכול להשתפר!";
  };

  const getIcon = (score: number): JSX.Element => {
    if (score >= 80) return <Trophy className="score-icon trophy" />;
    if (score >= 60) return <Star className="score-icon star" />;
    return <Trophy className="score-icon default" />;
  };

  const handleHome = () => {
    navigate(`/${department}`);
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
          <div className="text-6xl font-bold text-[#103C6E] transform transition-transform duration-200">
            {score}
          </div>
          <div className="text-sm text-[var(--header-text-color)]">נקודות</div>
        </div>

        <div className="w-full h-4 bg-[var(--header-background)] rounded-full p-1 border border-[var(--border-color)]">
          <div
            className="h-full bg-[#103C6E] rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${score}%`,
              boxShadow: "0 0 8px #103C6E",
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

        <HomeButton
          onClick={handleHome}
          text="חזור לתפריט הראשי"
          className="w-full text-white flex items-center justify-center gap-2 transform hover:opacity-80 transition-all duration-200 bg-[#103C6E] rounded-[15px] py-3 px-6"
        />
      </CardContent>
    </Card>
  );
};

export default ScorePage;
