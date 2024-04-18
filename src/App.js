import { Routes, Route, Link } from 'react-router-dom'
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from './components/Account';
import { useAuth } from './context/AuthContext';
function App() {
  const {user, handleLogout} = useAuth()
  return (
      <div>
        <h2>Job Portal</h2>
        <Link to="/">Home</Link> |
        { !user ? (
          <>
            <Link to="/register">Register</Link> |
            <Link to="/login"> Login </Link> | 
          </> 
        ): (
          <>
            <Link to="/account">Account</Link> |
            <Link to="/" onClick={() => {
              localStorage.removeItem('token') 
              handleLogout()
            }}> Logout </Link> | 
          </> 
        )}
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
  );
}

export default App;
