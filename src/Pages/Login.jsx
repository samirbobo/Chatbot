import { useEffect, useState } from "react";
import { UseGlobalUser } from "../auth/AuthUser";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userName, setUserName] = useState("");
  const { user, login } = UseGlobalUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
    }
    return () => "loading....";
  }, [user, navigate]);

  const handleSubmit = () => {
    login(userName);
  };

  return (
    <div>
      <h2>Login Page</h2>
      <label>
        User Name
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}>Add User</button>
    </div>
  );
}
