import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  _id?: string; 
  title: string;
  questions: Question[];
}

interface TopicsContextType {
  topics: TestTopic[];
  loading: boolean;
  error: string | null;
  selectedTrainingTopic: { id: string; name: string } | null;
  setSelectedTrainingTopic: (trainingTopic: { id: string; name: string } | null) => void;
}

const TopicsContext = createContext<TopicsContextType | undefined>(undefined);

export const TopicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<TestTopic[]>([]);
  const [loading, setLoading] = useState(true); // Initial loading can be true
  const [error, setError] = useState<string | null>(null);
  const [selectedTrainingTopic, setSelectedTrainingTopicState] = useState<{ id: string; name: string } | null>(() => {
    const trainingTopicId = localStorage.getItem('selectedTrainingTopicId');
    const trainingTopicName = localStorage.getItem('selectedTrainingTopicName');
    
    if (trainingTopicId && trainingTopicName) {
      return { id: trainingTopicId, name: trainingTopicName };
    }
    return null;
  });

  // Wrap setSelectedTrainingTopic to ensure localStorage is updated and state is set
  const setSelectedTrainingTopic = useCallback((trainingTopic: { id: string; name: string } | null) => {
    setSelectedTrainingTopicState(trainingTopic);
    if (trainingTopic) {
      localStorage.setItem('selectedTrainingTopicId', trainingTopic.id);
      localStorage.setItem('selectedTrainingTopicName', trainingTopic.name);
    } else {
      localStorage.removeItem('selectedTrainingTopicId');
      localStorage.removeItem('selectedTrainingTopicName');
    }
  }, []);
  
  const fetchFromMongoDB = useCallback(async () => {
    if (!selectedTrainingTopic || !selectedTrainingTopic.id) {
      setTopics([]);
      // setError("No training topic selected for fetching from MongoDB."); // Could be too noisy
      return;
    }
    try {
      const baseUrl = getApiBaseUrl();
      const trainingTopicIdentifier = selectedTrainingTopic.id;
      const encodedIdentifier = encodeURIComponent(trainingTopicIdentifier);
      
      const response = await fetch(`${baseUrl}/api/trainingsAnonymous/training-topic/${encodedIdentifier}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch topics from MongoDB');
      }

      const rawData = await response.json();
      const formattedData: TestTopic[] = Array.isArray(rawData) ? rawData.map(item => ({
        id: String(item.id || item._id),
        _id: String(item._id || item.id),
        title: String(item.title),
        questions: Array.isArray(item.questions) ? item.questions.map(q => ({
          question: String(q.question),
          answers: Array.isArray(q.answers) ? q.answers.map(String) : [],
          correct: Number(q.correct),
          explanation: String(q.explanation),
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
      setError(err instanceof Error ? err.message : 'An error occurred while fetching topics');
      setTopics([]);
    }
  }, [selectedTrainingTopic]); // Depends on selectedTrainingTopic for its ID

  const loadFromJSON = useCallback(() => {
    try {
      if (
        !quizData ||
        !quizData.quizTopics ||
        !Array.isArray(quizData.quizTopics)
      ) {
        throw new Error('JSON data is not in the expected format');
      }
      const formattedTopics = quizData.quizTopics.map(topic => {
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
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (getCurrentDataSource() === 'mongodb') {
      // Ensure selectedTrainingTopic is valid before fetching
      if (selectedTrainingTopic && selectedTrainingTopic.id && selectedTrainingTopic.name && selectedTrainingTopic.name !== "Loading...") {
        await fetchFromMongoDB();
      } else {
        // If topic is not fully resolved or missing, don't fetch, clear topics.
        setTopics([]);
        if (selectedTrainingTopic && selectedTrainingTopic.name === "Loading...") {
          // Still waiting for name resolution, error will be set by name fetching if it fails badly.
        } else if (!selectedTrainingTopic) {
           // setError("No training topic selected."); // Optional: provide feedback
        }
      }
    } else {
      loadFromJSON();
    }
    setLoading(false);
  }, [selectedTrainingTopic, fetchFromMongoDB, loadFromJSON]);

  useEffect(() => {
    const initOrUpdateTrainingData = async () => {
      // Step 1: Resolve selectedTrainingTopic name if it's a placeholder or missing.
      if (selectedTrainingTopic && selectedTrainingTopic.id &&
          (selectedTrainingTopic.name === "Loading..." || !selectedTrainingTopic.name || selectedTrainingTopic.name.trim() === "")) {
        
        setLoading(true); // Indicate loading while resolving name
        let newTopicName = "Unknown Topic"; // Default if fetch fails
        let successfullyFetchedName = false;

        try {
          const baseUrl = getApiBaseUrl();
          // Fetch the list of all training topics to find the name
          const listResponse = await fetch(`${baseUrl}/api/trainingsAnonymous/training-topic`);
          if (listResponse.ok) {
            const allTopics: Array<{id: string, _id?: string, name: string}> = await listResponse.json();
            const foundTopic = allTopics.find(t => (t.id === selectedTrainingTopic.id || t._id === selectedTrainingTopic.id));
            
            if (foundTopic && foundTopic.name) {
              newTopicName = foundTopic.name;
              successfullyFetchedName = true;
            } else {
              console.warn(`Training topic with id ${selectedTrainingTopic.id} not found or has no name. Using "${newTopicName}".`);
            }
          } else {
            console.error(`Failed to fetch training topics list (status: ${listResponse.status}) to get name. Using "${newTopicName}".`);
            // setError(`Failed to retrieve details for training topic ${selectedTrainingTopic.id}.`);
          }
        } catch (err) {
          console.error(`Error fetching training topic details: ${err}. Using "${newTopicName}".`);
          // setError(`Error retrieving details for training topic ${selectedTrainingTopic.id}.`);
        }

        // Update state only if name is different, to avoid unnecessary re-renders/loops.
        // This also triggers a re-run of this useEffect.
        if (selectedTrainingTopic.name !== newTopicName) {
          setSelectedTrainingTopic({ id: selectedTrainingTopic.id, name: newTopicName });
          // IMPORTANT: Exit and let the useEffect re-run with the updated topic name.
          // The setLoading(true) remains active, and the next run will handle it.
          return; 
        }
        // If name didn't change (e.g., already "Unknown Topic" or fetch failed to find a better one),
        // fall through to loadData. setLoading(true) is still active from above.
        // If we fell through here, it means the name is still effectively a placeholder or "Unknown Topic".
        // We might want to ensure loading is set to false if no further action happens.
        if (!successfullyFetchedName && newTopicName === "Unknown Topic") {
            // If fetch failed and we are using "Unknown Topic", and it wasn't already that,
            // setSelectedTrainingTopic would have been called.
            // If it was already "Unknown Topic" or "Loading..." and fetch failed, we are here.
            // We should proceed to loadData if possible, or stop loading.
        }
      }

      // Step 2: Load quiz topics data.
      // This part runs if:
      // a) Name was already okay.
      // b) Name resolution happened, and this is the re-run of the effect (name is now resolved).
      // c) Name resolution attempted but didn't change the name (e.g., it's "Unknown Topic", or fetch failed).
      
      if (getCurrentDataSource() === 'json') {
        await loadData(); // loadData sets its own loading states
      } else if (selectedTrainingTopic && selectedTrainingTopic.id) {
        // For MongoDB, load data if ID is present. Name will be what it resolved to.
        // Ensure name is not the explicit "Loading..." placeholder if we haven't returned.
        if (selectedTrainingTopic.name !== "Loading...") {
          await loadData();
        } else {
          // Still "Loading...", means the name fetch path didn't update and return.
          // This case should ideally be covered by the `return` above.
          // If somehow reached, implies an issue or name couldn't be resolved from "Loading...".
          setTopics([]);
          setLoading(false); // Make sure loading stops.
        }
      } else {
        // No selected topic (for MongoDB) and not JSON source
        setTopics([]);
        setLoading(false); // Ensure loading is false if no data fetching.
      }
    };

    initOrUpdateTrainingData();
    
    // Listen for data source changes
    const handleDataSourceChange = () => {
        // Re-running the main logic should handle data source changes correctly,
        // as loadData depends on getCurrentDataSource().
        // However, this event listener needs to trigger a re-evaluation.
        // Calling initOrUpdateTrainingData directly is an option if it's stable or memoized.
        // For simplicity, let's ensure `loadData` is robust for this.
        if (getCurrentDataSource() === 'mongodb' && selectedTrainingTopic && 
            (selectedTrainingTopic.name === "Loading..." || !selectedTrainingTopic.name || selectedTrainingTopic.name.trim() === "")) {
            setTopics([]);
            setLoading(false); // Don't attempt to load if name is still placeholder for MongoDB
        } else if (selectedTrainingTopic || getCurrentDataSource() === 'json') {
            loadData(); // loadData will use the current dataSource and selectedTopic
        } else {
            setTopics([]);
            setLoading(false);
        }
    };
    
    window.addEventListener('dataSourceChanged', handleDataSourceChange);
    
    return () => {
      window.removeEventListener('dataSourceChanged', handleDataSourceChange);
    };
  // `setSelectedTrainingTopic` (the callback from `useCallback`) is stable.
  // `loadData` is memoized and changes if its dependencies (like `selectedTrainingTopic` or `fetchFromMongoDB`) change.
  }, [selectedTrainingTopic, setSelectedTrainingTopic, loadData]);


  return (
    <TopicsContext.Provider value={{ 
      topics, 
      loading, 
      error, 
      selectedTrainingTopic, 
      setSelectedTrainingTopic // Provide the wrapped setter
    }}>
      {children}
    </TopicsContext.Provider>
  );
};

// useTopics hook remains largely the same, but benefits from a more reliably named selectedTrainingTopic
export const useTopics = (topicId?: string) => {
  const context = useContext(TopicsContext);
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }
  
  const { topics, loading, error, selectedTrainingTopic, setSelectedTrainingTopic } = context;
  
  const currentTopicQuestions = React.useMemo(() => {
    if (!topicId || loading || topics.length === 0) return []; // Added topics.length === 0 check
    if (topicId === 'random') {
      const allQuestions = topics.reduce<Question[]>(
        (acc, topic) => [...acc, ...topic.questions],
        []
      );
      // Ensure there are questions before trying to slice
      return allQuestions.length > 0 ? [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10) : [];
    }
    const topic = topics.find(t => t.id === topicId || t._id === topicId);
    return topic?.questions || [];
  }, [topics, topicId, loading]);

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