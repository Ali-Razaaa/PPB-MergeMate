import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Initial task data
const initialTasks = {
  todo: [
    { id: "task-1", content: "Task 1" },
    { id: "task-2", content: "Task 2" },
  ],
  inProgress: [
    { id: "task-3", content: "Task 3" },
    { id: "task-4", content: "Task 4" },
  ],
  completed: [{ id: "task-5", content: "Task 5" }],
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // GitHub Token (ensure to store it securely, e.g., using environment variables)
  const GITHUB_TOKEN = "your_personal_access_token";

  // Fetch GitHub notifications
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

  const moveTask = (columnId, taskId, direction) => {
    const columnOrder = ["todo", "inProgress", "completed"];
    const currentIndex = columnOrder.indexOf(columnId);
    const newIndex = currentIndex + direction;

    // Ensure the move stays within bounds
    if (newIndex < 0 || newIndex >= columnOrder.length) return;

    const currentColumn = [...tasks[columnId]];
    const targetColumn = [...tasks[columnOrder[newIndex]]];
    const taskIndex = currentColumn.findIndex((task) => task.id === taskId);
    const [movedTask] = currentColumn.splice(taskIndex, 1);
    targetColumn.push(movedTask);

    setTasks({
      ...tasks,
      [columnId]: currentColumn,
      [columnOrder[newIndex]]: targetColumn,
    });
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If dropped outside the board, do nothing
    if (!destination) return;

    // If the item was dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = [...tasks[source.droppableId]];
    const endColumn = [...tasks[destination.droppableId]];

    // If the task was moved within the same column
    if (source.droppableId === destination.droppableId) {
      const [removed] = startColumn.splice(source.index, 1);
      startColumn.splice(destination.index, 0, removed);

      setTasks({
        ...tasks,
        [source.droppableId]: startColumn,
      });
    } else {
      // If the task was moved between columns
      const [removed] = startColumn.splice(source.index, 1);
      endColumn.splice(destination.index, 0, removed);

      setTasks({
        ...tasks,
        [source.droppableId]: startColumn,
        [destination.droppableId]: endColumn,
      });
    }
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
    <div className="flex justify-around p-8 bg-gray-900 h-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        {["todo", "inProgress", "completed"].map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                className="w-1/3 p-4 rounded-lg shadow-xl bg-gray-300 m-5"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-2xl font-semibold text-center mb-4 capitalize">
                  {column}
                </h2>
                {tasks[column].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="p-4 mb-4 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-blue-50 flex flex-col bg-gray-800"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <p>{task.content}</p>
                        <div className="flex justify-between m-2">
                          <button
                            onClick={() => moveTask(column, task.id, -1)}
                            className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={column === "todo"}
                          >
                            Move Left
                          </button>
                          <button
                            onClick={() => moveTask(column, task.id, 1)}
                            className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={column === "completed"}
                          >
                            Move Right
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      {/* Notifications Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 mt-8">
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
          </div>
        ) : (
          <p className="text-gray-600 text-center">No notifications to display.</p>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
