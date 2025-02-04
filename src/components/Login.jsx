import React, { useState } from 'react';
import homeimg from "../assets/homeimg.jpg"
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = () => {
    if (email.length === 0) {
      toast.warning("Email Id is left");
    }
    else if (password.length === 0) {
      toast.warning("Password is left");
    }
    else {
      setSpinner(1);
      const url2 = `${process.env.REACT_APP_domain}food/user/Login.php`;
      let fData = new FormData();
      fData.append('email', email);
      fData.append('password', password);
      console.log(email, password);
      axios.post(url2, fData).then((response) => {
        const APIResponse = response.data;// This is response data from AXIOS
        console.log(APIResponse);
        if (APIResponse.status_code === '200' && APIResponse.status === 'success' && APIResponse.message === 'Logged In') {
          Cookies.set('email', APIResponse.email, { expires: 30 });
          Cookies.set('userId', APIResponse.userId, { expires: 30 });
          Cookies.set('firstName', APIResponse.firstName, { expires: 30 });
          Cookies.set('lastName', APIResponse.lastName, { expires: 30 });
          Cookies.set('isProfileSet',APIResponse.isProfileSet,{ expires: 300 })
         
          toast.success("Login Successful...");
          setTimeout(() => {
            navigate('/');
            window.location.reload();
         }, 100); 
         
        }
        else {
          toast.warning(APIResponse.message);
        }
        setSpinner(0);

      }).catch(error => { toast.error(error, " Try Again...!"); setSpinner(0); });
    }
  }

  return (
    <div className="min-h-screen  flex justify-center items-center p-5"
      style={{
        backgroundImage: `url(${homeimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh", // Full viewport height
      }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <div className="space-y-6 text-xl">
          {/* Loading Spinner */}
          <div role="status" className={`${spinner ? "block" : "hidden"} absolute inset-0 flex items-center justify-center`}>
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>

          {/* Email Field */}
          <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
            <i className="fas fa-envelope text-gray-500 mr-3"></i>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
            <i className="fas fa-lock text-gray-500 mr-3"></i>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-between text-lg">
          <div className="">
            <Link to="/Signup" className=" text-blue-500 hover:underline">Sign Up</Link>
          </div>
          <div className="text-right">
            <Link to="#forgot-password" className=" text-blue-500 hover:underline">Forgot Password?</Link>
          </div>
          </div>
       
          {/* Submit Button */}
          <button
            onClick={handleSubmit}

            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
