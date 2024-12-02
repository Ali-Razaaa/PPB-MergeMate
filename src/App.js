import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import SwipeCard from './components/SwipeCard';
import Profile from './Profile';
import AddProject from './AddProject';
import TaskBoard from './TaskBoard';
import Notifications from './Notifications';

const App = () => {
  const [githubAccessToken, setGithubAccessToken] = useState(null); // Manage the GitHub token

  return (
    <Router>
      <div>
        <Header setGithubAccessToken={setGithubAccessToken} />
        <Routes>
          <Route
            path="/discover"
            element={<SwipeCard githubAccessToken={githubAccessToken} />}
          />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/task-board" element={<TaskBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
