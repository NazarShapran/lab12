import { useState, useEffect, useMemo } from 'react';
import './Todo.css';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const announce = (message: string) => {
    window.dispatchEvent(new CustomEvent('app-announce', { detail: message }));
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Announce item count when it changes
  useEffect(() => {
    const activeCount = todos.filter(t => !t.completed).length;
    announce(`${activeCount} items left`);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    announce(`Showing ${filter} tasks`);
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }, [todos, filter]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
    announce('Task added');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    announce('Task removed');
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    if (editValue.trim()) {
      setTodos(todos.map(t => t.id === editingId ? { ...t, text: editValue } : t));
      announce('Task updated');
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditingId(null);
  };

  const clearCompleted = () => {
    const count = todos.filter(t => t.completed).length;
    if (count > 0) {
      setTodos(todos.filter(t => !t.completed));
      announce(`${count} completed tasks cleared`);
    }
  };

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title" tabIndex={-1}>Task <span className="gradient-text">Manager</span></h1>
      
      <div className="todo-card">
        <form onSubmit={addTodo} className="todo-form">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
            aria-label="Add a new task"
          />
          <button type="submit" className="btn btn-primary" aria-label="Add task">Add</button>
        </form>

        <div className="todo-controls">
          <span className="items-left" aria-live="polite">{activeCount} items left</span>
          <div className="filter-buttons" role="group" aria-label="Filter tasks">
            {(['all', 'active', 'completed'] as FilterType[]).map(f => (
              <button 
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button 
            className="clear-btn"
            onClick={clearCompleted}
            aria-label="Clear all completed tasks"
          >
            Clear Completed
          </button>
        </div>

        <div className="todo-list" role="list">
          {filteredTodos.length === 0 ? (
            <p className="empty-state">No tasks {filter !== 'all' ? `in ${filter}` : 'yet'}.</p>
          ) : (
            filteredTodos.map(todo => (
              <div 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}
                role="listitem"
              >
                {editingId === todo.id ? (
                  <input 
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleEditKeyDown}
                    autoFocus
                    aria-label="Edit task text"
                  />
                ) : (
                  <div className="todo-item-content">
                    <div 
                      className="checkbox" 
                      onClick={() => toggleTodo(todo.id)}
                      role="checkbox"
                      aria-checked={todo.completed}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === ' ' && toggleTodo(todo.id)}
                      aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    >
                      {todo.completed && '✓'}
                    </div>
                    <span onClick={() => startEdit(todo)} aria-label="Click to edit task">
                      {todo.text}
                    </span>
                  </div>
                )}
                <button 
                  onClick={() => removeTodo(todo.id)} 
                  className="delete-btn"
                  aria-label={`Delete task: ${todo.text}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
