import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners"; // Import spinner

const Dashboard = () => {
    const statusSteps = ["pending", "confirmed", "preparing", "out_for_delivery","delivered","canceled"];
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
  
     ////////////// Speech Recognition & Synthesis ////////////////////
    
     const [firsttime, setFirstTime] = useState(0);
     const [newId, setNewId] = useState(0);
   
     // Speech Synthesis Setup
     const synth = window.speechSynthesis;
   
     // Function to speak with callback
     const speakWithCallback = (text, voiceLang, callback) => {
       const utterance = new SpeechSynthesisUtterance(text);
       const voices = synth.getVoices();
       let indianVoice = voices.find((voice) => voice.lang === voiceLang);
       if (indianVoice) utterance.voice = indianVoice;
   
       // Event when the speech ends
       utterance.onend = () => {
         setTimeout(() => {
           if (callback) callback();
         }, 100);
       };
   
       // Speak the text
       synth.speak(utterance);
     };
   
     useEffect(() => {
       if (newId <= 0 || firsttime === 0 ) {
         setFirstTime(firsttime + 1);
        
       } else {
         speakWithCallback(`New Order is received! order eye-dee ${newId} `, "hi-IN", () => {
         
         });
       }
       // eslint-disable-next-line
     }, [newId]);
    useEffect(() => {
        fetchOrders();
        setInterval(fetchOrders, 5000);
        // eslint-disable-next-line
    }, []);

    const fetchOrders = () => {
        const url2 = `${process.env.REACT_APP_domain}food/admin/get_orders.php`;
        let fData = new FormData();
        fData.append('adminEmail', Cookies.get('adminEmail'));
        if (!Cookies.get('adminEmail')) {
            toast.error("Admin email not found in cookies");
            return;
        }
        axios.post(url2, fData).then((response) => {
            const APIResponse = response.data;
            if (response.status === 200) {
                setOrders(APIResponse);
                setNewId(APIResponse[APIResponse.length - 1].order_id);
            }
        }).catch(error => {
            toast.error(error, " Try Again...!");
        });
    };

    const updateStatus = async (orderId, currentStatus,delcan) => {
        const adminEmail = Cookies.get("adminEmail");
        if (!adminEmail) {
            toast.error("Admin email not found in cookies");
            return;
        }

        const currentIndex = statusSteps.indexOf(currentStatus);
        if (currentIndex === -1 || currentIndex === statusSteps.length - 1) return;
        let nextStatus = statusSteps[currentIndex + 1];
        if(!delcan){
            nextStatus = statusSteps[currentIndex + 2];
        }
        
     
        // Ask for confirmation before proceeding
        const isConfirmed = window.confirm("Are you sure you want to update the order status?");
        if (!isConfirmed) return;

        setLoading(true); // Start loading spinner

        try {
            const res = await axios.post(`${process.env.REACT_APP_domain}food/admin/update_order_status.php`, {
                order_id: orderId,
                status: nextStatus,
                adminEmail,
            });

            setLoading(false); // Stop loading spinner
            console.log(res.data);
            if (res.data.success) {
                toast.success("Order status updated!");
                fetchOrders(); // Refresh orders after update
               
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            setLoading(false); // Stop loading spinner
            toast.error("Error updating order status");
        }
    };
    const handleClick = () => {
        speakWithCallback("Yes the Admin Is Started", "hi-IN", () => {
           
        });
      };
    return (
        <div className="p-4 mt-[100px] max-w-6xl mx-auto flex flex-col justify-center shadow-lg rounded-lg bg-white ">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Manage Orders</h2>
            <button className="w-fit py-2 px-3 text-xl bg-blue-600 text-white rounded-lg mx-auto mb-5" onClick={handleClick}>Click to Work</button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                    <thead>
                        <tr className="bg-blue-100 hover:bg-blue-200">
                            <th className="text-sm font-medium text-gray-700 px-6 py-4 text-center">Order ID</th>
                            <th className="text-sm font-medium text-gray-700 px-6 py-4 text-center">Order Items</th>
                            <th className="text-sm font-medium text-gray-700 px-6 py-4 text-center">Total Price</th>
                            <th className="text-sm font-medium text-gray-700 px-6 py-4 text-center">Status</th>
                            <th className="text-sm font-medium text-gray-700 px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id} className="border-t hover:bg-pink-100">
                                <td className="text-sm text-gray-600 px-6 py-4 text-center">{order.order_id}</td>
                                <td className="text-sm text-gray-600 px-6 py-4 text-center">
                                    {order.items ? JSON.parse(order.items).map((item, index) => (
                                        <div key={index} className="text-sm text-gray-600 flex place-items-center border-2 border-gray-200">
                                            <div className="w-[100px] md:w-[150px] text-left">{item.name}</div><div className="pl-5 w-fit">{item.qty}</div>   {/* Modify based on the actual structure */}
                                        </div>
                                    )) : "No items available"}
                                </td>
                                <td className="text-sm text-gray-600 px-6 py-4 text-center">Rs.{order.total_price}</td>
                                <td className="text-sm text-gray-600 px-6 py-4 text-center">{order.status}</td>
                                <td className="text-sm text-center px-6 py-4">
                                    {order.status !== "delivered" && order.status !== "canceled" && (
                                       order.status!=='out_for_delivery'? 
                                       <button
                                            onClick={() => updateStatus(order.order_id, order.status,1)}
                                            className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 rounded-md px-4 py-2 w-full sm:w-auto mx-auto flex justify-center items-center"
                                            style={{ minWidth: "120px" }} // Fixed width for the button
                                        >
                                            {loading ? (
                                                <BeatLoader size={8} color="white" />
                                            ) : (
                                                "Next Status"
                                            )}
                                        </button>
                                        :
                                        <div className="flex justify-center ">
                                            <button
                                            onClick={() => updateStatus(order.order_id, order.status,1)}
                                            className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 rounded-md px-2 mx-2 py-2 w-full sm:w-auto mx-auto flex justify-center items-center"
                                            style={{ minWidth: "120px" }} // Fixed width for the button
                                        >
                                            {loading ? (
                                                <BeatLoader size={8} color="white" />
                                            ) : (
                                                "Delivered"
                                            )}
                                        </button>
                                        <button
                                            onClick={() => updateStatus(order.order_id, order.status,0)}
                                            className="bg-blue-500 text-white hover:bg-blue-600 mx-2 transition duration-300 rounded-md px-2 py-2 w-full sm:w-auto flex justify-center items-center"
                                            style={{ minWidth: "120px" }} // Fixed width for the button
                                        >
                                            {loading ? (
                                                <BeatLoader size={8} color="white" />
                                            ) : (
                                                "Canceled"
                                            )}
                                        </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
