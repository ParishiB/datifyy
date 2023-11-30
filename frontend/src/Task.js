// src/components/Task.js

import React from 'react';

const Task = ({ task, onToggleComplete, onDelete, onStartEdit }) => {
  return (
    <div className="border p-4 mb-4 rounded shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="mr-2"
          />
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">{`Due Date: ${task.dueDate}`}</span>
          <span className={`text-sm ${getPriorityColor(task.priority)}`}>
            Priority: {task.priority}
          </span>
        </div>
        <div className="flex items-center">
          <button onClick={() => onStartEdit(task.id)} className="mr-2 text-blue-500">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-500">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Low':
      return 'text-green-500';
    case 'Medium':
      return 'text-yellow-500';
    case 'High':
      return 'text-red-500';
    default:
      return '';
  }
};

export default Task;
