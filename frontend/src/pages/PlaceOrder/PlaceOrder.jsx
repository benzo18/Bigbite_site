import React, { useEffect, useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import * as jose from "jose";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [deliveryOption, setDeliveryOption] = useState('pickup'); // Default is pickup

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  const [notes, setNotes] = useState("");

  const handleNoteChange = (event) => {
    setNotes(event.target.value);
  };

  const placeOrder = async (event) => {
    try {
      event.preventDefault();
      console.log("Received token:", token);

      // 1. Decode the JWT and await the result
      const userId = await decodeJwt(token);

      // Create an array to store the order items
      let orderItems = [];

      // Iterate through the food_list to find items in the cart
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          // Verify that the item has a price
          if (item.price) {
            let itemInfo = { ...item }; // Create a copy of the item
            itemInfo.quantity = cartItems[item._id];
            orderItems.push(itemInfo);
          } else {
            console.error(`Item ${item.name} is missing price information`);
            // Handle the error appropriately (e.g., show an error message)
          }
        }
      });

      // === Add Validation for Notes and Delivery Option ===
      if (!notes) {
        alert("Please add a note before placing the order.");
        return; // Stop the function if notes are empty
      }

      if (!deliveryOption) {
        alert("Please select a delivery option before placing the order.");
        return; // Stop the function if delivery option is not selected
      }

      // Create an object to store the order data
      let orderData = {
        userId: userId,
        items: orderItems,
        amount: getTotalCartAmount(),
        deliveryOption: deliveryOption, // Add delivery option to order data
        notes: notes // Add notes to order data
      };
      console.log("Order data being sent:", orderData); // Add this line
      console.log("Delivery Option:", deliveryOption);
      console.log("Notes:", notes);

      // Send a POST request to the backend API to place the order
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if the order was placed successfully
      if (response.data.success) {
        // Get the session URL from the response data
        const { sessionUrl } = response.data;
        console.log("Received session URL:", sessionUrl); // Log the session URL

        // Redirect the user to the session URL
        window.location.href = sessionUrl;
      } else {
        // Handle errors returned by the backend API
        if (response.data.error) {
          alert("Error placing order: " + response.data.error);
        } else {
          alert("Failed to place order");
        }
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      console.error("Error placing Yoco order:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(
          "Error placing order. Please try again later. Status Code: " +
          error.response.status
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("Error placing order. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        alert("Error placing order. Please try again later.");
      }
    }
  };

  async function decodeJwt(token) {
    try {
      // Remove "Bearer " prefix if present
      const tokenWithoutBearer = token.startsWith("Bearer ")
        ? token.substring(7)
        : token;

      // Verify and decode the JWT using the jose library
      const { payload } = await jose.jwtVerify(
        tokenWithoutBearer,
        new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET)
      );

      // Return the userId from the decoded payload
      return payload.userId;
    } catch (err) {
      console.error("Invalid token:", err);

      // Handle the error appropriately (e.g., show an error message, redirect to login)
      return null;
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-center">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <hr />
          <div>
            <div className="cart-total-details">
              <p>Subtotal:</p>
              <p>
                R
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}
              </p>
            </div>

            <hr />
            <br />
          </div>

          {/* Delivery Options */}
          <div>
            <label>Delivery Option:</label>
            <div>
              <input
                type="radio"
                id="delivery"
                name="deliveryOption"
                value="delivery"
                checked={deliveryOption === "delivery"}
                onChange={(e) => setDeliveryOption(e.target.value)}
              />
              <label htmlFor="delivery">Delivery</label>
            </div>
            <div>
              <input
                type="radio"
                id="collection"
                name="deliveryOption"
                value="collection"
                checked={deliveryOption === "collection"}
                onChange={(e) => setDeliveryOption(e.target.value)}
              />
              <label htmlFor="collection">Collection</label>
            </div>
          </div>
          <div className="note">
            <label htmlFor="note">Add a Note:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;