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
    <div className="container">
      <h1>Logs</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Height</th>
            <th>Health</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.stage}</td>
              <td>{log.height}</td>
              <td>{log.health}</td>
              <td>{new Date(log.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={clearLogs}>Clear Logs</button>
    </div>
  );
}

export default Logs;
