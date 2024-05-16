import React from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/logs">Register</Link>
        </li>
        <li>
          <Link to="/settings">Register</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;