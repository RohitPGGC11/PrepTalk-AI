import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import AllQuestions from "../../components/admin/AllQuestions";
import AddQuestion from "../../components/admin/AddQuestion";
import EditQuestion from "../../components/admin/EditQuestion";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [active, setActive] = useState("all");

  const renderComponent = () => {
    switch (active) {
      case "all":
        return <AllQuestions />;
      case "add":
        return <AddQuestion />;
      case "edit":
        return <EditQuestion />;
      default:
        return <AllQuestions />;
    }
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <Sidebar setActive={setActive} active={active} />
      </aside>

      <main className="admin-content">
        {renderComponent()}
      </main>
    </div>
  );
};

export default AdminDashboard;