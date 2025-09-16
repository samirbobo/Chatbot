import { Navigate, Outlet } from "react-router-dom";
import { UseGlobalUser } from "../auth/AuthUser";
import Sidebar from "../components/Sidebar";

export default function PrivateRoute() {
  const { openSidebar, handleShowSidebar } = UseGlobalUser();
  const { user } = UseGlobalUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Sidebar
        handleShowSidebar={handleShowSidebar}
        openSidebar={openSidebar}
      />

      {openSidebar && (
        <div
          className={`overlay ${openSidebar && "active"}`}
          onClick={handleShowSidebar}
        ></div>
      )}

      <main className={`main-section ${openSidebar && "active"}`}>
        <Outlet />
      </main>
    </>
  );
}
