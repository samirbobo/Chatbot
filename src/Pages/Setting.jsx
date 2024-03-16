import { useEffect, useState } from "react";
import Loading from "../components/Loading";
export default function Setting() {
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
  return loading ? (
    <div className="center-loading">
      <Loading />
    </div>
  ) : (
    <h2>Setting page</h2>
  );
}
