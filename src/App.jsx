
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
import axios from 'axios';
import { toast } from 'react-toastify';
import Profile from './components/Profile';
import UserOrders from './components/UserOrders';
function App() {
  // cart 
  const [cartItems, setCartItems] = useState([]);
  const [flagDataget, setFlagDataGet] = useState(0);
  function fetchCartItems() {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('firstname', Cookies.get('firstName'));
    formData.append('lastname', Cookies.get('lastName'));
    formData.append('email', Cookies.get('email'));

    // Send the FormData using Axios
    axios.post(`${process.env.REACT_APP_domain}food/user/getCartItems.php`, formData, {
      withCredentials: true, // Ensure cookies are sent with the request
    })
      .then(response => {
        setCartItems(response.data.cart?response.data.cart:[]);
        setFlagDataGet(1);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  }

  function saveCartData() {
    // Create a FormData object
    const formData = new FormData();

    // Convert jsonData to a Blob and append it
    const jsonBlob = new Blob([JSON.stringify(cartItems)], { type: 'application/json' });
    formData.append('jsonData', jsonBlob);

    // Append additional fields
    formData.append('email', Cookies.get('email'));
    formData.append('firstname', Cookies.get('firstName'));
    formData.append('lastname', Cookies.get('lastName'));

    axios.post(`${process.env.REACT_APP_domain}food/user/saveCart.php`, formData)
      .then(response => {
        if (response.data.status) {

        }
        else {
          toast.error(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }




  function setCartItemsfunction(updatedCart) {
    setCartItems(updatedCart);

  }
  function clearCart() {
    setCartItems([]);
  }
  function addToCart(id, name, qty, price) {
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
  const checkout = async () => {
    try {                                                   /// the same checkout fucntion is in recomended components for the blind people
      // Get user details from cookies
      const firstname = Cookies.get("firstName");
      const lastname = Cookies.get("lastName");
      const email = Cookies.get("email");
    
      // Check if values are available
      if (!firstname || !lastname || !email) {
        alert("User details not found!");
        return;
      }

      // Make the API request
      const response = await axios.post(`${process.env.REACT_APP_domain}food/user/addOrder.php`, {
        firstname,
        lastname,
        email
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Order Response:", response.data);

      if (response.data.success) {
        toast.success(`Order placed successfully! Order ID: ${response.data.order_id}! And You Have To Pay ${response.data.total_price},Rupees On Time OF Delivery`);
        clearCart();
      } else {
        toast.error(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  }

  useEffect(() => {

    if (flagDataget) {
      saveCartData();
    }
    // eslint-disable-next-line
  }, [cartItems]);


  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <BrowserRouter>

        {
          (parseInt(Cookies.get('admin'))) ?
            <>  {/* Admin dashboard */}
              <AdminNav />
              <h1 className='mt-[200px]'>This is addmin panel</h1>
              <Routes>



              </Routes>
            </>
            :
            (parseInt(Cookies.get('userId'))) ?
              <>  {/* user dashboard */}
                <TaskBar cartItems={cartItems} setCartItemsfunction={setCartItemsfunction} saveCartData={saveCartData} checkout={checkout} />

                <Routes>
                  <Route path="/" element={<Recomended addToCart={addToCart} clearCart={clearCart} cart={cartItems} />} />
                  <Route path="/address" element={<Profile />} />
                  <Route path="/orders" element={<UserOrders/>}/>
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


        }

      </BrowserRouter>
    </div>
  );
}

export default App;
