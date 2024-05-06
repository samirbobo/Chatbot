import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Chatbot from "./Pages/Chatbot";
import PrivateRoute from "./Pages/PrivateRoute";
import GPACalculator from "./Pages/GPACalculator";
import ToDoList from "./Pages/ToDoList";
import Setting from "./Pages/Setting";
import "./styles/chatbot.css";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Chatbot />} />
        <Route path="gpa-calculator" element={<GPACalculator />} />
        <Route path="to-do-list" element={<ToDoList />} />
        <Route path="setting" element={<Setting />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
