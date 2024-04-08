import { useEffect, useState } from "react";
import Loading from "../components/Loading";
export default function ToDoList() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const time = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => {
      clearTimeout(time);
    };
  }, []);
  return loading ? <Loading /> : <h2>To Do List Page</h2>;
}
