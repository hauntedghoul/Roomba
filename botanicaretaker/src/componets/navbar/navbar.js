import React from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/"><h2>Botani Caretaker</h2></Link>
        </li>
        <li>
          <Link to="/logs"><img className='NavImg' src='/images/Logs.PNG' /></Link>
        </li>
        <li>
          <Link to="/settings"><img className='NavImg' src='/images/Setting.PNG' /></Link>
        </li>
        <li>
          <Link to="/save"><img className='NavImg' src='/images/Save.PNG' /></Link>
        </li>
      </ul>
      <img className='Shelf' src='images/shelf.png' alt='shelf' />  
    </nav>
  );
}

export default Navbar;