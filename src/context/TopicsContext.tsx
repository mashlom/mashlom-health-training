import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl, getCurrentDataSource } from '../config/env';
import quizData from '../data/quizData.json';

interface Question {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

interface QuizTopic {
  id: string;
  title: string;
  chapter: number;
  questions: Question[];
}

interface TopicsContextType {
  topics: QuizTopic[];
  loading: boolean;
  error: string | null;
}

const TopicsContext = createContext<TopicsContextType | undefined>(undefined);

export const TopicsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [topics, setTopics] = useState<QuizTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use environment variables directly from Vite
  const API_BASE_URL = getApiBaseUrl();

  // Log build information
  useEffect(() => {
    console.log('Build Info:', {
      environment: import.meta.env.VITE_APP_ENV,
      prNumber: import.meta.env.VITE_PR_NUMBER,
      commitSha: import.meta.env.VITE_COMMIT_SHA,
      baseUrl: API_BASE_URL,
    });
  }, [API_BASE_URL]);

  // Function to fetch data from MongoDB
  const fetchFromMongoDB = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainings/training-topic/test1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch topics from MongoDB');
      }

      const rawData = await response.json();
      // Ensure the data matches our QuizTopic interface
      const formattedData: QuizTopic[] = Array.isArray(rawData)
        ? rawData.map((item) => ({
            id: String(item.id),
            title: String(item.title),
            chapter: Number(item.chapter),
            questions: Array.isArray(item.questions)
              ? item.questions.map((q) => ({
                  question: String(q.question),
                  answers: Array.isArray(q.answers)
                    ? q.answers.map(String)
                    : [],
                  correct: Number(q.correct),
                  explanation: String(q.explanation),
                }))
              : [],
          }))
        : [];

      setTopics(formattedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTopics([]);
    }
  };

  // Function to load data from JSON
  const loadFromJSON = () => {
    try {
      if (
        !quizData ||
        !quizData.quizTopics ||
        !Array.isArray(quizData.quizTopics)
      ) {
        throw new Error('JSON data is not in the expected format');
      }
      setTopics(quizData.quizTopics);
      setError(null);
    } catch (err) {
      console.error('Error loading JSON data:', err);
      setError('Failed to load JSON data');
      setTopics([]);
    }
  };

  // Function to load data based on current source
  const loadData = async () => {
    setLoading(true);
    if (getCurrentDataSource() === 'mongodb') {
      await fetchFromMongoDB();
    } else {
      loadFromJSON();
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen for data source changes
    const handleDataSourceChange = () => {
      loadData();
    };

    window.addEventListener('dataSourceChanged', handleDataSourceChange);
  
    return () => {
      window.removeEventListener('dataSourceChanged', handleDataSourceChange);
    };
  }, []);

  return (
    <TopicsContext.Provider value={{ topics, loading, error }}>
      {children}
    </TopicsContext.Provider>
  );
};

export const useTopics = (topicId?: string) => {
  const context = useContext(TopicsContext);
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }

  const { topics, loading, error } = context;

  const currentTopicQuestions = React.useMemo(() => {
    if (!topicId || loading) return [];

    if (topicId === 'random') {
      const allQuestions = topics.reduce<Question[]>(
        (acc, topic) => [...acc, ...topic.questions],
        []
      );
      return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    const topic = topics.find((t) => t.id === topicId);
    return topic?.questions || [];
  }, [topics, topicId, loading]);

  const sortedTopics = React.useMemo(
    () => [...topics].sort((a, b) => a.chapter - b.chapter),
    [topics]
  );

  return {
    topics: sortedTopics,
    currentTopicQuestions,
    loading,
    error,
  };
};
