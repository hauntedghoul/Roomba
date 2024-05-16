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
          <Link to="/logs">Logs</Link>
        </li>
        <li>
          <Link to="/setting">Setting</Link>
        </li>
        <li>
          <Link to="/save">Save</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;