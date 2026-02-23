import React from "react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="mobileBottomNav">
      <NavLink to="/" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <i className="bi bi-house" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/library" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <i className="bi bi-collection" />
        <span>Library</span>
      </NavLink>

      <NavLink to="/listen-later" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <i className="bi bi-bookmark" />
        <span>Saved</span>
      </NavLink>

      <NavLink to="/login" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <i className="bi bi-person" />
        <span>Login</span>
      </NavLink>
    </div>
  );
}