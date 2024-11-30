import React from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/"><h2 className='title'>Botani Caretaker</h2></Link>
        </li>
        <li>
          <Link to="/logs"><img className='NavImg' src='/images/Logs.PNG' alt='logs'/></Link>
        </li>
        <li>
          <Link to="/settings"><img className='NavImg' src='/images/Setting.PNG' alt='setting'/></Link>
        </li>
        <li>
          <Link to="/save"><img className='NavImg' src='/images/Save.PNG' alt='save'/></Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;