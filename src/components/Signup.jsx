import React, { useState } from 'react';
import homeimg from "../assets/homeimg.jpg"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [otpSended, setOtpSended] = useState(0);
  const [resend, setResend] = useState(0);
  const [spinner, setSpinner] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    otp: '',
    password: '',
  });

  const [otpSent, setOtpSent] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setResend(false);
  };

  // Simulate OTP send action
  const handleSendOtp = () => {
    if (formData.email) {
      setSpinner(1);
      const url2 = `${process.env.REACT_APP_domain}food/user/SendOtp.php`;
      let fData = new FormData();
      fData.append('email', formData.email);
      axios.post(url2, fData).then((response) => {

        setOtpSent(true);
        setOtpSended(true);
        setResend(true);
        setSpinner(0);
      }).catch(error => toast.error(error, " Try Again...!"));

    } else {
      toast.warning('Please Enter Your Email Id first.');
    }
  };


  function handleSubmit() {
    if (formData.firstName.length === 0) {
      toast.warning("First Name is left");
    }
    else if (formData.lastName.length === 0) {
      toast.warning("Last Name is left");
    }
    else if (formData.email.length === 0) {
      toast.warning("Email is left");
    }
    else if (formData.mobile.length === 0) {
      toast.warning("Mobile Number is left");
    }
    else if (!otpSended) {
      toast.warning("Click Button Send OTP...");
    }
    else if (formData.otp.length === 0) {
      toast.warning("OTP Is left ");
    }
    else if (formData.password.length === 0) {
      toast.warning("Password is left");
    }
    else {
      setSpinner(1);
      const url2 = `${process.env.REACT_APP_domain}food/user/SignUp.php`;
      let fData = new FormData();
      fData.append('firstName', formData.firstName);
      fData.append('lastName', formData.lastName);
      fData.append('email', formData.email);
      fData.append('mobile', formData.mobile);
      fData.append('otp', formData.otp);
      fData.append('password', formData.password);

      axios.post(url2, fData).then((response) => {
        const APIResponse = response.data;// This is response data from AXIOS
       
        setSpinner(0);
        if(APIResponse.status==='success'){
        
           toast.success(APIResponse.message);
           setTimeout(() => {
             navigate('/Login');
          }, 2000); 
        }
        else{
          toast.error(APIResponse.message);
        }
       
      }).catch(error => toast.warning(error, " Try Again...!"));

    }
  }
  return (
    <div style={{
      backgroundImage: `url(${homeimg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "90vh", // Full viewport height
    }} className="flex justify-center items-center min-h-screen bg-gray-100 p-0 pt-[10px] md:pt-[50px]">



      <div

        className="bg-white mt-[00px] mb-[10px] shadow-md rounded-lg p-4 m-5 w-full max-w-md transition transform "
      >
        {/* Loading Spinner */}
        <div role="status" className={`${spinner ? "block" : "hidden"} absolute inset-0 flex items-center justify-center`}>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <div className="flex">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="mt-1 p-2 m-1  w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="mt-1 p-2 m-1 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>




        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* Password Field */}
        <div className="mb-4 transition-opacity duration-500 ease-in-out opacity-100">
          <label className="block text-sm font-medium text-gray-700">Enter Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter the Password"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>


        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={handleSendOtp}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {resend ? 'Re-Send' : 'Send OTP'}
          </button>
        
        </div>

        {otpSent && (
          <div className="mb-4 transition-opacity duration-500 ease-in-out opacity-100">
            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter the OTP"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Signup;
