import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button, HomeButton } from "../components/Button";
import { Check, X, ArrowLeft, RefreshCw } from "lucide-react";
import { useTopics } from "../context/TopicsContext";
import { getApiBaseUrl } from "../config/env";

interface ImageInfo {
  fileName?: string;
  url?: string;
}

interface Question {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  questionImage?: ImageInfo;
  explanationImage?: ImageInfo;
  id?: string;
  _id?: string;
}

interface AnswerWithIndex {
  text: string;
  isCorrect: boolean;
  originalIndex: number;
}

const TestPage: React.FC = () => {
  const { topicId, trainingTopicId } = useParams<{
    topicId: string;
    trainingTopicId?: string;
  }>();
  const navigate = useNavigate();
  const { currentTopicQuestions, loading, selectedTrainingTopic } = useTopics(topicId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<AnswerWithIndex[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [manualTopicQuestions, setManualTopicQuestions] = useState<Question[]>([]);
  const [retryAttempted, setRetryAttempted] = useState(false);

  // Log received questions for debugging
  useEffect(() => {
    if (currentTopicQuestions && currentTopicQuestions.length > 0) {
      console.log("Current topic questions:", currentTopicQuestions);
      
      // Check for images in the questions
      const questionsWithImages = currentTopicQuestions.filter(
        q => q.questionImage?.url || q.explanationImage?.url
      );
      
      if (questionsWithImages.length > 0) {
        console.log("Found questions with images:", questionsWithImages.length);
        console.log("First question with image:", questionsWithImages[0]);
      } else {
        console.log("No questions have images");
      }
    }
  }, [currentTopicQuestions]);

  // Debug log shuffled questions when they change
  useEffect(() => {
    if (shuffledQuestions && shuffledQuestions.length > 0) {
      console.log("Shuffled questions:", shuffledQuestions);
      
      // Log image URLs specifically
      shuffledQuestions.forEach((q, index) => {
        if (q.questionImage?.url) {
          console.log(`Question ${index} has image URL:`, q.questionImage.url);
        }
        if (q.explanationImage?.url) {
          console.log(`Question ${index} has explanation image URL:`, q.explanationImage.url);
        }
      });
    }
  }, [shuffledQuestions]);

  // Function to directly fetch questions for the specific topic
  const fetchQuestionsForTopic = useCallback(async () => {
    setIsRetrying(true);
    try {
      const baseUrl = getApiBaseUrl();
      
      // For proper fetching, we need the training topic ID
      const currentTrainingTopicId = trainingTopicId || selectedTrainingTopic?.id;
      
      // Skip if we don't have a valid training topic ID
      if (!currentTrainingTopicId) {
        throw new Error("No valid training topic ID for fetching questions");
      }
      // Encode the ID for the URL
      const encodedTrainingTopicId = encodeURIComponent(currentTrainingTopicId);
      
      // Construct the endpoint
      const endpoint = `${baseUrl}/api/trainingsAnonymous/training-topic/${encodedTrainingTopicId}`;
      
      console.log("Fetching questions from:", endpoint);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }
      const data = await response.json();
      
      // Debug log the raw data from the server
      console.log("Raw data from server:", data);
      
      // Process the data appropriately - the response contains topics, each with an array of questions
      let questions: Question[] = [];
      
      if (Array.isArray(data)) {
        // Find the topic that matches our topicId
        if (topicId === "random") {
          // For random questions, gather questions from all topics
          data.forEach(topic => {
            if (topic.questions && Array.isArray(topic.questions)) {
              questions = [...questions, ...topic.questions.map(prepareQuestionData)];
            }
          });
          
          // Shuffle and limit to 10 questions if we have more
          if (questions.length > 10) {
            questions = questions
              .sort(() => 0.5 - Math.random())
              .slice(0, 10);
          }
        } else {
          // For a specific topic, find the matching topic
          const matchingTopic = data.find(topic => 
            topic.id === topicId || topic._id === topicId
          );
          
          if (matchingTopic && matchingTopic.questions && Array.isArray(matchingTopic.questions)) {
            questions = matchingTopic.questions.map(prepareQuestionData);
          }
        }
      }
      
      // Check if any questions have images
      const questionsWithImages = questions.filter(
        q => q.questionImage?.url || q.explanationImage?.url
      );
      
      if (questionsWithImages.length > 0) {
        console.log("Found manually fetched questions with images:", questionsWithImages.length);
        console.log("First question with image:", questionsWithImages[0]);
      } else {
        console.log("No manually fetched questions have images");
      }
      
      // Only update if we got valid data
      if (questions.length > 0) {
        // Shuffle the questions
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        setManualTopicQuestions(shuffled);
      } else {
        throw new Error("No questions found in the response");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsRetrying(false);
      setRetryAttempted(true);
    }
  }, [topicId, trainingTopicId, selectedTrainingTopic]);

  // Helper function to prepare the question data
  const prepareQuestionData = (q: any): Question => {
    // Debug log the raw question data
    console.log("Preparing question data:", q);
    
    const preparedData = {
      question: q.question || "No question text",
      answers: Array.isArray(q.answers) ? q.answers : [],
      correct: typeof q.correct === 'number' ? q.correct : 0,
      explanation: q.explanation || "No explanation provided",
      questionImage: q.questionImage ? {
        fileName: q.questionImage.fileName,
        url: q.questionImage.url
      } : undefined,
      explanationImage: q.explanationImage ? {
        fileName: q.explanationImage.fileName,
        url: q.explanationImage.url
      } : undefined,
      id: q.id || q._id,
      _id: q._id || q.id
    };
    
    // Log the result of preparation
    console.log("Prepared question data:", preparedData);
    
    return preparedData;
  };

  // Combined questions - prefer currentTopicQuestions, fall back to manually fetched
  const combinedQuestions = currentTopicQuestions.length > 0 
    ? currentTopicQuestions 
    : manualTopicQuestions;
    
  // Debug logging to help identify issues
  useEffect(() => {
    if (currentTopicQuestions.length === 0 && !loading) {
      console.log("No questions found in context, will attempt direct fetch");
    }
    if (manualTopicQuestions.length > 0) {
      console.log("Successfully fetched questions directly", manualTopicQuestions.length);
    }
  }, [currentTopicQuestions, manualTopicQuestions, loading]);

  // Set up shuffled questions when topic questions are loaded
  useEffect(() => {
    if (combinedQuestions && combinedQuestions.length > 0) {
      // Process questions to ensure they have all required properties
      const processedQuestions = combinedQuestions.map(q => ({
        ...q,
        question: q.question || "No question text",
        answers: Array.isArray(q.answers) ? q.answers : [],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        explanation: q.explanation || "No explanation provided",
        // Explicitly preserve image data
        questionImage: q.questionImage,
        explanationImage: q.explanationImage
      }));
      
      // Filter out any questions without answers
      const validQuestions = processedQuestions.filter(q => q.answers && q.answers.length > 0);
      
      // Shuffle the valid questions
      const shuffled = [...validQuestions].sort(() => 0.5 - Math.random());
      setShuffledQuestions(shuffled);
    } else if (!loading && !retryAttempted && !isRetrying) {
      // Auto-retry if no questions and not already retrying
      fetchQuestionsForTopic();
    }
  }, [combinedQuestions, loading, retryAttempted, isRetrying, fetchQuestionsForTopic]);

  // Set up shuffled answers for current question
  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestion < shuffledQuestions.length) {
      const currentQ = shuffledQuestions[currentQuestion];
      
      // Ensure correct index is valid
      const correctIndex = typeof currentQ.correct === 'number' && 
                           currentQ.correct >= 0 && 
                           currentQ.correct < currentQ.answers.length
                           ? currentQ.correct
                           : 0;
      
      const answersWithIndices = currentQ.answers.map((answer, index) => ({
        text: answer || "No answer text",
        isCorrect: index === correctIndex,
        originalIndex: index // Keep track of original index
      }));

      // Shuffle the answers
      const shuffled = [...answersWithIndices].sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  }, [currentQuestion, shuffledQuestions]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (shuffledAnswers[index] && shuffledAnswers[index].isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // Use training-topic-specific route if trainingTopicId is available
      if (trainingTopicId) {
        navigate(`/training-topic/${trainingTopicId}/test/${topicId}/finish`, {
          state: { 
            score: shuffledQuestions.length > 0 
              ? Math.round((score / shuffledQuestions.length) * 100) 
              : 0 
          },
        });
      }
    }
  };

  const handleHome = () => {
    // Navigate to training-topic-specific home page if trainingTopicId is available
    if (trainingTopicId) {
      navigate(`/training-topic/${trainingTopicId}`);
    } else if (selectedTrainingTopic) {
      // If we have a selected training topic but no trainingTopicId in URL, use the selected training topic's ID
      navigate(`/training-topic/${selectedTrainingTopic.id}`);
    } else {
      // Fallback to landing page
      navigate('/training-topics');
    }
  };

  const handleManualRetry = () => {
    fetchQuestionsForTopic();
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (isRetrying) {
    return <div className="text-center p-4">Fetching questions...</div>;
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden">
          <div id="question-header" className="bg-[var(--page-font-color)] p-1">
            <div className="flex justify-center items-center flex-row px-5">
              <HomeButton
                onClick={handleHome}
                className="flex items-center justify-center gap-2 p-2 text-white hover:text-gray-200 transition-colors duration-200"
                text="חזרה לעמוד השאלות"
              />
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[var(--page-font-color)] leading-relaxed">
                לא נמצאו שאלות עבור נושא זה
              </h2>
              {retryAttempted ? (
                <p className="text-gray-600 mt-2">ניסינו לטעון שוב את השאלות, אך לא הצלחנו למצוא שאלות לנושא זה.</p>
              ) : null}
              <Button
                onClick={handleManualRetry}
                className="mt-4 bg-[var(--page-font-color)] text-white flex items-center gap-2 px-4 py-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                נסה שוב לטעון שאלות
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!shuffledAnswers || shuffledAnswers.length === 0) return null;
  
  const currentQ = shuffledQuestions[currentQuestion];

  // Debug log current question's image data
  if (currentQ) {
    console.log("Current question:", currentQuestion);
    console.log("Has question image:", !!currentQ.questionImage?.url);
    console.log("Question image URL:", currentQ.questionImage?.url);
    console.log("Has explanation image:", !!currentQ.explanationImage?.url);
    console.log("Explanation image URL:", currentQ.explanationImage?.url);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="overflow-hidden">
        <div id="question-header" className="bg-[var(--page-font-color)] p-1">
          <div className="flex justify-between items-center flex-row px-5">
            <div className="text-sm font-medium text-white">
              שאלה {currentQuestion + 1} מתוך {shuffledQuestions.length}
            </div>
            <HomeButton
              onClick={handleHome}
              className="flex items-center justify-center gap-2 p-2 text-white hover:text-gray-200 transition-colors duration-200"
              text="חזרה לעמוד השאלות"
            />
          </div>
        </div>
        <CardContent className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--page-font-color)] leading-relaxed">
              {currentQ?.question || "No question text"}
            </h2>
            
            {/* Display question image if available */}
            {currentQ?.questionImage?.url && (
              <div className="mt-4 flex justify-center">
                <img 
                  src={currentQ.questionImage.url} 
                  alt="תמונת שאלה" 
                  className="max-w-full max-h-64 object-contain rounded-lg border border-gray-200" 
                  onError={(e) => {
                    console.error("Error loading question image:", e);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => !showAnswer && handleAnswer(index)}
                disabled={showAnswer}
                className={`w-full min-h-[3.5rem] px-4 py-3 text-right rounded-lg border ${
                  showAnswer
                    ? answer.isCorrect
                      ? "bg-green-100 border-green-300 text-[var(--page-font-color)]"
                      : selectedAnswer === index
                      ? "bg-[#fff0f0] border-[#ff9999] text-[var(--page-font-color)]"
                      : "bg-white border-gray-200 text-[var(--page-font-color)] opacity-50"
                    : "bg-white border-gray-200 text-[var(--page-font-color)] hover:bg-gray-50"
                } transition-colors duration-200 focus:outline-none`}
              >
                <div className="flex justify-between items-center">
                  <span className="flex-1">{answer.text}</span>
                  {showAnswer &&
                    (answer.isCorrect ? (
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
              <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                <h3 className="font-semibold text-[var(--page-font-color)] mb-2">
                  הסבר:
                </h3>
                <p className="text-[var(--header-text-color)]">
                  {currentQ?.explanation || "No explanation provided"}
                </p>
                
                {/* Display explanation image if available */}
                {currentQ?.explanationImage?.url && (
                  <div className="mt-4 flex justify-center">
                    <img 
                      src={currentQ.explanationImage.url} 
                      alt="תמונת הסבר" 
                      className="max-w-full max-h-64 object-contain rounded-lg border border-green-200 mt-2" 
                      onError={(e) => {
                        console.error("Error loading explanation image:", e);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-[var(--page-font-color)] text-[var(--buttons-color)] px-6 py-2 rounded-lg flex items-center gap-2"
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

export default TestPage;