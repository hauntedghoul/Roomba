import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './componets/pages/home'
import Login from './componets/pages/login'
import Logs from './componets/pages/logs'
import Settings from './componets/pages/settings'
import Register from './componets/pages/register'
import Save from './componets/pages/save'
import Navbar from './componets/navbar/navbar';
import SeedPage from "./componets/pages/seedpage";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/logs" exact element={<Logs />} />
          <Route path="/settings" exact element={<Settings />} />
          <Route path="/save" exact element={<Save />} />
          <Route path="/seed" exact element={<SeedPage />} />
        </Routes>
      </div>
    </Router>
    // <div className="App">
    //   <div>
    //     <h1>Home page test</h1>

    //   </div>
    // </div>
  );
}

export default App;
