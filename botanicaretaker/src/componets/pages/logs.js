import React, { useState } from 'react';
import './logs.css'

function Logs() {

  const [logs, setLogs] = useState([
    {
      Stage: 'Testings',
      Height: '7m',
      Health: 'Dead',
      Time: '2024-05-17T21:26:41.336+00:00'
    },
    {
      Stage: 'Testings',
      Height: '7m',
      Health: 'Dead',
      Time: '2024-05-17T21:26:41.336+00:00'
    }])

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
          <th>Testings</th>
          <th>7m</th>
          <th>Dead</th>
          <th>2024-05-17</th>
        </tr> */}
        {logs.map((log, index) => (
          <tr key={index}>
            <td>{log.Stage}</td>
            <td>{log.Height}</td>
            <td>{log.Health}</td>
            <td>{log.Time}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button>Clear Logs</button>
  </div>
)};


export default Logs;