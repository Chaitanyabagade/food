
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
  // Dummy cart items for illustration
  const [cartItems, setCartItems] = useState([]);
  function setCartItemsfunction(updatedCart) {
    setCartItems(updatedCart);
  }
  function addToCart(id, name, qty, price){
    // Check if the item already exists in the cart
    setCartItems((prevCartItems) => {
      const itemIndex = prevCartItems.findIndex(item => item.id === id);

      if (itemIndex !== -1) {
        // Item exists, so update the quantity
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[itemIndex].qty += qty; // Add to the existing quantity
        return updatedCartItems;
      } else {
        // Item doesn't exist, add a new item to the cart
        const newItem = { id, name, qty, price };
        return [...prevCartItems, newItem];
      }
    });
  };
 //addToCart(10,'naksdf',5,100);

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
              <TaskBar cartItems={cartItems} setCartItemsfunction={setCartItemsfunction} />
              <Routes>
                <Route path="/" element={<Recomended addToCart={addToCart}/>} />

              </Routes>
            </>
        }

      </BrowserRouter>
    </div>
  );
}

export default App;
