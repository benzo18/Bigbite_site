import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './QuantityControl.css'; // Import the new CSS file

const QuantityControl = ({ itemId, quantity }) => {
  const { addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="quantity-control"> {/* Use the new class name */}
      <img
        onClick={() => removeFromCart(itemId)}
        src={assets.remove_icon_red}
        alt="Remove"
      />
      <p>{quantity}</p>
      <img
        onClick={() => addToCart(itemId)}
        src={assets.add_icon_green}
        alt="Add"
      />
    </div>
  );
};

export default QuantityControl;