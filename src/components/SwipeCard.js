import React, { useState, useEffect } from 'react';
import './App.css';

const SwipeCard = () => {
  const githubAccessToken = 'process.env.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'; // Hardcoded token

  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiped, setSwiped] = useState(null);

  // Fetch projects only if a GitHub token is available
  useEffect(() => {
    const fetchProjects = async () => {
      if (!githubAccessToken) return;

      try {
        console.log("Making API request to GitHub with token...");

        // Use the token for GitHub API
        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`, // Using hardcoded token here
          },
        });

        if (!response.ok) throw new Error('Failed to fetch projects');

        const data = await response.json();
        const formattedProjects = data.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || 'No description available',
          repoUrl: repo.html_url, // Add URL for repo link
        }));

        setProjects(formattedProjects.length ? formattedProjects : projects); // Default to existing projects if empty
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [githubAccessToken]); // Fetch whenever githubAccessToken changes

  const nextCard = () => {
    setSwiped('left');
    setTimeout(() => {
      setSwiped(null);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 500);
  };

  const prevCard = () => {
    setSwiped('right');
    setTimeout(() => {
      setSwiped(null);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
    }, 500);
  };

  return (
    <div className="gradient-background">
      <h1 className="neon-glow">Open Source Finder</h1>
      <div className="card-container">
        {projects.map((card, index) =>
          index === currentIndex ? (
            <div key={card.id} className={`card ${swiped ? `swiped-${swiped}` : 'slide-in'}`}>
              <h2 className='text-2xl'>{card.title}</h2>
              <p>{card.description}</p>
              <a href={card.repoUrl} target="_blank" rel="noopener noreferrer">View Repository</a>
            </div>
          ) : null
        )}
      </div>
      <div className="buttons">
        <button className="swipe-left" onClick={prevCard}>
          Swipe Left
        </button>
        <button className="swipe-right" onClick={nextCard}>
          Swipe Right
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;
