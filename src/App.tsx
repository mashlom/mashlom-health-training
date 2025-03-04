import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { TopicsProvider } from "./context/TopicsContext";

// Import components
import Header from "./components/Header";
import BeforePage from "./pages/BeforePage";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage"; // Changed from QuizPage
import ScorePage from "./pages/ScorePage";

// Import styles
import "./commoncss/global.css";

const App: React.FC = () => {
  return (
    <TopicsProvider>
      <HashRouter>
        <div className="flex flex-col items-center min-h-screen w-full max-w-[700px] mx-auto">
          <Header />
          <main className="w-full flex-grow bg-gray-50 border border-[var(--border-color)] overflow-y-auto text-center h-[calc(100dvh-50px)]">
            <div dir="rtl">
              <Routes>
                {/* Make BeforePage the landing page */}
                <Route path="/training-topics" element={<BeforePage />} />
                
                {/* Training-topic selection page */}
                <Route path="/training-topics" element={<BeforePage />} />

                {/* Training-topic home page */}
                <Route path="/training-topic/:trainingTopicId" element={<HomePage />} />
                
                {/* Test page routes */}
                <Route path="/training-topic/:trainingTopicId/test/:topicId" element={<TestPage />} />

                {/* Score page routes */}
                <Route path="/training-topic/:trainingTopicId/test/:topicId/finish" element={<ScorePage />} />

                {/* Catch all other routes and redirect to landing page */}
                <Route path="*" element={<Navigate to="/training-topics" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
    </TopicsProvider>
  );
};

export default App;