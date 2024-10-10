
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
 return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="btn-secondary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            })}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
