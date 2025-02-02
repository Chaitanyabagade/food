import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiShoppingCart } from "react-icons/fi"; // Import cart icon
import { FcPlus } from "react-icons/fc";
import { GrFormSubtract } from "react-icons/gr";
const TaskBar = ({ cartItems, setCartItemsfunction, saveCartData }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle cart box
    const navigate = useNavigate();


    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const increaseQty = (id) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, qty: item.qty + 1 };
            }
            return item;
        });
        setCartItemsfunction(updatedCart);
        saveToCard();
    };

    const decreaseQty = (id) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id && item.qty > 1) {
                return { ...item, qty: item.qty - 1 };
            }
            return item;
        });
        setCartItemsfunction(updatedCart);
        saveToCard();
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItemsfunction(updatedCart);
        saveCartData();
    };

    const saveToCard = () => {
        saveCartData();
    };


    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50   ">
            <div className="container mx-auto flex justify-between items-center px-4 py-2">

                {/* Left Section (Menu Button & Logo) */}
                <div className="flex items-center space-x-4">
                    {/* Hamburger Menu Button (Only for Mobile) */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-9 h-9"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Logo */}
                    <img className="w-[80px] h-[50px]" alt="logo" src={logo} />
                    <div className="text-2xl p-0 pt-1 font-bold text-green-600">
                        FastFood
                    </div>
                </div>

                {/* Menu Links (Pushed to Right) */}
                <div className="hidden md:flex md:items-center space-x-8 ml-auto">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-2xl text-gray-600 hover:text-green-600">
                        Home
                    </Link>
                    <Link to="/address" onClick={() => setIsMenuOpen(false)} className="block font-bold text-2xl text-gray-600 hover:text-green-600">
                        Address
                    </Link>

                    {/* Logout Button */}
                    <button onClick={() => {
                        if (window.confirm("Do You Want To Logout...")) {
                            Cookies.remove('email');
                            Cookies.remove('userId');
                            Cookies.remove('firstName');
                            Cookies.remove('lastName');
                            navigate('./');
                            window.location.reload();
                        }
                    }}
                        className="font-bold text-2xl border-2 rounded-lg border-green-600 px-3 pb-[3px] text-gray-600 hover:text-green-600">
                        Logout
                    </button>
                </div>

                {/* Cart Icon on Right Side */}
                <button onClick={toggleCart} className="text-gray-600 hover:text-green-600 relative ml-[40px] mt-[3px] flex">
                    <FiShoppingCart className="w-8 h-8" />
                    <div className="items font-bold mt-[20px] w-[30px] h-[30px] text-center rounded-full border-2 border-gray-400">
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </div>
                </button>
            </div>

            {/* Cart Box (Visible when cart is toggled) */}
            {isCartOpen && (
                <div className="absolute top-[60px] z-50 right-2 bg-white shadow-lg p-4 rounded-lg w-[340px] max-h-[400px] border-2 border-purple-300 mt-[10px] overflow-auto">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="absolute top-2 right-2 text-red-600 font-bold text-xl"
                    >
                        &#10005; {/* Cross (X) symbol */}
                    </button>

                    <h3 className="font-bold text-xl text-center mb-4">Your Cart</h3>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left px-2 py-1 text-sm text-gray-600">Sr. No.</th>
                                <th className="text-left px-2 py-1 text-sm text-gray-600">Product Name</th>
                                <th className="text-left px-2 py-1 text-sm text-gray-600">Qty</th>
                                <th className="text-right px-2 py-1 text-sm text-gray-600">Price</th>
                                <th className="text-right px-2 py-1 text-sm text-gray-600">Act</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-1 text-sm text-gray-600">{index + 1}</td>
                                    <td className="px-2 py-1 text-sm text-gray-600">{item.name}</td>
                                    <td className="px-2 py-1 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => decreaseQty(item.id)}
                                                className="text-red-600 font-bold text-xl"
                                            >
                                                <GrFormSubtract style={{ color: 'white', background: 'red', borderRadius: '50%', width: '18px', height: '18px', fontWeight: 'bold' }} />
                                            </button>
                                            <span className="text-sm">{item.qty}</span>
                                            <button
                                                onClick={() => increaseQty(item.id)}
                                                className="text-green-600 font-bold text-xl"
                                            >
                                                <FcPlus />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-right px-2 py-1 text-sm text-gray-600">{item.price}</td>
                                    <td className="text-right px-2 py-1 text-sm text-gray-600">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 font-bold"
                                        >
                                            &#10005; {/* Cross (X) symbol */}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-semibold text-lg text-gray-800">Total:</span>
                        <span className="font-semibold text-lg text-gray-800">
                            {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="mt-4 w-full justify-center flex space-x-4">
                        {/* Checkout Button */}
                        <button className="w-fit px-10 bg-blue-700 text-white py-2 rounded-lg">Checkout</button>


                    </div>
                </div>
            )}

            {/* Dropdown Menu for Small Devices */}
            {isMenuOpen && (
                <div className="md:hidden shadow-md">
                    <div className="flex flex-col space-y-2 px-4 py-3">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="block font-bold text-2xl text-gray-600 hover:text-green-600">
                            Home
                        </Link>
                        <Link to="/address" onClick={() => setIsMenuOpen(false)} className="block font-bold text-2xl text-gray-600 hover:text-green-600">
                            Address
                        </Link>
                        <Link>
                          {
                            !Cookies.get('isBlind')?                         
                            <button  onClick={()=>{ Cookies.set('isBlind',0, { expires: 30 }) }} className="block font-bold text-2xl text-gray-600 hover:text-green-600">Blind Is ON</button>
                             :
                            <button  onClick={()=>{ Cookies.set('isBlind',1, { expires: 30 })}} className="block font-bold text-2xl text-gray-600 hover:text-green-600">Blind Is OFF</button>
                         }
                            </Link>  

                        <button onClick={() => {
                            if (window.confirm("Do You Want To Logout...")) {
                                Cookies.remove('email');
                                Cookies.remove('userId');
                                Cookies.remove('firstName');
                                Cookies.remove('lastName');

                                navigate('./');
                                window.location.reload();
                            }
                        }}
                            className="font-bold text-2xl border-2 rounded-lg border-green-600 px-2 pb-[3px] text-gray-600 hover:text-green-600">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default TaskBar;
