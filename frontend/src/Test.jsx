
// Test 3
// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import './TaskList.css';
// import { addTask, getAllTasks, updateTask, deleteTask } from './indexedDB';

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [reminderDate, setReminderDate] = useState(null);
//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     dueDate: null,
//     priority: 'Low',
//     labels: [], // Initialize labels array for the new task
//   });
//   const [editTaskId, setEditTaskId] = useState(null);
//   const [editTask, setEditTask] = useState({
//     title: '',
//     description: '',
//     dueDate: null,
//     priority: 'Low',
    
//   });
//   const [darkMode, setDarkMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const tasks = await getAllTasks();
//         setTasks(tasks);
//       } catch (error) {
//         console.error('Error fetching data: ', error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const handleAddTask = async () => {
//     if (newTask.title.trim() === '') return;

//     try {
//       await addTask({
//         ...newTask,
//         reminders: [] // Initialize reminders array for the new task
//       });
//       const updatedTasks = await getAllTasks();
//       setTasks(updatedTasks);
//       setNewTask({
//         title: '',
//         description: '',
//         dueDate: null,
//         priority: 'Low',
//       });
//     } catch (error) {
//       console.error('Error adding task: ', error);
//     }
//   };

//   const handleSetReminder = (taskId) => {
//     if (!reminderDate) return;

//     const updatedTasks = tasks.map((task) =>
//       task.id === taskId ? { ...task, reminders: [...task.reminders, reminderDate] } : task
//     );

//     try {
//       updateTask(taskId, updatedTasks.find((task) => task.id === taskId));
//       setTasks(updatedTasks);
//       setReminderDate(null);
//     } catch (error) {
//       console.error('Error updating task with reminder: ', error);
//     }
//   };

//   const handleToggleComplete = async (taskId) => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === taskId ? { ...task, completed: !task.completed } : task
//     );

//     try {
//       await updateTask(taskId, updatedTasks.find((task) => task.id === taskId));
//       setTasks(updatedTasks);
//     } catch (error) {
//       console.error('Error updating task: ', error);
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteTask(taskId);
//       const updatedTasks = await getAllTasks();
//       setTasks(updatedTasks);
//     } catch (error) {
//       console.error('Error deleting task: ', error);
//     }
//   };

//   const handleStartEdit = (taskId, task) => {
//     setEditTaskId(taskId);
//     setEditTask({ ...task });
//   };

//   const handleCancelEdit = () => {
//     setEditTaskId(null);
//     setEditTask({
//       title: '',
//       description: '',
//       dueDate: '',
//       priority: 'Low',
//       labels: [], // Initialize labels array for the new task
//     });
//   };

//   const [newComment, setNewComment] = useState({
//     text: '',
//   });

//   const handleSaveEdit = async () => {
//     if (editTask.title.trim() === '') return;

//     const updatedTask = {
//       ...editTask,
//       completed: tasks.find((task) => task.id === editTaskId)?.completed || false,
//     };

//     try {
//       await updateTask(editTaskId, updatedTask);
//       const updatedTasks = await getAllTasks();
//       setTasks(updatedTasks);
//       handleCancelEdit();
//     } catch (error) {
//       console.error('Error updating task: ', error);
//     }
//   };

//   const filteredTasks = tasks.filter(
//     (task) =>
//       task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchQuery.toLowerCase())

//   );

//   const handleAddComment = async (taskId) => {
//     if (newComment.text.trim() === '') return;
  
//     const updatedTasks = tasks.map((task) =>
//       task.id === taskId
//         ? {
//             ...task,
//             comments: [...(task.comments || []), { text: newComment.text, date: new Date() }],
//           }
//         : task
//     );
  
//     try {
//       await updateTask(taskId, updatedTasks.find((task) => task.id === taskId));
//       setTasks(updatedTasks);
//       setNewComment({ text: '' });
//     } catch (error) {
//       console.error('Error updating task with comment: ', error);
//     }
//   };

