import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, imageFilename, isOutOfStock }) => { // Changed image to imageFilename
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // Construct the full image URL
  const imageUrl = `${url}/images/${imageFilename}`;

    return (
        <div className={`food-item ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="food-item-img-container">
            <img src={imageUrl} alt={name} className="food-item-image" />                {isOutOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
                {!cartItems[id]
                    ? !isOutOfStock // Only show add to cart if not out of stock
                        ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='' />
                        : <div className='food-item-counter'>
                            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                            <p>{cartItems[id]}</p>
                            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt='' />
                        </div>
                    : null
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">R{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;