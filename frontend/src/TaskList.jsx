import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskList.css';
import { addTask, getAllTasks, updateTask, deleteTask } from './indexedDB';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: 'Low',
    labels: [],
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: 'Low',
  });
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState({
    taskId: null, // Added taskId to keep track of the task for which a comment is being added
    text: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAllTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchTasks();
  }, []);

  // const handleAddTask = async () => {
  //   if (newTask.title.trim() === '') return;

  //   try {
  //     await addTask({
  //       ...newTask,
  //       reminders: [],
  //       comments: [], // Initialize comments as an empty array for new tasks
  //     });
  //     const updatedTasks = await getAllTasks();
  //     setTasks(updatedTasks);
  //     setNewTask({
  //       title: '',
  //       description: '',
  //       dueDate: null,
  //       priority: 'Low',
  //     });
  //   } catch (error) {
  //     console.error('Error adding task: ', error);
  //   }
  // };
  const handleAddTask = async () => {
    if (newTask.title.trim() === '') return;
  
    try {
      await addTask({
        ...newTask,
        reminders: [],
        comments: [],
      });
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
      setNewTask({
        title: '',
        description: '',
        dueDate: null,
        priority: 'Low',
        labels: [],
      });
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };
  

  const handleToggleComplete = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    try {
      await updateTask(taskId, updatedTasks.find((task) => task.id === taskId));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleStartEdit = (taskId, task) => {
    setEditTaskId(taskId);
    setEditTask({ ...task });
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTask({
      title: '',
      description: '',
      dueDate: null,
      priority: 'Low',
      labels: [],
    });
  };

  const handleSaveEdit = async () => {
    if (editTask.title.trim() === '') return;

    const updatedTask = {
      ...editTask,
      completed: tasks.find((task) => task.id === editTaskId)?.completed || false,
    };

    try {
      await updateTask(editTaskId, updatedTask);
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleAddComment = async (taskId) => {
    if (newComment.text.trim() === '') return;

    try {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              comments: [...(task.comments || []), { text: newComment.text, date: new Date() }],
            }
          : task
      );

      setTasks(updatedTasks);
      await updateTask(taskId, { comments: updatedTasks.find((task) => task.id === taskId).comments });
    } catch (error) {
      console.error('Error updating task with comment: ', error);
    }

    setNewComment({ taskId: null, text: '' }); // Reset taskId and text after adding a comment
  };

  // const filteredTasks = tasks.filter(
  //   (task) =>
  //     (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //     (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  // );
  
  // Inside the TaskList component
const filteredTasks = tasks.filter((task) => {
  const normalizedSearchQuery = searchQuery.toLowerCase();

  return (
    (task.title && task.title.toLowerCase().includes(normalizedSearchQuery)) ||
    (task.description && task.description.toLowerCase().includes(normalizedSearchQuery)) ||
    (task.labels && task.labels.some((label) => label.toLowerCase().includes(normalizedSearchQuery)))
  );
});


  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <div className="text-right p-[20px]">
        <button onClick={() => setDarkMode(!darkMode)} className="p-[10px] rounded">
          {darkMode ? 'Light Mode :)' : 'Dark Mode :('}
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 p-[20px]">Task List</h2>

      <div className="mb-4 p-[30px]">
        <label className="block text-sm font-semibold mb-1">Search:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tasks"
          className="border border-gray-300 rounded p-2 w-full text-black"
        />
      </div>

      <ul className="mb-4 p-[30px]">
        {filteredTasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between border-b py-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                className="mr-2"
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                <div className="font-bold">
                  Title:
                  <span className="font-normal">{task.title}</span>
                </div>
                <div className="font-bold">
                  Description:
                  <span className="font-normal">{task.description}</span>
                </div>
                <div className="font-bold">
                  DueDate:
                  <span className="font-normal"> {task.reminderDate}</span>
                </div>
                <div className="font-bold">
                  Priority:
                  <span className="font-normal">  {task.priority}</span>
                </div>
                <div className="font-bold">
                  Label:
                  <span className="font-normal"> { task.labels}</span>
                </div>
                {task.comments && (
                  <div className="mt-2">
                    <strong>Comments:</strong>
                    <ul>
                      {task.comments.map((comment, index) => (
                        <li key={index}>{comment.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <textarea
                value={newComment.taskId === task.id ? newComment.text : ''}
                onChange={(e) => setNewComment({ taskId: task.id, text: e.target.value })}
                placeholder="Add a comment"
                className="border border-gray-300 rounded p-2 w-full text-black"
              />
              <button
                onClick={() => handleAddComment(task.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
              >
                Add Comment
              </button>
            </div>
            <div className="flex">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleStartEdit(task.id, task)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h1 className="text-center text-gray-700 font-bold">Create New Task</h1>
      <div className="mb-8 p-[30px]">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Title:</label>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="New Task"
            className="border border-gray-300 rounded p-2 w-full text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Description:</label>
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description"
            className="border border-gray-300 rounded p-2 w-full text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Set Reminder:</label>
          <DatePicker
            selected={newTask.dueDate}
            onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select a reminder date and time"
            className="border border-gray-300 rounded p-2 w-full text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Priority:</label>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full text-black"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
<div className="mb-4">
  <label className="block text-sm font-semibold mb-1">Labels:</label>
  <input
    type="text"
    value={newTask.labels.join(', ')}
    onChange={(e) => {
      const labels = e.target.value.split(',').map((label) => label.trim());
      setNewTask((prevTask) => ({ ...prevTask, labels }));
    }}
    placeholder="Add labels separated by commas"
    className="border border-gray-300 rounded p-2 w-full text-black"
  />
</div>

        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskList;
