const data = [
  {
    name: "main.jsx",
    language: "javascript",
    content:
      "import React from 'react';\n import './main.css'; \n import ReactDOM from 'react-dom';\nimport App from './App';\n\nReactDOM.render(<App />, document.getElementById('root'));",
  },
  {
    name: "App.jsx",
    language: "javascript",
    content:
      "import React, { useState } from 'react';\nimport TodoList from './TodoList';\nimport TodoForm from './TodoForm';\n\nconst App = () => {\n    const [todos, setTodos] = useState([]);\n\n    const addTodo = (todo) => {\n        setTodos([...todos, todo]);\n    };\n\n    const removeTodo = (index) => {\n        const newTodos = todos.filter((_, i) => i !== index);\n        setTodos(newTodos);\n    };\n\n    return (\n        <div className=\"container mx-auto p-4\">\n            <h1 className=\"text-2xl font-bold mb-4 text-sky-800\">Todo App</h1>\n            <TodoForm addTodo={addTodo} />\n            <TodoList todos={todos} removeTodo={removeTodo} />\n        </div>\n    );\n};\n\nexport default App;",
  },
  {
    name: "TodoList.jsx",
    language: "javascript",
    content:
      'import React from \'react\';\n\nconst TodoList = ({ todos, removeTodo }) => {\n    return (\n        <ul className="list-disc pl-5">\n            {todos.map((todo, index) => (\n                <li key={index} className="flex justify-between items-center mb-2">\n                    <span>{todo}</span>\n                    <button onClick={() => removeTodo(index)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>\n                </li>\n            ))}\n        </ul>\n    );\n};\n\nexport default TodoList;',
  },
  {
    name: "TodoForm.jsx",
    language: "javascript",
    content:
      'import React, { useState } from \'react\';\n\nconst TodoForm = ({ addTodo }) => {\n    const [inputValue, setInputValue] = useState(\'\');\n\n    const handleSubmit = (e) => {\n        e.preventDefault();\n        if (inputValue) {\n            addTodo(inputValue);\n            setInputValue(\'\');\n        }\n    };\n\n    return (\n        <form onSubmit={handleSubmit} className="mb-4">\n            <input\n                type="text"\n                value={inputValue}\n                onChange={(e) => setInputValue(e.target.value)}\n                className="border p-2 rounded w-full"\n                placeholder="Add a new todo"\n            />\n            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Add Todo</button>\n        </form>\n    );\n};\n\nexport default TodoForm;',
  },
];
