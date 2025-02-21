import React from "react";
import profile from '../assets/profile.png'
const Contact = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10 px-4 mt-[50px]">
      {/* Header */}
      <h1 className="text-4xl font-bold text-green-800 mb-6">Contact Us</h1>
      <p className="text-gray-700 text-center mb-10 max-w-2xl">
        Get in touch with us for inquiries, support, or feedback about our Smart
        Agriculture solutions. We're here to help you maximize productivity and
        embrace innovation in Food Ordering!
      </p>

      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg max-w-lg w-full p-6 text-center">
        <img
          src={profile} // Replace with your profile image URL
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto border-4 border-green-200 shadow-lg"
        />
        <h2 className="text-2xl font-semibold mt-4">Kaustubh Hande</h2>
        <p className="text-gray-600 mt-2">
          Dedicated to bringing innovation to order food through technology.
        </p>
      </div>

      {/* Contact Information */}
      <div className="mt-10 bg-white shadow-md rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Contact Details</h3>
        <p className="text-gray-700">
          <strong>Mobile:</strong> 8530669372
        </p>
        <p className="text-gray-700">
          <strong>Alternate Mobile:</strong> 8530669372
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:fastfood@gamil.com"
            className="text-blue-500 underline"
          >
            fastfood@gamil.com
          </a>
        </p>
        <p className="text-gray-700">
          <strong>Address:</strong> Pune, Maharashtra, 411018
        </p>
      </div>

      {/* Support Section */}
      <div className="mt-10 bg-white shadow-md rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Customer Support</h3>
        <p className="text-gray-700">
          Facing issues or need assistance? Contact our support team at:
        </p>
        <p className="text-gray-700 font-medium mt-2">+91-8530669372</p>
        <p className="text-gray-700 font-medium">support@fastfood.com</p>
      </div>

      {/* Social Media Links */}
      <div className="mt-10 flex space-x-4">
        <a
          href="/"
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
        >
          Facebook
        </a>
        <a
          href="/"
          className="text-white bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-full"
        >
          Twitter
        </a>
        <a
          href="/"
          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full"
        >
          YouTube
        </a>
      </div>

      {/* Inquiry Button */}
      <div className="mt-10">
        <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
          Send Us Your Inquiry
        </button>
      </div>
    </div>
  );
};

export default Contact;
