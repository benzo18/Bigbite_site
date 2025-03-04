import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from "axios"
import { toast } from "react-toastify"
import { useEffect } from 'react'
import { assets } from "../../assets/assets"

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    }
    else {
      toast.error(response.data.message);
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
  }, [])

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
            <p>Delivery Option: {order.deliveryOption}</p> {/* Add this line */}
            <p>Notes: {order.notes}</p> {/* Add this line */}
          </div>
        })}
      </div>
    </div>
  )
}

export default Orders
