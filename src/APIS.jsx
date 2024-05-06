import axios from "axios";
const baseUrl = "https://to-do-list.sintac.site/api";

/* ============================= Todo List ==============================*/
export const getAllTasks = async (userID) => {
  const response = await fetch(`${baseUrl}/tasks/${userID}`);
  if (!response.ok) throw "Error in get All tasks";
  return response;
};

export const addTask = async (dataTask) => {
  const response = await fetch(`${baseUrl}/addTask`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(dataTask),
  });
  if (!response.ok) throw "Error in post (add task)";
  return response;
};

export const EditTask = async (task) => {
  const response = await fetch(`${baseUrl}/endTask/${task.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "put",
    body: JSON.stringify(task.completed),
  });
  if (!response.ok) throw "Error in Edit task";
  return response;
};

export const EditDescriptionTask = async (task) => {
  const response = await fetch(
    `${baseUrl}/tasks/${task.id}/updateDescription`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "put",
      body: JSON.stringify(task.desc),
    }
  );
  if (!response.ok) throw "Error in Edit Description Task";
  return response;
};

export const deleteTask = async (taskID) => {
  const response = await fetch(`${baseUrl}/deleteTask/${taskID}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "delete",
  });
  if (!response.ok) throw "Error in delete task";
  return response;
};
/* ======================================================================*/

/* ============================= user apis ==============================*/
export const deleteUser = async (id) => {
  const response = await fetch(`${baseUrl}/deleteUser`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "delete",
    body: JSON.stringify(id),
  });
  if (!response.ok) throw "Error in delete user";
  return response;
};

export const editUser = async (formData) => {
  const response = await fetch(`${baseUrl}/userUpdate/${formData.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw "Error in edit user information";
  return response;
};

export const editUserImage = async (formData, id) => {
  const response = await axios.post(`${baseUrl}/updateImage/${id}`, formData);

  if (response.status !== 200) throw "Error in edit user image";
  return response.data;
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
