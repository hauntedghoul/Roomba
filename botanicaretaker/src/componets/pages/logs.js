import React, { useState, useEffect } from 'react';
import './logs.css'

function Logs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('http://localhost:4206/api/logs');
      const data = await response.json();
      console.log(data)
      setLogs(data)
    };
    fetchLogs();
  }, []);

  return (
  <div className="container">
    <h1>Logs</h1>
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
        {/* <tr>
          <th>Test</th>
          <th>7m</th>
          <th>Dead</th>
          <th>2024-05-17</th>
        </tr> */}
        {logs ? logs.map((log, index) => (
          <tr key={index}>
            <td>{log.stage}</td>
            <td>{log.height}</td>
            <td>{log.health}</td>
            <td>{log.time}</td>
          </tr>
        )) : null}
      </tbody>
    </table>
    <button>Clear Logs</button>
  </div>
)};

export default Logs; 