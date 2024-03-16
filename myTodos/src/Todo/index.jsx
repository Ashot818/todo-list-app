import { Button, Divider, Input, List, Space } from "antd";
import { useEffect, useState } from "react";

export default function Todo() {
    //** states */
    const [todos, setTodos] = useState([]);
    const [doneTodos, setDoneTodos] = useState([]);
    const [todoText, setTodoText] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    
    useEffect(() => {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
      const storedDoneTodos = localStorage.getItem('doneTodos');
      if (storedDoneTodos) {
        setDoneTodos(JSON.parse(storedDoneTodos));
      }
    }, []);
  
    useEffect(() => {
      if (todos.length > 0) {
        localStorage.setItem('todos', JSON.stringify(todos));
      } else {
        localStorage.removeItem('todos'); // Delete the item if todos is empty
      }
    }, [todos]);
    //** add todo list */
    const addTodo = () => {
      if (editingIndex !== null) {
        // edit add new todo
        const updatedTodos = todos.map((todo, index) => {
          if (index === editingIndex) {
            return editText;
          }
          return todo;
        });
        setTodos(updatedTodos);
        setEditingIndex(null);
        setEditText('');
      } else {
        // add a new todo
        if (todoText.trim() !== '') {
          setTodos([...todos, todoText]);
          setTodoText('');
        }
      }
    };
    //deleting todo
    const removeTodo = (index) => {
      const updatedTodos = todos.filter((_, i) => i !== index);
      setTodos(updatedTodos);
    };
  
    //editing todo
    const editTodo = (index, text) => {
      setEditingIndex(index);
      setEditText(text);
    };
    //show my this todo in done list
    const handleDoneTodos = (index) => {

      const doneTodo = todos[index];
      const updatedTodos = todos.filter((_, i) => i !== index);
      setTodos(updatedTodos);
      setDoneTodos([...doneTodos, doneTodo]);
      localStorage.setItem('doneTodos',JSON.stringify([...doneTodos, doneTodo]))
      
    };
  
    return (
      <div className="todo-body">
        <h1>Todo List</h1>
  
        <Space.Compact style={{ width: '100%' }}>
          <Input
            type="text"
            value={editingIndex !== null ? editText : todoText}
            onChange={(e) =>
              editingIndex !== null ? setEditText(e.target.value) : setTodoText(e.target.value)
            }
            placeholder="Enter a new todo"
            onKeyDown={(e) => (e.key === 'Enter' ? addTodo() : '')}
          />
          <Button onClick={addTodo} type="primary">
            {editingIndex !== null ? 'Update' : 'Submit'}
          </Button>
        </Space.Compact>
  
        <List
          size="small"
          bordered
          dataSource={todos.map((todo, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => (e.key === 'Enter' ? addTodo() : '')}
                  />
                  <Button
                    style={{ marginLeft: '5px' }}
                    onClick={addTodo}
                    size="small"
                    type="primary"
                  >
                    {editingIndex !== null ? 'Update' : 'Submit'}
                  </Button>
                </div>
              ) : (
                <div>
                  {todo}
                  <Button
                    style={{ margin: '4px 5px' }}
                    size="small"
                    onClick={() => editTodo(index, todo)}
                    type="primary"
                  >
                    Edit
                  </Button>
                  {editingIndex === null && (
                    <Button
                      style={{ margin: '1px' }}
                      size="small"
                      onClick={() => removeTodo(index)}
                      type="primary"
                      danger
                    >
                      Delete
                    </Button>
                  )}
                  {editingIndex === null && (
                    <Button
                      style={{ marginLeft: '4px' }}
                      size="small"
                      onClick={() => handleDoneTodos(index)}
                      type="default"
                    >
                      Done
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
  
        <Divider />  {/*Done todo list*/}
  
        <h1>Done Todos List</h1>
        <List
          size="small"
          bordered
          dataSource={doneTodos}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    );
  }
  