import { Navigate, Outlet } from "react-router-dom";
import { UseGlobalUser } from "../auth/AuthUser";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function PrivateRoute() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const handleShowSidebar = () => {
    setOpenSidebar(!openSidebar);
  };
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
      <main className={`main-section ${openSidebar && "active"}`}>
        <Outlet />
      </main>
    </>
  );
}
