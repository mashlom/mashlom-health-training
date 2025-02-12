import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTopics } from "../context/TopicsContext";

// Constants remain the same
const ITEMS_PER_PAGE = 10;
const BUTTON_HEIGHT = "h-12";
const CONTENT_HEIGHT = "min-h-[90vh]";

interface EmptyTopic {
  id: string;
  isEmpty: true;
}

const HomePage: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { topics, loading } = useTopics();

  // Get page from URL or default to 1
  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sort quiz topics by chapter number
  const sortedQuizTopics = [...topics].sort((a, b) => a.chapter - b.chapter);

  // Total pages calculation
  const totalPages = Math.ceil(sortedQuizTopics.length / ITEMS_PER_PAGE);

  // Ensure page number is valid
  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    }
  }, [currentPage, totalPages, setSearchParams]);

  // Update URL when page changes
  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = sortedQuizTopics.slice(startIndex, endIndex);

  // Fill remaining slots with empty topics
  const filledTopics: (typeof topics[0] | EmptyTopic)[] = [...currentTopics];
  while (filledTopics.length < ITEMS_PER_PAGE) {
    filledTopics.push({
      id: `empty-${currentPage}-${filledTopics.length}`,
      isEmpty: true,
    });
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    navigate(`/${department}/quiz/${topicId}`);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <Card className="max-w-lg mx-auto mt-4 mb-4 border-[var(--border-color)]">
      <CardContent className={`p-4 flex flex-col ${CONTENT_HEIGHT}`}>
        {/* Rest of the JSX remains exactly the same */}
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-center mb-2 text-[var(--page-font-color)]">
            שאלות הכנה למבחנים ברפואה דחופה
          </h1>

          <div className="text-sm text-center mb-3 text-[var(--page-font-color)]">
            שאלות הכנה לשלב א ברפואה דחופה ע"פ, th10 edition edition Medicine
            Emergency s'Rosen
          </div>

          <Button
            className={`w-full text-base bg-[var(--page-font-color)] text-white transition-all duration-300 mb-3 ${BUTTON_HEIGHT}`}
            onClick={() => handleTopicSelect("random")}
          >
            <div className="w-full text-right">שאלות על כל החומר</div>
          </Button>
        </div>

        {/* Topics Section */}
        <div className="flex-grow flex flex-col space-y-2">
          {filledTopics.map((topic, index) => (
            <Button
              key={`${currentPage}-${topic.id || `topic-${index}`}`}
              className={`w-full text-sm transition-all duration-300 ${BUTTON_HEIGHT} ${
                "isEmpty" in topic
                  ? "opacity-0 pointer-events-none"
                  : "bg-[var(--page-font-color)] text-white"
              }`}
              onClick={() =>
                !("isEmpty" in topic) && handleTopicSelect(topic.id)
              }
            >
              {"isEmpty" in topic ? null : (
                <div className="w-full px-2 overflow-hidden">
                  <div className="text-right line-clamp-2 leading-5">
                    <span style={{ direction: "rtl" }}>
                      פרק {topic.chapter} -{" "}
                    </span>
                    <span style={{ direction: "ltr" }}>{topic.title}</span>
                  </div>
                </div>
              )}
            </Button>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex-none pt-3 mt-3 border-t border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`bg-[var(--page-font-color)] text-white flex items-center gap-1 px-2 text-sm h-8 ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
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
              disabled={currentPage === totalPages}
              className={`bg-[var(--page-font-color)] text-white flex items-center gap-1 px-2 text-sm h-8 ${
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              הבא
              <ChevronLeft className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePage;