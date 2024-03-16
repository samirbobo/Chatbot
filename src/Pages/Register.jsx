import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseGlobalUser } from "../auth/AuthUser";

export default function Register() {
  const { user } = UseGlobalUser();
  const navigate = useNavigate();
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
    }
    return () => "loading....";
  }, [user, navigate]);
  return <h2>Register Page</h2>;
}
