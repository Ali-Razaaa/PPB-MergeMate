import React, { useState } from 'react';

const AddProject = () => {
  const [projectData, setProjectData] = useState({
    repoUrl: '',
    description: '',
    difficulty: 'easy',
    techStack: '',
    guidelines: '',
  });
  const [message, setMessage] = useState('');

  const oauthToken = process.env.REACT_APP_GITHUB_ACCESS_TOKEN
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const repoData = {
      name: projectData.repoUrl.split('/').pop(), // Extracting repo name from the URL
      description: projectData.description,
      private: false, // You can modify this to be true if you want private repos
      homepage: projectData.repoUrl,
      has_issues: true,
      has_projects: true,
      has_wiki: true,
    };

    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repoData),
      });

      if (!response.ok) {
        throw new Error('Failed to create repository');
      }

      const responseData = await response.json();
      setMessage(`Repository ${responseData.name} created successfully!`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg backdrop-blur-md border border-white/30 max-w-4xl w-full my-10">
        <h1 className="font-inter text-6xl font-extrabold text-center text-white mb-8 uppercase tracking-tight">
          Add Your Project
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Project Repository URL */}
          <div className="mb-6">
            <label htmlFor="repo-url" className="block text-lg font-medium text-gray-700 mb-2">Project Repository URL</label>
            <input
              type="url"
              id="repo-url"
              name="repoUrl"
              value={projectData.repoUrl}
              onChange={handleChange}
              placeholder="https://github.com/your-repo"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Project Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Project Description</label>
            <textarea
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly describe your project..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Project Difficulty */}
          <div className="mb-6">
            <label htmlFor="difficulty" className="block text-lg font-medium text-gray-700 mb-2">Project Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={projectData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <label htmlFor="tech-stack" className="block text-lg font-medium text-gray-700 mb-2">Tech Stack</label>
            <input
              type="text"
              id="tech-stack"
              name="techStack"
              value={projectData.techStack}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Contribution Guidelines */}
          <div className="mb-6">
            <label htmlFor="guidelines" className="block text-lg font-medium text-gray-700 mb-2">Contribution Guidelines</label>
            <textarea
              id="guidelines"
              name="guidelines"
              value={projectData.guidelines}
              onChange={handleChange}
              rows="4"
              placeholder="Describe how others can contribute..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Project
          </button>
        </form>

        {/* Message after submission */}
        {message && (
          <div className="mt-4 text-center text-lg text-white">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProject;
