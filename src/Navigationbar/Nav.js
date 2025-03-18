import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import avtmale from "../images/avatar-male.jpg";
import avtfemale from "../images/avatarfm.png";
import notificationIcon from "../images/notification.png";
import logo from "../images/BoneX_Logo.png";
import chat from "../images/chat.png";
import "./nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anUser, setAnUser] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profilePicRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profilePicRef.current && !profilePicRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("userInfo");
    if (data) {
      setAnUser(true);
      const parsedUser = JSON.parse(data);
      setUser(parsedUser);
    }
  }, []);

  const notifications = [
    { id: 1, message: "You have a new message." },
    { id: 2, message: "Your appointment is confirmed." },
    { id: 3, message: "New updates are available." },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    let timer;
    if (showNotifications) {
      timer = setTimeout(() => {
        setShowNotifications(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showNotifications]);

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Bonex Logo" className="ign" />
      </Link>
      <Link to="/xray">X-ray Checker</Link>
      <Link to="/doctors">Doctors</Link>

      {anUser ? (
        <div className="user-logged">
          <span className="user-name">{user.firstName}</span>
          <div className="user-profile" style={{ position: "relative" }}>
            <img
              ref={profilePicRef}
              src={user.gender === 1 ? avtmale : avtfemale}
              alt="user-pic"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{ cursor: "pointer" }}
            />
            {showUserDropdown && (
              <div ref={dropdownRef} className="user-dropdown ">
                <Link to={ user.role==="Patient"?"/profile":"doctorprofile"}>View Profile</Link>
                <Link to="/changepassword">Change Password</Link>
              </div>
            )}
          </div>

          <Link to="/chat">
            <img src={chat} alt="chat" />
          
          </Link>

          <div className="notification-container" style={{ position: "relative" }}>
            <button
              className="notification-btn"
              onClick={toggleNotifications}
              aria-label="Toggle notifications"
            >
              <img src={notificationIcon} alt="Notification Icon" />
            </button>
            <div className={`notification-dropdown ${showNotifications ? "show" : ""}`}>
              <ul>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                      <span className="icon" aria-hidden="true">
                        🔔
                      </span>
                      <span className="message">{notification.message}</span>
                    </li>
                  ))
                ) : (
                  <li className="notification-item">
                    <span className="message">No new notifications</span>
                  </li>
                )}
              </ul>
              <Link to="/notifications" className="view-all">
                View All
              </Link>
            </div>
          </div>

          <Link onClick={()=>{ sessionStorage.clear();
              navigate("/login");
              window.location.reload();}} style={{ marginLeft: "10px" }}>
            Logout
          </Link>

        </div>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">SignUp</Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
