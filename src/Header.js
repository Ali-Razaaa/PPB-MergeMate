import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, githubProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import './Header.css';

const Header = ({ setGithubAccessToken }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  // Monitor Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || user.email || 'GitHub User');
        setUserPhoto(user.photoURL);

        // Fetch the access token after login
        user.getIdToken().then((token) => {
          setGithubAccessToken(token); // Set the token to state
        });
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserPhoto('');
        setGithubAccessToken(''); // Reset token when user logs out
      }
    });

    return () => unsubscribe();
  }, [setGithubAccessToken]);

  // Handle login with GitHub
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      setIsLoggedIn(true);
      setUserName(user.displayName || user.email || 'GitHub User');
      setUserPhoto(user.photoURL);

      // Fetch the GitHub access token after login
      user.getIdToken().then((token) => {
        setGithubAccessToken(token); // Set the token to state
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserName('');
      setUserPhoto('');
      setGithubAccessToken(''); // Reset token on logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <div className="logo">
        <Link to="/discover">OpenContrib</Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/discover">Discover Projects</Link></li>
          <li><Link to="/add-project">Add Project</Link></li>
          <li><Link to="/task-board">Task Board</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/notifications" className="notifications new">🔔</Link></li>
        </ul>
      </nav>

      {/* Conditional rendering of login/logout */}
      <div className="auth">
        {!isLoggedIn ? (
          <button id="login-btn" onClick={handleLogin}>
            Login with GitHub
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <img
              src={userPhoto || 'https://via.placeholder.com/150'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>{userName}</span>
            <button id="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
