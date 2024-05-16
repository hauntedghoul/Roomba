import React from 'react';
import './logs.css'

function Logs() {
  return (
    <div className="container">
      <h1>Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2023-03-15</td>
            <td>John Doe</td>
            <td>Created new user</td>
          </tr>
          <tr>
            <td>2023-03-14</td>
            <td>Jane Doe</td>
            <td>Deleted log entry</td>
          </tr>
        </tbody>
      </table>
      <button>Clear Logs</button>
    </div>
  );
}

export default Logs;