//   return (
//     <div className={darkMode ? 'dark' : 'light'}>
//       <div className="text-right p-[20px]">
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className="p-[10px] rounded"
//         >
//           {darkMode ? 'Light Mode :)' : 'Dark Mode :('}
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 p-[20px]">
//         Task List
//       </h2>
      
//       {/* Search Bar */}
//       <div className="mb-4 p-[30px]">
//         <label className="block text-sm font-semibold mb-1">Search:</label>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search for tasks"
//           className="border border-gray-300 rounded p-2 w-full text-black"
//         />
//       </div>

//       {/* Task List */}
//       <ul className="mb-4 p-[30px]">
//         {filteredTasks.map((task) => (
//           <li key={task.id} className="flex items-center justify-between border-b py-2">
//             {editTaskId === task.id ? (
//               <>
//                 <div>
//                   <label>Title:</label>
//                   <input
//                     type="text"
//                     value={editTask.title}
//                     onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
//                     className="border border-gray-300 rounded p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Description:</label>
//                   <input
//                     type="text"
//                     value={editTask.description}
//                     onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
//                     className="border border-gray-300 rounded p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Due Date:</label>
//                   <DatePicker
//                     selected={editTask.dueDate}
//                     onChange={(date) => setEditTask({ ...editTask, dueDate: date })}
//                     placeholderText="Select a due date"
//                     className="border border-gray-300 rounded p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Priority:</label>
//                   <select
//                     value={editTask.priority}
//                     onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
//                     className="border border-gray-300 rounded p-2"
//                   >
//                     <option value="Low">Low</option>
//                     <option value="Medium">Medium</option>
//                     <option value="High">High</option>
//                   </select>
//                 </div>
//                 <div className="flex">
//                   <button
//                     onClick={handleSaveEdit}
//                     className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={task.completed}
//                     onChange={() => handleToggleComplete(task.id)}
//                     className="mr-2"
//                   />
//                   <span className={task.completed ? 'line-through text-gray-500' : ''}>
//                     <div className="">{task.title}</div>
//                     <div className="">{task.description}</div>
//                     <div className="">{task.date}</div>
//                     <div className="">{task.priority}</div>
//                     <div className="">{task.label}</div>           
//                   </span>
//                 </div>
//                 {/* for comment sedction */}
//                 {/* <div className="">
//                 <textarea
//                   value={newComment.text}
//                   onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
//                   placeholder="Add a comment"
//                   className="border border-gray-300 rounded p-2 w-full"
//                 />
//                 <button
//                   onClick={() => handleAddComment(task.id)}
//                   className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2"
//                 >
//                   Add Comment
//                 </button>
//                 </div>
//  */}
//                 <div className="flex">
//                   <button
//                     onClick={() => handleDeleteTask(task.id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => handleStartEdit(task.id, task)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//       <h1 className="text-center text-gray-700 font-bold">Create New Task</h1>
//       <div className="mb-8 p-[30px]">
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">Title:</label>
//           <input
//             type="text"
//             value={newTask.title}
//             onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//             placeholder="New Task"
//             className="border border-gray-300 rounded p-2 w-full text-black"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">Description:</label>
//           <input
//             type="text"
//             value={newTask.description}
//             onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//             placeholder="Description"
//             className="border border-gray-300 rounded p-2 w-full text-black"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">Set Reminder:</label>
//           <DatePicker
//             selected={reminderDate}
//             onChange={(date) => setReminderDate(date)}
//             showTimeSelect
//             timeFormat="HH:mm"
//             timeIntervals={15}
//             dateFormat="MMMM d, yyyy h:mm aa"
//             placeholderText="Select a reminder date and time"
//             className="border border-gray-300 rounded p-2 w-full text-black"
//           />
//           <button
//             onClick={() => handleSetReminder(editTaskId)}
//             className="bg-yellow-500 text-white p-[10px] m-[20px] rounded hover:bg-yellow-600 mt-2"
//           >
//             Set Reminder
//           </button>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">Priority:</label>
//           <select
//             value={newTask.priority}
//             onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
//             className="border border-gray-300 rounded p-2 w-full text-black"
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//         <button
//           onClick={handleAddTask}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add Task
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskList;
