import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import QuantityControls from '../../components/QuantityControl/QuantitiyControl';

const Cart = () => {
  const {
    cartItems,
    food_list,
   
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
                 <img className="food-image" src={url + "/images/" + item.image} alt={item.name} />
                  <p>{item.name}</p> 
                  <p>R{item.price}</p> 
                  <p>R{item.price * cartItems[item._id]}</p> 
                  <QuantityControls className="quantity-control"  itemId={item._id} quantity={cartItems[item._id]} />
                </div>
                <hr />
              </div>
            );
          }
          return null; 
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
                {getTotalCartAmount() === 0? 0: getTotalCartAmount()}
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