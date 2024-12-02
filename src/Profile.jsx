import React, { useState, useEffect } from "react";

const Profile = () => {
  const [githubProfile, setGithubProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded GitHub Token
  const oauthToken = "process.env.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";  // Replace this with your actual token

  useEffect(() => {
    if (oauthToken) {
      const fetchGithubProfile = async () => {
        try {
          // Fetching GitHub profile
          const profileResponse = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${oauthToken}`,
            },
          });
          if (!profileResponse.ok) {
            throw new Error("Failed to fetch GitHub profile");
          }
          const profileData = await profileResponse.json();
          setGithubProfile(profileData);

          // Fetch repositories
          const reposResponse = await fetch(
            `https://api.github.com/users/${profileData.login}/repos`,
            {
              headers: {
                Authorization: `Bearer ${oauthToken}`,
              },
            }
          );
          const reposData = await reposResponse.json();
          setRepositories(reposData);

          // Fetch starred repositories
          const starredResponse = await fetch(
            `https://api.github.com/users/${profileData.login}/starred`,
            {
              headers: {
                Authorization: `Bearer ${oauthToken}`,
              },
            }
          );
          const starredData = await starredResponse.json();
          setStarredRepos(starredData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchGithubProfile();
    } else {
      setLoading(false); 
      setError("GitHub token is missing");
    }
  }, [oauthToken]);

  return (
    <div className="bg-gray-900 text-white flex w-[100%] h-auto">
      <div className="bg-gray-800 m-10 p-6 rounded-lg shadow-lg flex items-center space-x-6 w-[100%] h-auto flex-col">
        <img
          src={githubProfile ? githubProfile.avatar_url : "https://via.placeholder.com/150"}
          alt="Profile"
          className="h-[80vh] rounded-[50%]"
        />
        <div className="flex flex-col my-5 space-y-4 w-full">
          <h3 className="text-xl font-semibold">My profile</h3>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <>
              <p className="text-gray-400">Last login: {new Date().toLocaleString()}</p>
              <p className="text-gray-400">Location: {githubProfile.location || "Not provided"}</p>
              <p>{githubProfile.name || "Unknown Name"}</p>
              <p>{githubProfile.email || "No email available"}</p>
            </>
          )}
          <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400">
            Save
          </button>
        </div>
      </div>

      <div className="w-[100%] m-5 p-6 h-auto">
        {/* Repositories Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[100%] h-auto">
          <h3 className="text-xl font-semibold mb-4">Repositories</h3>
          {loading ? (
            <p className="text-gray-400">Loading repositories...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <ul className="space-y-4">
              {repositories.length === 0 ? (
                <li>No repositories found</li>
              ) : (
                repositories.map((repo) => (
                  <li key={repo.id} className="flex justify-between items-center border-b border-gray-600 pb-4 mb-4">
                    <span>{repo.name}</span>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400"
                    >
                      View Repository
                    </a>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Starred Repositories Section */}
        <div className="bg-gray-800 my-5 p-6 rounded-lg shadow-lg w-[100%] h-auto">
          <h3 className="text-xl font-semibold mb-4">Starred Repositories</h3>
          {loading ? (
            <p className="text-gray-400">Loading starred repositories...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <ul className="space-y-4">
              {starredRepos.length === 0 ? (
                <li>No starred repositories found</li>
              ) : (
                starredRepos.map((repo) => (
                  <li key={repo.id} className="flex justify-between items-center border-b border-gray-600 pb-4 mb-4">
                    <span>{repo.name}</span>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-400"
                    >
                      View Repository
                    </a>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
