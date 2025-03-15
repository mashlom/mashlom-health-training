import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl, getCurrentDataSource } from '../config/env';
import quizData from '../data/quizData.json';

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

interface TestTopic {
  id: string;
  _id?: string; // Added _id field for MongoDB ObjectId support
  title: string;
  // Removed chapter field
  questions: Question[];
}

interface TopicsContextType {
  topics: TestTopic[];
  loading: boolean;
  error: string | null;
  selectedTrainingTopic: { id: string; name: string } | null;
  setSelectedTrainingTopic: (trainingTopic: { id: string; name: string } | null) => void;
}

// Create the context
const TopicsContext = createContext<TopicsContextType | undefined>(undefined);

export const TopicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<TestTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrainingTopic, setSelectedTrainingTopic] = useState<{ id: string; name: string } | null>(() => {
    // Initialize from localStorage if available
    const trainingTopicId = localStorage.getItem('selectedTrainingTopicId');
    const trainingTopicName = localStorage.getItem('selectedTrainingTopicName');
    
    if (trainingTopicId && trainingTopicName) {
      return { id: trainingTopicId, name: trainingTopicName };
    }
    return null;
  });
  
  // Function to fetch data from MongoDB with the selected training topic
  const fetchFromMongoDB = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      
      // Use the training topic ID instead of name for the API call
      const trainingTopicIdentifier = selectedTrainingTopic ? selectedTrainingTopic.id : 'topic1';
      const encodedIdentifier = encodeURIComponent(trainingTopicIdentifier);
      
      const response = await fetch(`${baseUrl}/api/trainingsAnonymous/training-topic/${encodedIdentifier}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch topics from MongoDB');
      }

      const rawData = await response.json();
      // Ensure the data matches our TestTopic interface - removed chapter field
      const formattedData: TestTopic[] = Array.isArray(rawData) ? rawData.map(item => ({
        id: String(item.id || item._id), // Use _id as fallback for id
        _id: String(item._id || item.id), // Store _id explicitly
        title: String(item.title),
        questions: Array.isArray(item.questions) ? item.questions.map(q => ({
          question: String(q.question),
          answers: Array.isArray(q.answers) ? q.answers.map(String) : [],
          correct: Number(q.correct),
          explanation: String(q.explanation),
          // Include image info if available
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
        })) : []
      })) : [];
      
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
      // Remove chapter field when loading from JSON
      const formattedTopics = quizData.quizTopics.map(topic => {
        // Create a new object without the chapter field
        const { chapter, ...topicWithoutChapter } = topic;
        return topicWithoutChapter;
      });
      setTopics(formattedTopics);
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
      // Only fetch data if a training topic is selected
      if (selectedTrainingTopic) {
        await fetchFromMongoDB();
      } else {
        // Clear topics if no training topic is selected
        setTopics([]);
      }
    } else {
      loadFromJSON();
    }
    setLoading(false);
  };

  // Load data when selected training topic changes or data source changes
  useEffect(() => {
    // Only load data if a training topic is selected or we're using the JSON source
    if (selectedTrainingTopic || getCurrentDataSource() === 'json') {
      loadData();
    } else {
      // Clear topics if no training topic is selected
      setTopics([]);
      setLoading(false);
    }
    
    // Listen for data source changes
    const handleDataSourceChange = () => {
      if (selectedTrainingTopic || getCurrentDataSource() === 'json') {
        loadData();
      }
    };
    
    window.addEventListener('dataSourceChanged', handleDataSourceChange);
    
    return () => {
      window.removeEventListener('dataSourceChanged', handleDataSourceChange);
    };
  }, [selectedTrainingTopic]);

  // Update localStorage when selected training topic changes
  useEffect(() => {
    if (selectedTrainingTopic) {
      localStorage.setItem('selectedTrainingTopicId', selectedTrainingTopic.id);
      localStorage.setItem('selectedTrainingTopicName', selectedTrainingTopic.name);
    } else {
      localStorage.removeItem('selectedTrainingTopicId');
      localStorage.removeItem('selectedTrainingTopicName');
    }
  }, [selectedTrainingTopic]);

  return (
    <TopicsContext.Provider value={{ 
      topics, 
      loading, 
      error, 
      selectedTrainingTopic, 
      setSelectedTrainingTopic 
    }}>
      {children}
    </TopicsContext.Provider>
  );
};

export const useTopics = (topicId?: string) => {
  const context = useContext(TopicsContext);
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }
  
  const { topics, loading, error, selectedTrainingTopic, setSelectedTrainingTopic } = context;
  
  const currentTopicQuestions = React.useMemo(() => {
    if (!topicId || loading) return [];
    if (topicId === 'random') {
      const allQuestions = topics.reduce<Question[]>(
        (acc, topic) => [...acc, ...topic.questions],
        []
      );
      return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
    // Look for the topic by either id or _id
    const topic = topics.find(t => t.id === topicId || t._id === topicId);
    return topic?.questions || [];
  }, [topics, topicId, loading]);

  // No sorting by chapter anymore
  const sortedTopics = React.useMemo(() => 
    [...topics],
    [topics]
  );

  return {
    topics: sortedTopics,
    currentTopicQuestions,
    loading,
    error,
    selectedTrainingTopic,
    setSelectedTrainingTopic
  };
};