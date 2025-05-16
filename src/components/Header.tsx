import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Book } from "lucide-react"; // For the Book icon
import { useTopics } from "../context/TopicsContext"; // For selectedTrainingTopic

interface HeaderProps {
  credit?: string;
  hospitalName?: string;
}

const Header: React.FC<HeaderProps> = ({ credit, hospitalName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTrainingTopic } = useTopics();

  // State for credit string, from company's header
  const [creditStr, setCreditStr] = useState<string>('');

  useEffect(() => {
    // Logic for setting credit string, from company's header
    if (credit) {
      setCreditStr(`הוכן בסיוע ${credit}`);
    } else {
      setCreditStr(''); // Clear if credit is not provided
    }
    // The `setLeftLogoUrl` and its usage with hospitalName from the original company
    // example was removed as `leftLogoUrl` was not used.
  }, [credit]);

  // Determine if we are on the training topic selection page
  const isTrainingTopicSelectionPage = location.pathname === '/training-topics';

  // Determine if a specific hospital logo should be shown (logic from company's `isSpecificHosptial`)
  const showHospitalLogo = hospitalName && hospitalName !== 'apps';

  // Centralized navigation function to go to the topic selection page
  const handleNavigateToTopicSelection = () => {
    navigate('/training-topics');
  };

  return (
    // Main header structure, applying Tailwind CSS classes for consistency with App.tsx
    // and dimensions/colors from your original header.
    <header className="w-full h-[50px] bg-[var(--header-background)] border border-[var(--border-color)] flex items-center px-3 font-helvetica">
      
      {/* Left Section: Mashlom Logo (Mimicking company's 15% width suggestion) */}
      <div className="flex justify-start items-center" style={{ width: '15%' }}>
        {/* Changed <a> to <button> for react-router navigation */}
        <button onClick={handleNavigateToTopicSelection} className="focus:outline-none" aria-label="Go to homepage">
          <img 
            src="public\assets\IconOnly_mashlomme.png" // Path from company's header
            alt="Mashlom Logo" 
            className="h-[42px] w-auto" // Adjusted for consistent height, auto width
          />
        </button>
      </div>

      {/* Center Section: Text Content (flex-1 to take remaining space) */}
      <div className="flex-1 text-[var(--header-text-color)] text-center">
        <span className="block font-semibold" style={{ fontSize: '15px' }}> {/* Font size from company */}
          mashlom.me - כלי עזר לצוותי רפואה {/* Text from company */}
        </span>
        {/* Display selected training topic name (from your original header) */}
        {selectedTrainingTopic && !isTrainingTopicSelectionPage && (
          <div className="text-[11px] opacity-70 mt-0.5">
            {selectedTrainingTopic.name}
          </div>
        )}
        {/* Display credit string if available */}
        {creditStr && (
          <span className="block opacity-80" style={{ fontSize: '10px' }}> {/* Font size from company */}
            {creditStr}
          </span>
        )}
      </div>

      {/* Right Section: Hospital Logo or Book Icon (Mimicking company's 15% width suggestion) */}
      <div className="flex justify-end items-center" style={{ width: '15%' }}>
        {showHospitalLogo ? (
          // Display hospital logo if specified
          // Changed <a> to <button> for react-router navigation
          <button onClick={handleNavigateToTopicSelection} className="focus:outline-none" aria-label={`Go to ${hospitalName} page`}>
            {/* Replaced custom <Image> component with <img> */}
            <img
              src={`/${hospitalName}/logo.png`} // Dynamic src from company's logic
              alt={`${hospitalName} Logo`}
              className="h-[42px] w-auto mb-[2px]" // Consistent height, margin from company's example
            />
          </button>
        ) : !isTrainingTopicSelectionPage ? (
          // Display Book icon (from your original header) if not on selection page and no hospital logo
          <button 
            onClick={handleNavigateToTopicSelection}
            className="w-[42px] h-[42px] flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="בחר נושא אימון"
          >
            <Book className="w-5 h-5 text-[var(--header-text-color)]" />
          </button>
        ) : (
          // Placeholder to maintain layout balance if nothing else is shown on the right
          // The w-[15%] on the parent div already gives width.
          // This div helps ensure consistent height if needed for alignment.
          <div className="h-[42px] w-[42px]" /> // Ensure it takes up similar space to the icon/logo
        )}
      </div>
    </header>
  );
};

export default Header;