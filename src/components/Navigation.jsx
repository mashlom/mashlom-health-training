import React from 'react';

const Navigation = () => (
  <nav className="p-4 bg-gray-100">
    <ul className="flex space-x-4">
      <li><a href="#/" className="text-blue-500 hover:text-blue-700">Home</a></li>
      <li><a href="#/about" className="text-blue-500 hover:text-blue-700">About</a></li>
      <li><a href="#/contact" className="text-blue-500 hover:text-blue-700">Contact</a></li>
    </ul>
  </nav>
);

export default Navigation;