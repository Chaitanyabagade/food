
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Contact from './components/Contact';
import AdminLogin from "./components/AdminLogin"
import Cookies from 'js-cookie';
//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import TaskBar from './components/TaskBar';
function App() {
  const [loged, setLoged] = useState(0);
  useEffect(() => {
    if (Cookies.get('email') && Cookies.get('userId')) {
      setLoged(1);
    }
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
      {!loged ?
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/AdminLogin" element={<AdminLogin/>}/>
          <Route path="/Contact" element={<Contact/>}/>
        </Routes>
        </>
        :
        <>
          <TaskBar/>
        </>
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
