import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const getlimit=50;
  // Fetch orders on component mount
  useEffect(() => {
    const getUserOrders = async () => {
      // Get values from cookies
      const firstname = Cookies.get('firstName');
      const lastname = Cookies.get('lastName');
      const email = Cookies.get('email');
      const limit = getlimit;
      if (!firstname || !lastname || !email) {
       toast.error('Missing user information in cookies');
        return;
      }
        
      try {
        // Make a POST request to the PHP API with the cookie data
        const response = await axios.post(`${process.env.REACT_APP_domain}food/user/getOrdersDetail.php`, {
          firstname,
          lastname,
          email,
          limit
        });

        if (response.data.success) {
          setOrders(response.data.orders); // Assuming orders are in the "orders" field
        } else {
          toast.error(response.data.error || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        toast.error('Error fetching user orders');
      }
    };

    getUserOrders();
  }, []); // Empty dependency array, so it runs once on mount

  return (
    <div className="container mx-auto mt-16 md:px-10 lg:px-[200px] px-4 py-6">
    <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Your Orders</h2>
    
   
    
    {orders.length === 0 ? (
      <p className="text-center text-lg text-gray-500">No orders found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Total Price</th>
              <th className="py-2 px-4 text-left">Order Date</th>
            </tr>
          </thead>
          <tbody>
          {orders.map((order) => (
              <tr key={order.order_id} className="border-t border-gray-200 hover:bg-purple-100">
                <td className="py-3 px-4">{order.order_id}</td>
                <td className="py-3 px-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'canceled' ? 'bg-red-500' :
                      order.status === 'pending' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">₹{order.total_price}</td>
                <td className="py-3 px-4">{new Date(order.order_time).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
};

export default UserOrders;
