import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { CiEdit } from "react-icons/ci";
import { CiSquareRemove } from "react-icons/ci";
import "../styles/toDoList.css";
// import shortid from "shortid";

export default function ToDoList() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const time = setTimeout(() => {
      setLoading(false);
    }, 20);
    return () => {
      clearTimeout(time);
    };
  }, []);

  const [todo, setTodo] = useState("");
  let [todos, setTodos] = useState([]);
  const [todoToShow, setTodoToShow] = useState("all");
  const [activeButton, setActiveButton] = useState(null);
  const [editId, setEditId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [todoId, setTodoId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const editTodo = todos.find((i) => i.id === editId);

      const updatedTodos = todos.map((t) =>
        t.id === editTodo.id
          ? (t = { id: t.id, todo, complete: t.complete })
          : { id: t.id, todo: t.todo, complete: t.complete }
      );
      setTodos(updatedTodos);
      setEditId(0);
      setTodo("");
      return;
    }

    if (todo !== "") {
      setTodos([
        { id: `${todo}-${Date.now()}`, todo, complete: false },
        ...todos,
      ]);

      setTodo("");
    }
  };

  const handleDelete = (id) => {
    const delTodo = todos.filter((to) => to.id !== id);
    setTodos([...delTodo]);
    setTodoId(null);
    closeDialog();
  };

  const closeDialog = () => {
    setModalOpen(false);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            complete: !t.complete,
          };
        } else {
          return t;
        }
      })
    );
  };

  const handleEdit = (id) => {
    const editTodo = todos.find((i) => i.id === id);
    setTodo(editTodo.todo);
    setEditId(id);
  };

  const updateTodoToShow = (s, index) => {
    setTodoToShow(s);
    setActiveButton(index);
  };

  if (todoToShow === "active") {
    todos = todos.filter((t) => !t.complete);
  } else if (todoToShow === "complete") {
    todos = todos.filter((t) => t.complete);
  }

  return loading ? (
    <div className="center-loading">
      <Loading />
    </div>
  ) : (
    <div>
      <div className="div-tittle">
        <h2 className="tittle">To Do List</h2>
        <span className="min-tittle">enter your task</span>
      </div>

      <div className="adding">
        <h5 className="add-tittle">Add New Task</h5>
        <form onSubmit={handleSubmit}>
          <input
            className="value-input"
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="add...."
          />
          <button className="btn-add" type="submit">
            {" "}
            {editId ? "Edit" : "Add"}
          </button>
        </form>
      </div>

      <div className="tasks">
        <div className="bar-tasks">
          <button
            style={{
              marginRight: "50px",
              border: "1px solid #E2E6EE",
              borderRadius: "12px",
              width: "97px",
              height: "37px",
              padding: "12px",
              cursor: "pointer",
            }}
            onClick={() => updateTodoToShow("all", 0)}
            className={
              activeButton === 0 || activeButton === null ? "true-btn" : ""
            }
          >
            ALL
          </button>
          <button
            style={{
              marginRight: "50px",
              border: "1px solid #E2E6EE",
              borderRadius: "12px",
              width: "97px",
              height: "37px",
              padding: "12px",
              cursor: "pointer",
            }}
            onClick={() => updateTodoToShow("active", 1)}
            className={activeButton === 1 ? "true-btn" : ""}
          >
            Active
          </button>
          <button
            style={{
              marginRight: "50px",
              border: "1px solid #E2E6EE",
              borderRadius: "12px",
              width: "97px",
              height: "37px",
              padding: "12px",
              cursor: "pointer",
            }}
            onClick={() => updateTodoToShow("complete", 2)}
            className={activeButton === 2 ? "true-btn" : ""}
          >
            Completed
          </button>
        </div>
        <ul>
          {todos.map((t) => {
            return (
              <div key={t.id} className="item">
                <div className="first-item">
                  <input
                    className="check-item"
                    type="checkbox"
                    onChange={() => toggleComplete(t.id)}
                    checked={t.complete}
                  ></input>

                  <li
                    className="task"
                    key={t.id}
                    style={{ textDecoration: t.complete ? "line-through" : "" }}
                  >
                    {t.todo}
                  </li>
                </div>
                <div className="sec-item">
                  <CiEdit
                    className="edit"
                    size={25}
                    onClick={() => handleEdit(t.id)}
                  />
                  <CiSquareRemove
                    className="trash"
                    size={25}
                    onClick={() => {
                      setModalOpen(true);
                      setTodoId(t.id);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </ul>
      </div>

      {modalOpen && (
        <div className="back">
          <div className="allert">
            <div className="top-allert">
              <CiSquareRemove className="end-trash" />
              <h2 className="msg-sure">
                Are you sure you want to delete the task?
              </h2>
            </div>
            <div className="bottom-allert">
              <button className="btn-sure" onClick={closeDialog}>
                {" "}
                No
              </button>
              <button className="btn-sure" onClick={() => handleDelete(todoId)}>
                {" "}
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
