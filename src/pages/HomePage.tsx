import React, { useState, useEffect } from "react";
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
  order?: number; // Add order field to the interface
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
  
  // Parse current page from the URL
  useEffect(() => {
    // Custom parsing for HashRouter
    let pageParam = null;
    
    // Try to get from search params first
    const searchParams = new URLSearchParams(location.search);
    pageParam = searchParams.get("page");
    
    // If not found in search, try to parse from hash
    if (!pageParam && location.hash.includes("?")) {
      const hashParts = location.hash.split("?");
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        pageParam = hashParams.get("page");
      }
    }
    
    // Try to extract from full URL as a last resort
    if (!pageParam) {
      const fullUrl = window.location.href;
      const pageMatch = fullUrl.match(/[?&]page=(\d+)/);
      if (pageMatch && pageMatch[1]) {
        pageParam = pageMatch[1];
      }
    }
    
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (!isNaN(parsedPage) && parsedPage !== currentPage) {
        setCurrentPage(parsedPage);
      }
    }
  }, [location, currentPage]);

  // Load training topic ID from URL if available
  useEffect(() => {
    if (trainingTopicId && (!selectedTrainingTopic || selectedTrainingTopic.id !== trainingTopicId)) {
      // If we have a trainingTopicId in the URL but it doesn't match the selected training topic,
      // we need to fetch training topic details and update the context
      // For now, just update with minimal info - the full data will be fetched by other effects
      setSelectedTrainingTopic({ id: trainingTopicId, name: selectedTrainingTopic?.name || "Loading..." });
    }
  }, [trainingTopicId, selectedTrainingTopic, setSelectedTrainingTopic]);

  // Redirect to training topic selection if no training topic is selected and no trainingTopicId in URL
  useEffect(() => {
    if (!loading && !selectedTrainingTopic && !trainingTopicId) {
      // Only redirect if not already on the training topic selection page
      if (!window.location.href.includes('/training-topics')) {
        navigate('/training-topics');
      }
    }
  }, [loading, selectedTrainingTopic, trainingTopicId, navigate]);
  
  // Process topics to ensure they have required properties
  const processedTopics = topics.map((topic: Topic) => ({
    ...topic,
    id: topic.id || topic._id, // Ensure id is available
    _id: topic._id || topic.id, // Ensure _id is available
    title: topic.title || topic.name, // Use name as fallback for title
    order: topic.order || 0, // Ensure order has a default value of 0
  }));
  
  // Filter topics based on search term
  const filteredTopics = searchTerm 
    ? processedTopics.filter(topic => 
        (topic.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : processedTopics;
  
  // Sort topics by order field
  const sortedTestTopics = [...filteredTopics].sort((a, b) => {
    // Sort by order field (default to 0 if not present)
    return (a.order || 0) - (b.order || 0);
  });
  
  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm && currentPage !== 1) {
      setCurrentPage(1);
      // Use training-topic-specific route if trainingTopicId is available
      if (trainingTopicId) {
        navigate(`/training-topic/${trainingTopicId}?page=1`);
      }
    }
  }, [searchTerm, trainingTopicId, navigate, currentPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedTestTopics.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = sortedTestTopics.slice(startIndex, endIndex);
  
  // Fill remaining slots with empty topics
  const filledTopics: (Topic | EmptyTopic)[] = [...currentTopics];
  while (filledTopics.length < ITEMS_PER_PAGE) {
    filledTopics.push({
      id: `empty-${currentPage}-${filledTopics.length}`,
      isEmpty: true,
    });
  }
  
  // Navigation handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      
      try {
        // Update hash manually, preserving the pathname part
        // Use training-topic-specific route if trainingTopicId is available
        if (trainingTopicId) {
          const newUrl = `#/training-topic/${trainingTopicId}?page=${nextPage}`;
          window.location.hash = newUrl;
        }
        
        // Also update the state directly to ensure UI updates
        setCurrentPage(nextPage);
      } catch (error) {
        // Fall back to navigate if hash manipulation fails
        if (trainingTopicId) {
          navigate(`/training-topic/${trainingTopicId}?page=${nextPage}`);
        }
        setCurrentPage(nextPage);
      }
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      
      try {
        // Update hash manually, preserving the pathname part
        // Use training-topic-specific route if trainingTopicId is available
        if (trainingTopicId) {
          const newUrl = `#/training-topic/${trainingTopicId}?page=${prevPage}`;
          window.location.hash = newUrl;
        }
        
        // Also update the state directly to ensure UI updates
        setCurrentPage(prevPage);
      } catch (error) {
        // Fall back to navigate if hash manipulation fails
        if (trainingTopicId) {
          navigate(`/training-topic/${trainingTopicId}?page=${prevPage}`);
        }
        setCurrentPage(prevPage);
      }
    }
  };
  
  const handleTopicSelect = (topicId: string) => {
    // Make sure we have a valid trainingTopicId before navigating
    const currentTrainingTopicId = trainingTopicId || selectedTrainingTopic?.id;
    
    if (currentTrainingTopicId) {
      // Navigate directly to the test page with the correct IDs
      navigate(`/training-topic/${currentTrainingTopicId}/test/${topicId}`);
    } else {
      // If no training topic ID is available (which shouldn't happen), redirect to training topics
      navigate('/training-topics');
    }
  };

  const handleChangeTrainingTopic = () => {
    navigate('/training-topics');
  };
  
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // If no training topic selected, we can just return null as the useEffect will redirect
  if (!selectedTrainingTopic) {
    return null;
  }
  
  return (
    <Card className="max-w-lg mx-auto mt-4 mb-4 border-[var(--border-color)]">
      <CardContent className={`p-4 flex flex-col ${CONTENT_HEIGHT}`}>
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-center mb-2 text-[var(--page-font-color)]">
            {selectedTrainingTopic.name}
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
            // Check if this is an empty placeholder
            if ("isEmpty" in topic) {
              return sortedTestTopics.length > 0 ? (
                <Button
                  key={`${currentPage}-empty-${index}`}
                  className={`w-full text-sm transition-all duration-300 ${BUTTON_HEIGHT} opacity-0 pointer-events-none`}
                >
                  {/* Empty placeholder */}
                </Button>
              ) : null;
            }
            
            // Regular topic button with order info for debugging (optional)
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
        {sortedTestTopics.length > ITEMS_PER_PAGE && (
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
                עמוד {currentPage} מתוך {totalPages || 1}
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