import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, isOutOfStock }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    const imageUrl = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${image}`;

    // *** CRITICAL DEBUGGING ***
    console.log("FoodItem - image prop:", image);
    console.log("FoodItem - Constructed URL:", imageUrl);

    // Handle image loading errors
    const handleImageError = (e) => {
        console.error(`Failed to load image: ${imageUrl}`);
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = `https://placehold.co/400x300/black/white/png?text=${encodeURIComponent(name)}&font=roboto`
        e.target.style.opacity = '0.8';
        e.target.style.border = '1px solid #eee';
        e.target.style.objectFit = 'contain';
    };

    return (
        <div className={`food-item ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="food-item-img-container">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="food-item-image"
                    onError={handleImageError}
                    loading="lazy"
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