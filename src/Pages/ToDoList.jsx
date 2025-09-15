import { useEffect, useRef, useState } from "react";
import "../styles/toDoList.css";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import AlertModel from "../components/AlertModel";
import {
  editDescriptionTask,
  editTask,
  addTask,
  deleteTask,
  getAllTasks,
} from "../APIS";
import { UseGlobalUser } from "../auth/AuthUser";
import ErrorAlert from "../components/ErrorAlert";
import { useTranslation } from "react-i18next";

export default function ToDoList() {
  const { user } = UseGlobalUser();
  const [loading, setLoading] = useState(false);
  const [loadingAllData, setLoadingAllData] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [todoDesc, setTodoDesc] = useState("");
  const [originalTodos, setOriginalTodos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [activeButton, setActiveButton] = useState(0);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const inputRef = useRef();
  const { t } = useTranslation();
  const [todoToShow, setTodoToShow] = useState(t("all"));

  useEffect(() => {
    const getTasks = async () => {
      setLoadingAllData(true);
      try {
        const data = await getAllTasks(user.$id);
        const tasks = data.map((task) => ({
          $id: task.$id,
          description: task.description,
          completed: task.completed,
        }));
        setOriginalTodos(tasks.slice().reverse());
        setTodos(tasks.slice().reverse());
        if (tasks.length > 0) setShowTasks(true);
      } catch (error) {
        ErrorAlert(
          "There is a problem with the server, please try again later"
        );
      } finally {
        setLoadingAllData(false);
      }
    };

    getTasks();
  }, [user.$id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validName =
      /^(?:[1-9]-[\p{L}][\p{L}0-9]*|[\p{L}][\p{L}0-9]*)(?!.*[-$#!@%^&*{}[()\]></?"_+=.~-])/u;

    if (!validName.test(todoDesc)) {
      setErrorInput(true);
      return;
    }

    if (editId) {
      setLoading(true);
      try {
        await editDescriptionTask({
          id: editId,
          description: todoDesc,
        });
        const updatedTodos = todos.map((task) =>
          task.$id === editId
            ? { $id: editId, description: todoDesc, completed: task.completed }
            : task
        );

        const updatedOriginalTodos = originalTodos.map((task) =>
          task.$id === editId
            ? { $id: editId, description: todoDesc, completed: task.completed }
            : task
        );

        setTodos(updatedTodos);
        setOriginalTodos(updatedOriginalTodos);
        setEditId(null);
        setTodoDesc("");
        return;
      } catch (error) {
        ErrorAlert("This task could not be Edit Description, please try again");
        setTodoDesc("");
      } finally {
        setLoading(false);
      }
      return;
    }

    let newTodosOriginal = [];
    let newTodos = [];

    todos.length < 1 ? setLoadingAllData(true) : setLoading(true);
    try {
      const task = await addTask({
        description: todoDesc,
        userId: user.$id,
        completed: false,
      });
      newTodosOriginal = [
        {
          $id: task.$id,
          description: task.description,
          completed: task.completed,
        },
        ...originalTodos,
      ];
      newTodos = [
        {
          $id: task.$id,
          description: task.description,
          completed: task.completed,
        },
        ...todos,
      ];

      if (todoDesc !== "" && todoToShow !== t("completed")) {
        setTodos(newTodos);
      }
      setOriginalTodos(newTodosOriginal);
      setShowTasks(true);
      setTodoDesc("");
    } catch (error) {
      ErrorAlert("This task could not be added, please try again");
      setTodoDesc("");
    } finally {
      todos.length < 1 ? setLoadingAllData(false) : setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingAlert(true);
    try {
      await deleteTask(id);
      const deleteTodo = todos.filter((to) => to.$id !== id);
      const deleteOriginalTodo = originalTodos.filter((to) => to.$id !== id);
      setTodos(deleteTodo);
      setOriginalTodos(deleteOriginalTodo);
      setTodoId(null);
      closeDialog();
      setTodoDesc("");
      setEditId(null);
      if (deleteOriginalTodo.length < 1) {
        setShowTasks(false);
      }
    } catch (error) {
      ErrorAlert("This task could not be deleted, please try again");
      setTodoDesc("");
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
    const task = originalTodos.find((ele) => ele.$id === id);

    setLoading(true);
    try {
      await editTask({
        id: id,
        completed: !task.completed,
      });
      completeTask = todos.map((task) => {
        if (task.$id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        } else {
          return task;
        }
      });

      completeOriginalTask = originalTodos.map((task) => {
        if (task.$id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        } else {
          return task;
        }
      });
      console.log(todoToShow);
      if (todoToShow === t("all")) {
        setTodos(completeTask);
      } else if (todoToShow === t("active")) {
        const newTasks = completeTask.filter((todo) => !todo.completed);
        setTodos(newTasks);
      } else if (todoToShow === t("completed")) {
        const newTasks = completeTask.filter((todo) => todo.completed);
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
    const editTodo = todos.find((i) => i.$id === id);
    setTodoDesc(editTodo.description);
    setEditId(id);
    inputRef.current.focus();
  };

  const updateTodoToShow = (activeBtnName, indexBtn) => {
    setTodoToShow(activeBtnName);
    setActiveButton(indexBtn);

    if (activeBtnName === t("all")) {
      setTodos(originalTodos);
    } else if (activeBtnName === t("active")) {
      const newTasks = originalTodos.filter((todo) => !todo.completed);
      setTodos(newTasks);
    } else if (activeBtnName === t("completed")) {
      const newTasks = originalTodos.filter((todo) => todo.completed);
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
        <h2 className="tittle">{t("todoList")}</h2>
        <span className="min-tittle">{t("enterTask")}</span>
      </div>
      <div className="adding">
        <h5 className="add-tittle">{t("addNewTask")}</h5>
        <form onSubmit={handleSubmit} className="add-task">
          <input
            className={`value-input ${errorInput && "error-input"}`}
            type="text"
            value={todoDesc}
            onChange={(e) => {
              setTodoDesc(e.target.value);
              setErrorInput(false);
            }}
            placeholder={t("newTask")}
            ref={inputRef}
          />
          <button className="btn-add" type="submit" disabled={loading}>
            {editId ? t("edit") : t("add")}
          </button>
        </form>
        {errorInput && <p className="mes-error todo-error">{t("todoError")}</p>}
      </div>
      {showTasks && (
        <div className="tasks">
          <div className="bar-tasks">
            {[t("all"), t("active"), t("completed")].map((btnName, index) => (
              <button
                key={btnName}
                onClick={() => updateTodoToShow(btnName, index)}
                className={activeButton === index ? "true-btn btn" : "btn"}
              >
                {btnName === t("all") ? btnName.toUpperCase() : btnName}
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
                <li key={task.$id} className="item">
                  <div className="first-item">
                    <input
                      className="check-item"
                      type="checkbox"
                      onChange={() => toggleComplete(task.$id)}
                      checked={task.completed}
                    />
                    <p
                      className="task"
                      style={{
                        textDecoration: task.complete && "line-through",
                      }}
                    >
                      {task.description}
                    </p>
                  </div>

                  <div className="sec-item">
                    <EditIcon
                      className="edit"
                      onClick={() => handleEdit(task.$id)}
                    />
                    <DeleteIcon
                      className="trash"
                      onClick={() => {
                        setModalOpen(true);
                        setTodoId(task.$id);
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
          content={t("deleteTaskConfirm")}
          loadingAlert={loadingAlert}
        />
      )}
    </section>
  );
}
