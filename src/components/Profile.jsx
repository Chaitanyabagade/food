import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const Profile = () => {
    const [formData, setFormData] = useState({
    firstname: Cookies.get('firstName'),
    lastname: Cookies.get('lastName'),
    email: Cookies.get('email'),
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_domain}food/user/Profile.php`, formData);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address.");
    }
  };
   //////////////////user location /////////
   const [location, setLocation] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const getAddressFromCoordinates = (latitude, longitude) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        const { road, city, state, postcode, country } = data.address || {};
        console.log(`Street: ${road}`);
        console.log(`City: ${city}`);
        console.log(`State: ${state}`);
        console.log(`Postal Code: ${postcode}`);
        console.log(`Country: ${country}`);
        setLocation({
          street: road || "Unknown",
          city: city || "Unknown",
          state: state || "Unknown",
          postalCode: postcode || "Unknown",
          country: country || "Unknown",
        });
      })
      .catch(error => console.error("Error fetching address:", error));
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);



  ////////////// end of user locationo//////////////
  return (
   <div className="w-full h-[100%] flex justify-center mt-[100px]">
   {/* <div className="max-w-md  p-4 bg-white  shadow-lg rounded-lg z-[10] fixed mt-[100px] mx-5 ">
      <h2 className="text-xl font-bold mb-4 text-center w-full ">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" className="w-full p-2 border rounded" required />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" required />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full p-2 border rounded" required />
        <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" className="w-full p-2 border rounded" required />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full p-2 border rounded" required />
        <label className="flex items-center">
          <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="mr-2" /> Set as Default Address
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Save Address</button>
      </form>
    </div>
     */}  <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Your Address</h2>
            <div className="bg-white shadow-md rounded-lg p-4 w-80">
                <p><strong>Street:</strong> {location.street}</p>
                <p><strong>City:</strong> {location.city}</p>
                <p><strong>State:</strong> {location.state}</p>
                <p><strong>Postal Code:</strong> {location.postalCode}</p>
                <p><strong>Country:</strong> {location.country}</p>
            </div>
            <button 
                onClick={getUserLocation}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Refresh Location
            </button>
        </div>
    </div>
  );
};

export default Profile;
