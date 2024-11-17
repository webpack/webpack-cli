
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className="btn-primary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-secondary)' : 'var(--color-primary)',
            })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="btn-primary"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-secondary)' : 'var(--color-primary)',
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
