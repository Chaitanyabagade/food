import React from "react";
import  pizza  from '../assets/Foodimg/pizza.jpg'
import burger from "../assets/Foodimg/burger.jpg"
import colddring from "../assets/Foodimg/coldring.jpg"
import vegroll from "../assets/Foodimg/vegroll.jpg"
import homeimg from "../assets/homeimg.jpg"
import { Link } from "react-router-dom";
const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans mt-[70px] ">
            {/* Hero Section */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?delicious-food')" }}>
                <div style={{backgroundImage:`url(${homeimg})`,backgroundSize:'cover'}} className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                    <h1 className=" text-3xl text-black md:text-6xl font-extrabold mb-4 drop-shadow-lg">Savor Every Bite</h1>
                    <p className="text-3xl md:text-5xl mb-6 text-black font-bold  max-w-2xl">Order your favorite meals from Our restaurants.</p>
                    <Link to="/Login" className="bg-green-500 text-white px-6 py-3 text-lg rounded-full shadow-md hover:bg-green-600 transition">Login Now</Link>
                </div>

                
            </div>

            {/* Categories Section */}
            <div className="container mx-auto py-16 px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                    <div className="bg-white p-1 md:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer">
                        <img src={pizza} alt="pizza" className="w-full h-25 object-cover rounded-lg" />
                        <h3 className="mt-2 text-xl font-semibold text-gray-700">Pizza</h3>
                    </div>

                    <div className="bg-white p-1 md:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer">
                        <img src={burger} alt="Burger" className="w-full h-25 object-cover rounded-lg" />
                        <h3 className="mt-2 text-xl font-semibold text-gray-700">Burger</h3>
                    </div>

                    <div className="bg-white p-1 md:p-6 pb-3 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer">
                        <img src={colddring} alt="Cold Drink" className="w-full h-25 object-cover rounded-lg" />
                        <h3 className="mt-6 text-xl font-semibold text-gray-700">Cold Drink</h3>
                    </div>

                    <div className="bg-white p-1 md:p-6 pb-3 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer">
                        <img src={vegroll} alt="veg roll" className="w-full h-25 object-cover rounded-lg" />
                        <h3 className="mt-2 text-xl font-semibold text-gray-700">Veg Roll</h3>
                    </div>
                    
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white text-center py-6 mt-12">
                <p className="text-lg">&copy; 2025 Foodie. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
