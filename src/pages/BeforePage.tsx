import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { getApiBaseUrl } from "../config/env";
import { useTopics } from "../context/TopicsContext";
import { Book, Search, RefreshCw, ChevronRight, ChevronLeft, Building } from "lucide-react";

interface TrainingTopic {
  id: string;
  name: string;
  hospitalName?: string;
  hospitalId?: string;
}

const BUTTON_HEIGHT = "h-12";
const CONTENT_HEIGHT = "min-h-[90vh]";
const ITEMS_PER_PAGE = 10;

const BeforePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedTrainingTopic } = useTopics();
  const [trainingTopics, setTrainingTopics] = useState<TrainingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Parse current page from the URL on initial load and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      setCurrentPage(page);
    } else {
      // If no page parameter is present, default to page 1
      setCurrentPage(1);
    }
  }, [location.search]);

  // Fetch training topics data
  useEffect(() => {
    const fetchTrainingTopics = async () => {
      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/trainingsAnonymous/training-topic`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch training topics');
        }

        const data = await response.json();
        setTrainingTopics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setTrainingTopics([]);
      } finally {
        setLoading(false);
      }
    };

    // Clear any previously selected training topic when visiting this page
    setSelectedTrainingTopic(null);
    
    // Fetch the list of available training topics
    fetchTrainingTopics();
  }, [setSelectedTrainingTopic]);

  // Filter training topics based on search term (search in both training topic name and hospital name)
  const filteredTrainingTopics = trainingTopics.filter(trainingTopic => 
    trainingTopic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trainingTopic.hospitalName && trainingTopic.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm && currentPage !== 1) {
      setCurrentPage(1);
      updateUrlWithPage(1);
    }
  }, [searchTerm]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredTrainingTopics.length / ITEMS_PER_PAGE));
  
  // Get training topics for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrainingTopics = filteredTrainingTopics.slice(startIndex, endIndex);
  
  // Fill remaining slots with empty training topics if needed
  const filledTrainingTopics: (TrainingTopic | { id: string; isEmpty: true })[] = [...currentTrainingTopics];
  while (filledTrainingTopics.length < ITEMS_PER_PAGE) {
    filledTrainingTopics.push({
      id: `empty-${currentPage}-${filledTrainingTopics.length}`,
      isEmpty: true,
    });
  }

  // Function to update URL with the page number
  const updateUrlWithPage = (page: number) => {
    const path = `/training-topics`;
    
    // Always include the page parameter for consistency
    navigate(`${path}?page=${page}`, { replace: true });
  };

  const handleTrainingTopicSelect = (trainingTopicId: string, trainingTopicName: string) => {
    // Update the selected training topic in context with both ID and name
    setSelectedTrainingTopic({ id: trainingTopicId, name: trainingTopicName });
    
    // Navigate to the new training-topic-specific route
    navigate(`/training-topic/${trainingTopicId}`);
  };

  // Navigation handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateUrlWithPage(nextPage);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      updateUrlWithPage(prevPage);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <RefreshCw className="w-8 h-8 text-[var(--page-font-color)] mx-auto animate-spin" />
        <p className="mt-4 text-[var(--page-font-color)]">טוען נושאי אימון...</p>
      </div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto mt-4 mb-4 border-[var(--border-color)]">
      <CardContent className={`p-4 flex flex-col ${CONTENT_HEIGHT}`}>
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-xl font-bold text-center text-[var(--page-font-color)]">
              בחר נושא אימון
            </h1>
          </div>
          <div className="text-sm text-center mb-4 text-[var(--page-font-color)]">
            אנא בחר נושא אימון מהרשימה שלהלן
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--header-text-color)]" />
            </div>
            <input
              type="text"
              placeholder="חיפוש נושא אימון..."
              className="block w-full pr-10 py-2 text-right rounded-md border border-[var(--border-color)] focus:ring-[var(--page-font-color)] focus:border-[var(--page-font-color)] text-[var(--page-font-color)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir="rtl"
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-center mb-4 border border-red-200">
            <p>{error}</p>
            <button 
              className="mt-2 text-sm underline flex items-center justify-center mx-auto" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              נסה שנית
            </button>
          </div>
        )}

        {/* Training Topics Section */}
        <div className="flex-grow flex flex-col space-y-2">
          {filteredTrainingTopics.length === 0 && !loading && !error ? (
            <div className="text-center p-4 border border-dashed border-[var(--border-color)] rounded-md">
              <Book className="w-8 h-8 text-[var(--page-font-color)] mx-auto opacity-50" />
              <p className="mt-2 text-[var(--page-font-color)]">
                {searchTerm ? "לא נמצאו נושאי אימון התואמים את החיפוש" : "לא נמצאו נושאי אימון"}
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
          ) : (
            filledTrainingTopics.map((trainingTopic) => {
              if ('isEmpty' in trainingTopic) {
                return (
                  <Button
                    key={trainingTopic.id}
                    className={`w-full text-sm transition-all duration-300 ${BUTTON_HEIGHT} opacity-0 pointer-events-none`}
                  >
                    {/* Empty placeholder */}
                  </Button>
                );
              }
              
              return (
                <Button
                  key={trainingTopic.id}
                  className={`w-full text-sm transition-all duration-300 ${BUTTON_HEIGHT} bg-[var(--page-font-color)] text-white`}
                  onClick={() => handleTrainingTopicSelect(trainingTopic.id, trainingTopic.name)}
                >
                  <div className="w-full flex items-center px-2" style={{ direction: "rtl" }}>
                    <Book className="w-4 h-4 ml-2 flex-shrink-0" />
                    <div className="text-right line-clamp-2 leading-5 flex-1">
                      <span>
                        {trainingTopic.name}
                        {trainingTopic.hospitalName && (
                          <span className="opacity-80 mr-1">
                            - {trainingTopic.hospitalName}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </div>
        
        {/* Pagination Controls */}
        {filteredTrainingTopics.length > ITEMS_PER_PAGE && (
          <div className="flex-none pt-3 mt-3 border-t border-[var(--border-color)]">
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

export default BeforePage;