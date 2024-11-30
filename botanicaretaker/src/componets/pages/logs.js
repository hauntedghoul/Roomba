import React, { useState, useEffect } from 'react';
import './logs.css';


function Logs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:4206/api/logs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchLogs();
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="logCon">
      <h1 className='header'>Logs</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Plant </th>
            <th>Soil Moisture</th>
            <th>Temperature</th>
            <th>Light Level</th>
            <th>Height</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody className='tb'>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.plantId}</td>
              <td>{log.soilMoisture}</td>
              <td>{log.temperature}</td>
              <td>{log.lightExposure}</td>
              <td>{log.plant.height}cm</td>
              <td>{log.plant.stage}</td>
            </tr>
          ))}

        </tbody>

      </table>
      <hr className='line' />
      <button className='btn' onClick={clearLogs}>Clear Logs</button>
    </div>
  );
}

export default Logs;
