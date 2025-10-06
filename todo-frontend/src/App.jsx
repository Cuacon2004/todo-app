import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/api/todos")
      .then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await axios.post("http://localhost:4000/api/todos", { text });
    setTodos([...todos, res.data]);
    setText("");
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:4000/api/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleCompleted = async (todo) => {
    const res = await axios.put(`http://localhost:4000/api/todos/${todo.id}`, {
      text: todo.text,
      completed: !todo.completed
    });
    setTodos(todos.map(t => (t.id === todo.id ? res.data : t)));
  };

  const editTodo = async (todo) => {
    const newText = prompt("Edit task:", todo.text);
    if (!newText) return;
    const res = await axios.put(`http://localhost:4000/api/todos/${todo.id}`, {
      text: newText,
      completed: todo.completed
    });
    setTodos(todos.map(t => (t.id === todo.id ? res.data : t)));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">Todo App</h1>
        <div className="flex mb-4">
          <input
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter task..."
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
          >Add</button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg">
              <span>
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => toggleCompleted(todo)}
                  className="mr-2"
                />
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.text}
                </span>
              </span>
              <span>
                <button onClick={() => editTodo(todo)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500">Delete</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
