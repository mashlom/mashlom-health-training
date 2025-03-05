import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl, getCurrentDataSource } from '../config/env';
import quizData from '../data/quizData.json';

interface Question {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}

interface TestTopic {
  id: string;
  _id?: string; // Added _id field for MongoDB ObjectId support
  title: string;
  order?: number; // Add order field
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
      
      // Log the raw data to inspect the structure
      console.log("Raw data from API:", rawData);
      
      // Ensure the data matches our TestTopic interface with order field
      const formattedData: TestTopic[] = Array.isArray(rawData) ? rawData.map(item => {
        // Explicitly preserve the order field as a number
        const orderValue = item.order !== undefined ? Number(item.order) : undefined;
        
        return {
          id: String(item.id || item._id), // Use _id as fallback for id
          _id: String(item._id || item.id), // Store _id explicitly
          title: String(item.title),
          order: orderValue, // Keep the order field
          questions: Array.isArray(item.questions) ? item.questions.map(q => ({
            question: String(q.question),
            answers: Array.isArray(q.answers) ? q.answers.map(String) : [],
            correct: Number(q.correct),
            explanation: String(q.explanation)
          })) : []
        };
      }) : [];
      
      // Log formatted data to verify order is preserved
      console.log("Formatted data with order:", formattedData.map(item => ({
        id: item.id,
        title: item.title,
        order: item.order
      })));
      
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
      // Process JSON data and maintain any order field if available
      const formattedTopics = quizData.quizTopics.map((topic, index) => {
        // Create a new object without the chapter field
        const { chapter, ...topicWithoutChapter } = topic;
        // Add order field if not present
        return {
          ...topicWithoutChapter,
          order: topicWithoutChapter.order !== undefined ? Number(topicWithoutChapter.order) : index
        };
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

  // Sort topics by order field, if present
  const sortedTopics = React.useMemo(() => {
    return [...topics].sort((a, b) => {
      // If both have order, sort by order
      if (typeof a.order === 'number' && typeof b.order === 'number') {
        return a.order - b.order;
      }
      // If only one has order, the one with order comes first
      if (typeof a.order === 'number') return -1;
      if (typeof b.order === 'number') return 1;
      // Fall back to alphabetical sort by title
      return a.title.localeCompare(b.title);
    });
  }, [topics]);

  return {
    topics: sortedTopics,
    currentTopicQuestions,
    loading,
    error,
    selectedTrainingTopic,
    setSelectedTrainingTopic
  };
};