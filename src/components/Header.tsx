import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Book } from "lucide-react";
import { useTopics } from "../context/TopicsContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTrainingTopic } = useTopics();
  
  // Check if we're on the training-topic selection page or root
  const isTrainingTopicSelectionPage = location.pathname === '/training-topics';

  // Function to navigate back to training-topic selection
  const handleTrainingTopicClick = () => {
    // Always navigate to root
    navigate('/training-topics');
  };

  return (
    <header className="w-full h-[50px] bg-[var(--header-background)] border border-[var(--border-color)] flex justify-between items-center px-3">
      <img
        src="/assets/IconOnly_mashlomme.png"
        alt="Emek Logo"
        className="h-[42px] w-[80px] rounded-[50px] object-contain"
      />
      
      <span className="flex-1 text-[var(--header-text-color)] text-center font-semibold text-[13px] font-helvetica">
        mashlom.me - כלי עזר לצוות רפואה
        {selectedTrainingTopic && !isTrainingTopicSelectionPage && (
          <div className="text-[11px] opacity-70 mt-1">
            {selectedTrainingTopic.name}
          </div>
        )}
      </span>
      
      {!isTrainingTopicSelectionPage && (
        <button 
          onClick={handleTrainingTopicClick}
          className="w-[42px] h-[42px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          title="בחר נושא אימון"
        >
          <Book className="w-5 h-5 text-[var(--header-text-color)]" />
        </button>
      )}
      {isTrainingTopicSelectionPage && <div className="w-[42px]" />}
    </header>
  );
};

export default Header;