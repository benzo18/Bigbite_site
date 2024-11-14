import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Quantity</p>
          <p>Price</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />

        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />

                  <p>{item.name}</p>
                  <p>R{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>R{item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null; // Add this to handle the case where cartItems[item._id] <= 0
        })}
      </div>
      <div className="cart-bottom">
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

          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;