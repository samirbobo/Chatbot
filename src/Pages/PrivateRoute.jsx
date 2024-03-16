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
  } else {
    return (
      <div className={`container-layout ${openSidebar && "active"}`}>
        <Sidebar
          handleShowSidebar={handleShowSidebar}
          openSidebar={openSidebar}
        />
        <section className="main-section">
          <Outlet />
        </section>
      </div>
    );
  }
}
