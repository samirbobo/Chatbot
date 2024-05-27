import { useEffect, useRef, useState } from "react";
import "../styles/toDoList.css";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import AlertModel from "../components/AlertModel";
import {
  EditDescriptionTask,
  EditTask,
  addTask,
  deleteTask,
  getAllTasks,
} from "../APIS";
import { UseGlobalUser } from "../auth/AuthUser";
import ErrorAlert from "../components/ErrorAlert";

export default function ToDoList() {
  const { user } = UseGlobalUser();
  const [loading, setLoading] = useState(false);
  const [loadingAllData, setLoadingAllData] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [todo, setTodo] = useState("");
  const [originalTodos, setOriginalTodos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [todoToShow, setTodoToShow] = useState("All");
  const [activeButton, setActiveButton] = useState(0);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const inputRef = useRef();

  const getTasks = async () => {
    setLoadingAllData(true);
    try {
      const response = await getAllTasks(user.id);
      const data = await response.json();
      const tasks = data.tasks.map((task) => {
        return {
          id: task.id,
          todo: task.desc,
          complete: task.is_completed === 1 ? true : false,
        };
      });
      setOriginalTodos(tasks.slice().reverse());
      setTodos(tasks.slice().reverse());
      if (tasks.length > 0) setShowTasks(true);
    } catch (error) {
      ErrorAlert("There is a problem with the server, please try again later");
    } finally {
      setLoadingAllData(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validName =
      /^(?:[1-9]-[a-zA-Z][a-zA-Z0-9]*|[a-zA-Z][a-zA-Z0-9]*)(?!.*[-$#!@%^&*{}[()\]></?"_+=.~-])/;

    if (!validName.test(todo)) {
      setErrorInput(true);
      return;
    }

    if (editId) {
      setLoading(true);
      try {
        await EditDescriptionTask({
          id: editId,
          desc: {
            desc: todo,
          },
        });
        const updatedTodos = todos.map((task) =>
          task.id === editId
            ? { id: editId, todo, complete: task.complete }
            : task
        );

        const updatedOriginalTodos = originalTodos.map((task) =>
          task.id === editId
            ? { id: editId, todo, complete: task.complete }
            : task
        );

        setTodos(updatedTodos);
        setOriginalTodos(updatedOriginalTodos);
        setEditId(null);
        setTodo("");
        return;
      } catch (error) {
        ErrorAlert("This task could not be Edit Description, please try again");
        setTodo("");
      } finally {
        setLoading(false);
      }
      return;
    }

    let newTodosOriginal = [];
    let newTodos = [];

    todos.length < 1 ? setLoadingAllData(true) : setLoading(true);
    try {
      const response = await addTask({
        name: todo,
        desc: todo,
        timeing: Date.now(),
        user_id: user.id,
        is_completed: "0",
      });
      const { task } = await response.json();
      newTodosOriginal = [
        { id: task.id, todo: task.desc, complete: false },
        ...originalTodos,
      ];
      newTodos = [{ id: task.id, todo: task.desc, complete: false }, ...todos];

      if (todo !== "" && todoToShow !== "Completed") {
        setTodos(newTodos);
      }
      setOriginalTodos(newTodosOriginal);
      setShowTasks(true);
      setTodo("");
    } catch (error) {
      ErrorAlert("This task could not be added, please try again");
      setTodo("");
    } finally {
      todos.length < 1 ? setLoadingAllData(false) : setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingAlert(true);
    try {
      await deleteTask(id);
      const deleteTodo = todos.filter((to) => to.id !== id);
      const deleteOriginalTodo = originalTodos.filter((to) => to.id !== id);
      setTodos(deleteTodo);
      setOriginalTodos(deleteOriginalTodo);
      setTodoId(null);
      closeDialog();
      setTodo("");
      setEditId(null);
      if (deleteOriginalTodo.length < 1) {
        setShowTasks(false);
      }
    } catch (error) {
      ErrorAlert("This task could not be deleted, please try again");
      setTodo("");
    } finally {
      setLoadingAlert(false);
    }
  };

  const closeDialog = () => {
    setModalOpen(false);
  };

  const toggleComplete = async (id) => {
    let completeTask = [];
    let completeOriginalTask = [];
    const task = originalTodos.find((ele) => ele.id === id);

    setLoading(true);
    try {
      await EditTask({
        id: id,
        completed: {
          is_completed: task.complete === true ? "0" : "1",
        },
      });
      completeTask = todos.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            complete: !task.complete,
          };
        } else {
          return task;
        }
      });

      completeOriginalTask = originalTodos.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            complete: !task.complete,
          };
        } else {
          return task;
        }
      });
      if (todoToShow === "All") {
        setTodos(completeTask);
      } else if (todoToShow === "Active") {
        const newTasks = completeTask.filter((todo) => !todo.complete);
        setTodos(newTasks);
      } else if (todoToShow === "Completed") {
        const newTasks = completeTask.filter((todo) => todo.complete);
        setTodos(newTasks);
      }
      setOriginalTodos(completeOriginalTask);
    } catch (error) {
      ErrorAlert("This task could not be Compelted, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const editTodo = todos.find((i) => i.id === id);
    setTodo(editTodo.todo);
    setEditId(id);
    inputRef.current.focus();
  };

  const updateTodoToShow = (activeBtnName, indexBtn) => {
    setTodoToShow(activeBtnName);
    setActiveButton(indexBtn);

    if (activeBtnName === "All") {
      setTodos(originalTodos);
    } else if (activeBtnName === "Active") {
      const newTasks = originalTodos.filter((todo) => !todo.complete);
      setTodos(newTasks);
    } else if (activeBtnName === "Completed") {
      const newTasks = originalTodos.filter((todo) => todo.complete);
      setTodos(newTasks);
    }
  };

  if (loadingAllData) {
    return (
      <div className="center-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="to-do-list">
      <div className="div-tittle">
        <h2 className="tittle">To Do List</h2>
        <span className="min-tittle">enter your task</span>
      </div>
      <div className="adding">
        <h5 className="add-tittle">Add New Task</h5>
        <form onSubmit={handleSubmit} className="add-task">
          <input
            className={`value-input ${errorInput && "error-input"}`}
            type="text"
            value={todo}
            onChange={(e) => {
              setTodo(e.target.value);
              setErrorInput(false);
            }}
            placeholder="add...."
            ref={inputRef}
          />
          <button className="btn-add" type="submit" disabled={loading}>
            {editId ? "Edit" : "Add"}
          </button>
        </form>
        {errorInput && (
          <p className="mes-error todo-error">
            A task cannot contain symbols or begin with numbers
          </p>
        )}
      </div>
      {showTasks && (
        <div className="tasks">
          <div className="bar-tasks">
            {["All", "Active", "Completed"].map((btnName, index) => (
              <button
                key={btnName}
                onClick={() => updateTodoToShow(btnName, index)}
                className={activeButton === index ? "true-btn btn" : "btn"}
              >
                {btnName === "All" ? btnName.toUpperCase() : btnName}
              </button>
            ))}
          </div>
          <ul className="tasks-list">
            {loading && (
              <div className="body-loader">
                <div className="loader"></div>
              </div>
            )}
            {todos.map((task) => {
              return (
                <li key={task.id} className="item">
                  <div className="first-item">
                    <input
                      className="check-item"
                      type="checkbox"
                      onChange={() => toggleComplete(task.id)}
                      checked={task.complete}
                    />
                    <p
                      className="task"
                      style={{
                        textDecoration: task.complete && "line-through",
                      }}
                    >
                      {task.todo}
                    </p>
                  </div>

                  <div className="sec-item">
                    <EditIcon
                      className="edit"
                      onClick={() => handleEdit(task.id)}
                    />
                    <DeleteIcon
                      className="trash"
                      onClick={() => {
                        setModalOpen(true);
                        setTodoId(task.id);
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {modalOpen && (
        <AlertModel
          closeDialog={closeDialog}
          handleDelete={handleDelete}
          todoId={todoId}
          content="Are you sure you want to delete the task?"
          loadingAlert={loadingAlert}
        />
      )}
    </section>
  );
}
