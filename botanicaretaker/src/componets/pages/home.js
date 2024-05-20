import React from 'react';
import './home.css';

function Home() {
  const createPlant = async () => {
    try {
      const response = await fetch('http://localhost:4206/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantId: 1, // Use an incrementing ID or a unique value
          name: 'Test Plant'
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Plant created:', data);
      return data._id; // Assuming the response contains the created plant with an _id field
    } catch (error) {
      console.error('Error creating plant:', error);
      alert('Failed to create plant');
      return null;
    }
  };

  const handleTestLog = async () => {
    const plantId = await createPlant();
    if (!plantId) return;

    try {
      const response = await fetch('http://localhost:4206/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantId: plantId,
          height: 20,
          health: 'Healthy',
          stage: 'Testing'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty response
      if (response.status === 204) {
        console.log('Log created successfully');
        alert('Log created successfully');
        return;
      }

      const responseBody = await response.text();
      console.log('Raw response body:', responseBody);

      const data = JSON.parse(responseBody); // Parse the response text as JSON
      console.log('Log created:', data);
      alert('Log created successfully');
    } catch (error) {
      console.error('Error creating log:', error);
      alert('Failed to create log');
    }
  };

  return (
    <div className='home'>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
      <button onClick={handleTestLog}>Test Log</button>
    </div>
  );
}

export default Home;
