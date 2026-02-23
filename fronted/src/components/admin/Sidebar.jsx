import React from "react";
import "./Sidebar.css";

const Sidebar = ({ setActive, active }) => {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">Admin Panel</h2>

      <div
        className={`sidebar-item ${active === "all" ? "active" : ""}`}
        onClick={() => setActive("all")}
      >
        All Questions
      </div>

      <div
        className={`sidebar-item ${active === "add" ? "active" : ""}`}
        onClick={() => setActive("add")}
      >
        Add Question
      </div>

      <div
        className={`sidebar-item ${active === "edit" ? "active" : ""}`}
        onClick={() => setActive("edit")}
      >
        Edit Question
      </div>
    </div>
  );
};

export default Sidebar;