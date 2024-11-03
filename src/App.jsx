import React from 'react';
import { useState, useEffect } from 'react';

// Simple hash router component
const HashRouter = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return children(currentPath);
};

// Navigation component
const Navigation = () => (
  <nav className="p-4 bg-gray-100">
    <ul className="flex space-x-4">
      <li><a href="#/" className="text-blue-500 hover:text-blue-700">Home</a></li>
      <li><a href="#/about" className="text-blue-500 hover:text-blue-700">About</a></li>
      <li><a href="#/contact" className="text-blue-500 hover:text-blue-700">Contact</a></li>
    </ul>
  </nav>
);

// Page components
const Home = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Home Page</h1>
    <p>Welcome to our website!</p>
  </div>
);

const About = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">About Page</h1>
    <p>Learn more about us here.</p>
  </div>
);

const Contact = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Contact Page</h1>
    <p>Get in touch with us!</p>
  </div>
);

// Main App component
const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HashRouter>
        {(currentPath) => {
          switch (currentPath) {
            case '/':
              return <Home />;
            case '/about':
              return <About />;
            case '/contact':
              return <Contact />;
            default:
              return <div className="p-4">404: Page not found</div>;
          }
        }}
      </HashRouter>
    </div>
  );
};

export default App;