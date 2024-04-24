import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from './components/Account';
import AddJob from './components/AddJob';
import ApplyJob from './components/ApplyJob';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function App() {
  
  // const { user, handleLogout, handleLogin} = useAuth() 
  const { user, dispatch} = useAuth() 

  const conditionalLinks = (path, roles) => {
    switch(path) {
      case '/add-job' : {
        if(roles.includes(user.account.role)) {
          return <Link to={path}>Add Job</Link>
        }
      }
      case '/apply-job' : {
        if(roles.includes(user.account.role)) {
          return <Link to={path}>Apply job</Link>
        }
      }
    }
  }

  useEffect(() => {
    if(localStorage.getItem('token'))  {
      (async () => {
        const response = await axios.get('http://localhost:3333/users/account', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        dispatch({ type: 'LOGIN', payload: response.data })
      })();
    }
  }, [])
  return (
      <div>
        <h2>Job Portal</h2>
        <Link to="/">Home</Link> |
        { !user.isLoggedIn ? (
          <>
          <Link to="/register">Register</Link> |
          <Link to="/login"> Login </Link> | 
          </>
        ) : (
          <>
            <Link to="/account">Account</Link> | 
            { conditionalLinks('/add-job', ['admin', 'recruiter'])}
            { conditionalLinks('/apply-job', ['admin', 'candidate'])}
            
             |
            <Link to="/" onClick={() => {
              localStorage.removeItem('token')
              dispatch({ type: 'LOGOUT'})
            }}> logout </Link> | 
          </>
        )}
        
             
            
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={
          <PrivateRoute permittedRoles={['recruiter', 'candidate']}>
              <Account />
          </PrivateRoute>} />
          <Route path="/add-job" element={
            <PrivateRoute permittedRoles={['recruiter']}>
              <AddJob />
            </PrivateRoute>
          } />
          <Route path="/apply-job" element={
            <PrivateRoute permittedRoles={['candidate']}>
              <ApplyJob />
            </PrivateRoute>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
  );
}

export default App;
