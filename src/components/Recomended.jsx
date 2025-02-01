import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const Recomended = ({addToCart}) => {
    const [menuItems, setMenuItems] = useState([]);
    const [spinner, setSpinner] = useState(0);
    const [menuqty, setMenuqty] = useState([]);
   
    const getMenuItemData = () => {
        const url = `${process.env.REACT_APP_domain}food/getMenuItemData.php`;
        let fData = new FormData();
        axios.post(url, fData)
            .then((response) => {
                setMenuItems(response.data);
                for (let i = 0; i < response.data.length; i++) {
                    const newQty = new Array(response.data.length).fill(1);
                    setMenuqty(newQty);
                }
                setSpinner(0);
            })
            .catch(error => toast.error(error, " Try Again...!"), setSpinner(0));
    }
   
    // Function to increase the quantity
    const increaseQuantity = (index) => {
        setMenuqty(prevMenuqty => {
            const updatedMenuqty = [...prevMenuqty];
            updatedMenuqty[index] += 1;
            return updatedMenuqty;
        });
    };
    
    // Function to decrease the quantity but ensure it doesn't go below 1
    const decreaseQuantity = (index) => {
        setMenuqty(prevMenuqty => {
            const updatedMenuqty = [...prevMenuqty];
            if (updatedMenuqty[index] > 1) {
                updatedMenuqty[index] -= 1;  // Decrease by 1 only if the value is greater than 1
            }
            return updatedMenuqty;
        });
    };
    
    function addtoCartfromrecomended(item,index){
        addToCart(item.item_id,item.name,menuqty[index],item.price);
    }

    useEffect(() => {
        getMenuItemData();
      
    }, []);



    return (
        <div className='mt-[65px]'>
            {/* Loading Spinner */}
            <div role="status" className={`${spinner ? "block" : "hidden"} z-[200] absolute inset-0 flex lg:ml-[15%] items-center justify-center`}>
                <svg aria-hidden="true" className="w-[60px] h-[60px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>
            {/* Categories Section */}
            <div className="container mx-auto py-8 px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">All Menu</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-8 lg:gap-10">
                    {menuItems.map((item, index) => (


                        <div key={index} className="bg-white p-1 md:p-6 rounded-xl shadow-lg flex flex-col justify-between transform  transition cursor-pointer">
                            <img src={`https://darkslategray-lion-860323.hostingersite.com/food/menuitemimg/${item.image_url}`} alt={item.name} className="w-full object-cover bg-white rounded-lg" />
                            <h3 className="mt-1 text-xl font-semibold text-gray-700">{item.name}</h3>
                            <h3 className="mt-1 text-xl font-semibold text-gray-700">Rs. {item.price}</h3>
                            {/* Buttons aligned at the bottom */}
                            <div className="mt-auto">
                                <div className="flex items-center justify-center mt-3">
                                    <button onClick={()=>{increaseQuantity(index)}} className="px-3 py-1 bg-red-500 text-white rounded-lg">+</button>
                                    <span className="mx-2 text-lg font-semibold">{menuqty[index]}</span>
                                    <button onClick={()=>{decreaseQuantity(index)}} className="px-3 py-1 bg-green-500 text-white rounded-lg">-</button>
                                </div>
                                <button onClick={()=>{addtoCartfromrecomended(item,index)}} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg w-full">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Recomended;
