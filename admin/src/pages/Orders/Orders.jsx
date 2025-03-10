import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from "axios"
import { toast } from "react-toastify"
import { useEffect } from 'react'
import { assets } from "../../assets/assets"

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        params: {
          page,
          limit,
          sortBy: "date",
          sortOrder: "desc"
        }
      });
      if (response.data.success) {
        setOrders(response.data.data);
        setTotalPages(response.data.totalPages); // Update total pages
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.post(`${url}/api/order/delete`, { orderId }); // Send orderId in request body
        if (response.data.success) {
          toast.success(response.data.message);
          fetchAllOrders(); // Refresh the order list
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order");
      }
    }
  }


  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      "orderId": orderId,
      "status": event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [page, limit]);

  // Generate page numbers for pagination controls
  const pageNumbers = []; // Initialize with an empty array and generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>R{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Ready For collection">Ready For collection</option>
              <option value="Collected">Collected</option>
            </select>
            <button onClick={() => handleDeleteOrder(order._id)}>Remove</button>

            <div className="delivery-notes"> {/* Wrapper for delivery and notes */}
              <p>Delivery Option: {order.deliveryOption}</p>
              <p>Notes: {order.notes}</p>
            </div>
          </div>
        })}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>{"< Previous"}</button>

        {page > 3 && <span>...</span>} {/* Ellipsis for pages before current */}

        {pageNumbers.map(number => (
          // Only display page buttons around the current page
          (number >= page - 2 && number <= page + 2) &&
          <button key={number} onClick={() => setPage(number)} className={page === number ? 'active' : ''}>
            {number}
          </button>
        ))}

        {page < totalPages - 2 && <span>...</span>} {/* Ellipsis for pages after current */}

        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>{"Next >"}</button>
      </div>
    </div>
  )
}

export default Orders
