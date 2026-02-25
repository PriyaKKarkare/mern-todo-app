import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./App.css";

const schema = yup.object().shape({
  title: yup.string().required("Please enter a Todo Title")
    .min(4, "Title must be 4 characters or more")
});

function App() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema)
  });

  // const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [serverError, setServerError] = useState("");
  const [editID, setEditID] = useState(null);
  // const [error, setError] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:5000/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      if (editID) {
        await axios.put(`http://localhost:5000/api/todos/update/${editID}`,
          { title: data.title });
        setEditID(null);
      } else {
        await axios.post("http://localhost:5000/api/todos/add", { title: data.title });
      }
      await fetchTodos();
      reset({ title: "" });
      setEditID(null);
    } catch (error) {
      if (error.response?.data?.errors) {
        //express-validator case
        setServerError(error.response.data.errors[0].msg);
      } else {
        setServerError("something went wrong, please try again later");
      }
    }
  };

  // const addTodo = async () => {
  //   if (!title.trim()) {
  //     // setError("Please enter a todo title");
  //     return;
  //   }
  //   // setError("");
  //   await axios.post("http://localhost:5000/api/todos/add", { title });
  //   console.log("title aahe hey:::---   ", title);
  //   setTitle("");
  //   fetchTodos();
  // };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/delete/${id}`);
    fetchTodos();
  };

  const updateTodo = async (todo) => {
    setEditID(todo._id);
    reset({ title: todo.title });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div className="todo-card">
          <h2>✨ MERN CRUD Todo App</h2>

          <div className="input-section">
            <div className="input-wrapper">
              <input
                {...register("title")}
                placeholder="Enter Todo"
                className={`${errors.title ? "input-error" : ""} ${editID ? "edit-mode" : ""}`}
              />
              {errors.title && (
                <p className="error-text">{errors.title.message}</p>
              )}
              {serverError && (<p className="server-error-box">{serverError}</p>)}
            </div>
            <button className="add-btn" type="submit">
              {editID ? "Update" : "Add"}
            </button>
            {editID && (
              <button
                type="button"
                onClick={() => {
                  setEditID(null);
                  reset();
                }}
              >
                Cancel
              </button>
            )}
          </div>
         
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <span>{todo.title}</span>
                <div className="btn-group">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => updateTodo(todo)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
}

export default App;