import React, { useState, useEffect } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // GitHub Token (ensure to store it securely, e.g., using environment variables)
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_ACCESS_TOKEN
  // Fetch GitHub notifications on component mount
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetch("https://api.github.com/notifications", {
          method: "GET",
          headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub notifications");
        }

        const githubNotifications = await response.json();
        setNotifications(githubNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Loading Notifications...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow border-l-4 ${
                  notification.reason === "review_requested"
                    ? "border-blue-500 bg-blue-50"
                    : notification.reason === "merged"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <p className="text-gray-800">
                  <strong>{notification.reason.toUpperCase()}</strong>: {notification.subject.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{new Date(notification.updated_at).toLocaleString()}</p>
              </div>
            ))}
            <button
              onClick={clearNotifications}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear All Notifications
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No notifications to display.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
