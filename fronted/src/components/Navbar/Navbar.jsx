import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../contexts/userContext";
import api from "../../utils/api";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { Token, setToken } = useContext(userContext);

  let isAdmin = false;
  if (Token) {
    try {
      const decoded = jwtDecode(Token);
      if (decoded.email === "roy3936f@gmail.com") {
        isAdmin = true;
      }
    } catch (error) {
      console.log("Invalid token");
    }
  }

  const handleLogout = async () => {
    try {
      await api.post("/api/user-login/logout");
      localStorage.removeItem("token");
      setToken(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="logo-highlight">PrepTALK</span> AI
      </div>

      <ul className="nav-links">
        <li><a  href="" onClick={()=>navigate("/")} >Home</a></li>
        <li><a href="" onClick={()=>navigate("/login")}>LOgin</a></li>
        <li><a href="" onClick={()=>navigate('/domain')}>Interview</a></li>
        <li><a href="" onClick={()=>navigate("/dashboard")}>Dashboard</a></li>
       
        {isAdmin && (
          <li onClick={() => navigate("/admin")} className="isAdmin">
            Admin Panel
          </li>
        )}
      </ul>

      {Token ? (
        <button className="navbtn" onClick={handleLogout}>Logout</button>
      ) : (
        <button className="navbtn" onClick={() => navigate("/login")}>Get Started</button>
      )}
    </nav>
  );
};

export default Navbar;