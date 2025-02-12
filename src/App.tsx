import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { TopicsProvider } from "./context/TopicsContext";

// Import components
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
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
              {/* Redirect root to /er */}
              <Route path="/" element={<Navigate to="/er" replace />} />

              {/* Department home page */}
              <Route path="/:department" element={<HomePage />} />

              {/* Quiz page */}
              <Route path="/:department/quiz/:topicId" element={<QuizPage />} />

              {/* Score page */}
              <Route
                path="/:department/quiz/:topicId/finish"
                element={<ScorePage />}
              />

              {/* Catch all other routes and redirect to /er */}
              <Route path="*" element={<Navigate to="/er" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
    </TopicsProvider>
  );
};

export default App;
