import { ID, Query } from "appwrite";
import { DATABASE_ID, TABLE_ID, tablesDB } from "./lib/appwrite";

/* ============================= Todo List ==============================*/
export const getAllTasks = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [Query.equal("userId", userId)],
  });

  if (!response.rows) throw "Error in get tasks";

  return response?.rows;
};

export const addTask = async (dataTask) => {
  const response = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data: dataTask,
  });

  if (!response) throw "Error in post (add task)";

  return response;
};

export const editTask = async (task) => {
  const response = await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: task.id,
    data: { completed: task.completed },
  });

  if (!response) throw "Error in Edit task";
};

export const editDescriptionTask = async (task) => {
  const response = await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: task.id,
    data: { description: task.description },
  });

  if (!response) throw "Error in Edit Description Task";
};

export const deleteTask = async (taskID) => {
  const response = await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: taskID,
  });

  if (!response) throw "Error in delete task";
};
/* ======================================================================*/

/* ============================== Chatbot ================================*/
export const chatbot = async (msg) => {
  const response = await fetch(`http://localhost:5000/chatbot`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(msg),
  });
  if (!response.ok) throw "Error in EduGuide";
  return response;
};
/* ======================================================================*/
