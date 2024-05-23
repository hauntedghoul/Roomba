import React, { useEffect, useState } from 'react';
import './logs.css'

function Logs() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('https://localhost:4206/api/logs');
      const data = await response.json();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
<div className="container">
      <h1>Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Plant</th>
            <th>Height</th>
            <th>Health</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.time).toLocaleString()}</td>
              <td>{log.plantId.name}</td>
              <td>{log.height}</td>
              <td>{log.health}</td>
              <td>{log.stage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setLogs([])}>Clear Logs</button>
    </div>
  );
}

export default Logs;
