import React, { useContext, useEffect } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, isOutOfStock }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const CDN_URL = import.meta.env.VITE_CDN_URL; // Get CDN URL from env

    // Construct the full image URL
    const imageUrl = CDN_URL ? `${CDN_URL}/${image}` : `https://bigbite-food-images.s3.eu-north-1.amazonaws.com/uploads/uploads/${image}`;

    // Debugging (optional)
    useEffect(() => {
        console.log("Current AWS Config:", {
            bucket: process.env.REACT_APP_S3_BUCKET,
            region: process.env.AWS_REGION
        });
    }, []);

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = CDN_URL ? `${CDN_URL}/${image}` : `https://placehold.co/400x300?text=${encodeURIComponent(name)}`;
    };

    return (
        <div className={`food-item ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="food-item-img-container">
                <img
                    src={imageUrl}
                    alt={name}
                    onError={handleImageError}
                />
                {!cartItems[id] ? (
                    !isOutOfStock ? (
                        <img
                            className='add'
                            onClick={() => addToCart(id)}
                            src={assets.add_icon_white}
                            alt='Add to cart'
                        />
                    ) : null
                ) : (
                    <div className='food-item-counter'>
                        <img
                            onClick={() => removeFromCart(id)}
                            src={assets.remove_icon_red}
                            alt='Remove item'
                        />
                        <p>{cartItems[id]}</p>
                        <img
                            onClick={() => addToCart(id)}
                            src={assets.add_icon_green}
                            alt='Add item'
                        />
                    </div>
                )}
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