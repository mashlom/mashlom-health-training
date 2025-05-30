import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button, HomeButton } from "../components/Button";
import { Trophy, Star } from "lucide-react";
import { useTopics } from "../context/TopicsContext";

interface LocationState {
  score: number;
}

const ScorePage: React.FC = () => {
  const { trainingTopicId } = useParams<{ trainingTopicId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTrainingTopic } = useTopics();
  const state = location.state as LocationState;

  // If no score in state, redirect to training topic home
  if (typeof state?.score !== "number") {
    // Use training-topic-specific route if trainingTopicId is available
    if (trainingTopicId) {
      navigate(`/training-topic/${trainingTopicId}`);
    } else if (selectedTrainingTopic) {
      // If we have a selected training topic but no trainingTopicId in URL, use the selected training topic's ID
      navigate(`/training-topic/${selectedTrainingTopic.id}`);
    } else {
      // Fallback to training topics page
      navigate('/training-topics');
    }
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
    // Use training-topic-specific route if trainingTopicId is available
    if (trainingTopicId) {
      navigate(`/training-topic/${trainingTopicId}`);
    } else if (selectedTrainingTopic) {
      // If we have a selected training topic but no trainingTopicId in URL, use the selected training topic's ID
      navigate(`/training-topic/${selectedTrainingTopic.id}`);
    } else {
      // Fallback to training topics page
      navigate('/training-topics');
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-8 ">
      <CardContent className="p-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--header-background)] border-4 border-[var(--border-color)] flex items-center justify-center shadow-lg transform transition-transform duration-200">
            {getIcon(score)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-6xl font-bold text-[var(--page-font-color)] transform transition-transform duration-200">
            {score}
          </div>
          <div className="text-sm text-[var(--header-text-color)]">נקודות</div>
        </div>

        <div className="w-full h-4 bg-[var(--header-background)] rounded-full p-1 border border-[var(--border-color)]">
          <div
            className="h-full bg-[var(--page-font-color)] rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${score}%`,
              boxShadow: "0 0 8px var(--page-font-color)",
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
          className="w-full text-white flex items-center justify-center gap-2 transform hover:opacity-80 transition-all duration-200 bg-[var(--page-font-color)] rounded-[15px] py-3 px-6"
        />
      </CardContent>
    </Card>
  );
};

export default ScorePage;