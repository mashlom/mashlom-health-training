import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { ChevronRight, ChevronLeft, BookOpen, Search } from "lucide-react";
import { useTopics } from "../context/TopicsContext";

// Constants remain the same
const ITEMS_PER_PAGE = 10;
const BUTTON_HEIGHT = "h-12";
const CONTENT_HEIGHT = "min-h-[90vh]";

interface Topic {
  id: string;
  _id?: string;
  name?: string;
  title?: string;
}

interface EmptyTopic {
  id: string;
  isEmpty: true;
}

const HomePage: React.FC = () => {
  const { trainingTopicId } = useParams<{ trainingTopicId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { topics, loading, selectedTrainingTopic, setSelectedTrainingTopic } = useTopics();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Effect to parse current page from the URL's search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    let targetPage = 1;

    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        targetPage = parsedPage;
      } else {
        // Invalid page param, navigate to page 1 to correct URL
        if (trainingTopicId) {
          navigate(`/training-topic/${trainingTopicId}?page=1`, { replace: true });
        }
        return; // Exit early, effect will re-run after navigation
      }
    }
    // If no pageParam, targetPage remains 1.
    // Optionally, enforce URL to show ?page=1 if not present:
    // else if (trainingTopicId && !location.search.includes('page=')) {
    //   navigate(`/training-topic/${trainingTopicId}?page=1`, { replace: true });
    //   return;
    // }


    if (currentPage !== targetPage) {
      setCurrentPage(targetPage);
    }
  }, [location.search, currentPage, trainingTopicId, navigate]);

  // Load training topic ID from URL if available
  useEffect(() => {
    if (trainingTopicId && (!selectedTrainingTopic || selectedTrainingTopic.id !== trainingTopicId)) {
      setSelectedTrainingTopic({ id: trainingTopicId, name: selectedTrainingTopic?.name || "Loading..." });
    }
  }, [trainingTopicId, selectedTrainingTopic, setSelectedTrainingTopic]);

  // Redirect to training topic selection if no training topic is selected and no trainingTopicId in URL
  useEffect(() => {
    if (!loading && !selectedTrainingTopic && !trainingTopicId) {
      if (!window.location.href.includes('/training-topics')) {
        navigate('/training-topics', { replace: true });
      }
    }
  }, [loading, selectedTrainingTopic, trainingTopicId, navigate]);
  
  const processedTopics = topics.map((topic: Topic) => ({
    ...topic,
    id: topic.id || topic._id,
    _id: topic._id || topic.id,
    title: topic.title || topic.name,
  }));
  
  const filteredTopics = searchTerm 
    ? processedTopics.filter(topic => 
        (topic.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : processedTopics;
  
  const sortedTestTopics = [...filteredTopics];
  
  // Reset to page 1 when search term changes, if not already on page 1
  useEffect(() => {
    if (searchTerm && currentPage !== 1) {
      if (trainingTopicId) {
        // Just navigate. The URL change will update currentPage via the effect above.
        navigate(`/training-topic/${trainingTopicId}?page=1`, { replace: true });
      }
    }
  }, [searchTerm, currentPage, trainingTopicId, navigate]);
  
  const totalPages = Math.max(1, Math.ceil(sortedTestTopics.length / ITEMS_PER_PAGE));
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = sortedTestTopics.slice(startIndex, endIndex);
  
  const filledTopics: (Topic | EmptyTopic)[] = [...currentTopics];
  while (filledTopics.length < ITEMS_PER_PAGE && sortedTestTopics.length > 0) { // Only fill if there are topics
    filledTopics.push({
      id: `empty-${currentPage}-${filledTopics.length}`,
      isEmpty: true,
    });
  }
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      if (trainingTopicId) {
        navigate(`/training-topic/${trainingTopicId}?page=${nextPage}`);
      }
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      if (trainingTopicId) {
        navigate(`/training-topic/${trainingTopicId}?page=${prevPage}`);
      }
    }
  };
  
  const handleTopicSelect = (topicId: string) => {
    const currentTrainingTopicId = trainingTopicId || selectedTrainingTopic?.id;
    if (currentTrainingTopicId) {
      navigate(`/training-topic/${currentTrainingTopicId}/test/${topicId}`);
    } else {
      navigate('/training-topics', { replace: true });
    }
  };

  const handleChangeTrainingTopic = () => {
    navigate('/training-topics');
  };
  
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!selectedTrainingTopic && trainingTopicId) { // Still loading selectedTrainingTopic info
    return <div className="text-center p-4">Loading training topic details...</div>;
  }
  
  if (!selectedTrainingTopic) { // Should be handled by redirect effect, but as a fallback
    return null; 
  }
  
  return (
    <Card className="max-w-lg mx-auto mt-4 mb-4 border-[var(--border-color)]">
      <CardContent className={`p-4 flex flex-col ${CONTENT_HEIGHT}`}>
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-center mb-2 text-[var(--page-font-color)]">
            {selectedTrainingTopic.name || "Loading..."}
          </h1>
          <div className="text-sm text-center mb-3 text-[var(--page-font-color)]">
            שאלות הכנה לשלב א ברפואה         
          </div>
          <div className="flex gap-2 mb-3">
            <Button
              className={`flex-1 text-base bg-[var(--page-font-color)] text-white transition-all duration-300 ${BUTTON_HEIGHT}`}
              onClick={() => handleTopicSelect("random")}
            >
              <div className="w-full text-right">שאלות על כל החומר</div>
            </Button>
            <Button
              className={`text-base bg-[var(--page-font-color)] text-white transition-all duration-300 ${BUTTON_HEIGHT} px-4`}
              onClick={handleChangeTrainingTopic}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>החלף נושא אימון</span>
              </div>
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--header-text-color)]" />
            </div>
            <input
              type="text"
              placeholder="חיפוש נושא..."
              className="block w-full pr-10 py-2 text-right rounded-md border border-[var(--border-color)] focus:ring-[var(--page-font-color)] focus:border-[var(--page-font-color)] text-[var(--page-font-color)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir="rtl"
            />
          </div>
        </div>
        
        {/* Topics Section */}
        <div className="flex-grow flex flex-col space-y-2">
          {sortedTestTopics.length === 0 && (
            <div className="text-center p-4 border border-dashed border-[var(--border-color)] rounded-md">
              <p className="text-[var(--page-font-color)]">
                {searchTerm ? "לא נמצאו נושאים התואמים את החיפוש" : "לא נמצאו נושאים"}
              </p>
              {searchTerm && (
                <button 
                  className="mt-2 text-sm underline text-[var(--page-font-color)]" 
                  onClick={() => setSearchTerm("")}
                >
                  נקה חיפוש
                </button>
              )}
            </div>
          )}
          
          {filledTopics.map((topic, index) => {
            if ("isEmpty" in topic) {
              return (
                <Button
                  key={`${currentPage}-empty-${index}`}
                  className={`w-full text-sm transition-all duration-300 ${BUTTON_HEIGHT} opacity-0 pointer-events-none`}
                >
                  {/* Empty placeholder */}
                </Button>
              );
            }
            
            return (
              <Button
                key={`${currentPage}-${topic.id || `topic-${index}`}`}
                className={`w-full text-sm transition-all duration-300 ${BUTTON_HEIGHT} bg-[var(--page-font-color)] text-white`}
                onClick={() => handleTopicSelect(topic.id)}
              >
                <div className="w-full px-2 overflow-hidden">
                  <div className="text-right line-clamp-2 leading-5">
                    <span style={{ direction: "ltr" }}>
                      {topic.title || topic.name || "Untitled Topic"}
                    </span>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && ( // Show pagination only if more than one page
          <div className="flex-none pt-3 mt-1 border-t border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={`bg-[var(--page-font-color)] text-white flex items-center gap-1 px-2 text-sm h-8 ${
                  currentPage <= 1 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <ChevronRight className="w-3 h-3" />
                הקודם
              </Button>
              <span className="text-sm text-[var(--page-font-color)]">
                עמוד {currentPage} מתוך {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={`bg-[var(--page-font-color)] text-white flex items-center gap-1 px-2 text-sm h-8 ${
                  currentPage >= totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                הבא
                <ChevronLeft className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomePage;