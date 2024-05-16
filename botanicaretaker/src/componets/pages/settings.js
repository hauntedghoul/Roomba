import React from 'react';
import './settings.css'

function Settings() {
  return (
    <div className="container">
    <h1>Plant Game Settings</h1>
    <form>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" />
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="plant-selection">Plant Selection</label>
      <select id="plant-selection" name="plant-selection">
        <option value="random">Random</option>
        <option value="user-selected">User Selected</option>
      </select>
      <label htmlFor="difficulty">Difficulty</label>
      <select id="difficulty" name="difficulty">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button type="submit">Save Changes</button>
    </form>
  </div>
  );
}

export default Settings;