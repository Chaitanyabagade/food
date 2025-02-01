
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
import AdminNav from './components/AdminNav';
import Recomended from './components/Recomended';
function App() {
  const [isUserloged, setLoged] = useState(0);
  const [isAdmin, setIsAdmin] = useState(0);
  useEffect(() => {
    if (Cookies.get('adminEmail') && Cookies.get('admin')) {
      setIsAdmin(1);
    }
    else if (Cookies.get('email') && Cookies.get('userId')) {
      setLoged(1);
    }
  }, []);
  return (
    <div className="App">
      <BrowserRouter>

        {
          !isUserloged ?
            isAdmin ?
              <>  {/* Admin dashboard */}
                <AdminNav />
              
                <Routes>
                    <Route path="/" element={<Recomended />} /> 

                  
                </Routes>
              </>
              :
              <>
               {/* by defauld */}
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Signup" element={<Signup />} />
                  <Route path="/Login" element={<Login />} />
                  <Route path="/AdminLogin" element={<AdminLogin />} />
                  <Route path="/Contact" element={<Contact />} />
                </Routes>
              </>
            :
            <>  {/* user dashboard */}
              <TaskBar />
              <Routes>
                  <Route path="/" element={<Home />} />
                   
                </Routes>
            </>
        }

      </BrowserRouter>
    </div>
  );
}

export default App;
