import { UseGlobalUser } from "../auth/AuthUser";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function Chatbot() {
  const [loading, setLoading] = useState(true);
  const { user } = UseGlobalUser();
  useEffect(() => {
    setLoading(true);
    const time = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => {
      clearTimeout(time);
    };
  }, []);
  return loading ? (
    <div className="center-loading">
      <Loading />
    </div>
  ) : (
    <h2>Hello {user}</h2>
  );
}
