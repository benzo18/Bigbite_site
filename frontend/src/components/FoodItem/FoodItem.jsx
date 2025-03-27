import React, { useContext, useEffect  } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, isOutOfStock }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // With this fallback (temporarily):
    const imageUrl = `https://bigbite-food-images.s3.eu-north-1.amazonaws.com/${image}`;

    // *** CRITICAL DEBUGGING ***
    console.log("FoodItem - image prop:", image);
    console.log("FoodItem - Constructed URL:", imageUrl);

    // Debugging (optional)
    useEffect(() => {
        console.log("Current AWS Config:", {
            bucket: process.env.REACT_APP_S3_BUCKET,
            region: process.env.REACT_APP_AWS_REGION
        });
    }, []);

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/400x300?text=${encodeURIComponent(name)}`;
    };

    return (
        <div className={`food-item ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="food-item-img-container">
                <img
                    src={imageUrl}
                    alt={name}
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x200?text=Image+Missing';
                    }}
                />
                {!cartItems[id] ? (
                    !isOutOfStock ? (
                        <img
                            className='add'
                            onClick={() => addToCart(id)}
                            src={assets.add_icon_white}
                            alt='Add to cart'
                        />
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
                    )
                ) : null}
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