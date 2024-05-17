import React from 'react';
import './home.css';

function Home() {
  return (
    <div className='home'>
      <div>
        {/* <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p> */}
        <div className='plant'>
        <img src='/images/watering.PNG' alt='watering' />
        <button>
          <img className='can' src='/images/plant7.PNG' alt='Plant' /> 
        </button>

        </div>
      </div>
    </div>

  );
}

export default Home;