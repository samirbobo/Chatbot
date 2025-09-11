import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <h1>404</h1>
      <h2>Not Found Page</h2>
      <p>
        There is no page with this name! Return to the{" "}
        <Link to="/" style={{ color: "#036666", fontWeight: "bold" }}>
          EduGuide Page
        </Link>
      </p>
    </section>
  );
}
