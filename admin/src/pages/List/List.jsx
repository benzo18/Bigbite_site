import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
    const [foodList, setFoodList] = useState([]); // Renamed 'list' to 'foodList' for clarity
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const CDN_URL = import.meta.env.VITE_CDN_URL;

    const fetchFoodList = async () => { // Consistent naming: fetchFoodList
        setLoading(true);
        setError(null); // Clear any previous errors
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.data);
            } else {
                toast.error("Failed to fetch food list"); // More specific error message
                setError("Failed to fetch food list");
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            toast.error(error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchFoodList(); // Refresh the list after removal
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error removing food item:", error);
            toast.error(error.message);
        }
    };

    const updateStockStatus = async (id, currentStatus) => {
        try {
            const response = await axios.post(`${url}/api/food/update-stock-status`, {
                id: id,
                isOutOfStock: !currentStatus
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchFoodList(); // Refresh list after status update
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating stock status:", error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchFoodList();
    }, [url]); // Add url as a dependency

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Out of Stock</b>
                    <b>Action</b>
                </div>
                {foodList.length > 0 ? (
                    foodList.map((item, index) => {
                        const imageUrl = CDN_URL ? `${CDN_URL}/${item.image}` : `https://bigbite-food-images.s3.eu-north-1.amazonaws.com/uploads/uploads/${item.image}`;

                        return (
                            <div key={index} className="list-table-format">
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.src = `https://placehold.co/300x200?text=${encodeURIComponent(item.name)}`;
                                    }}
                                />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>{item.price}</p>
                                <p>{item.isOutOfStock ? "Yes" : "No"}</p>
                                <div className="action-buttons">
                                    <button onClick={() => updateStockStatus(item._id, item.isOutOfStock)} className='set-btn'>
                                        {item.isOutOfStock ? "Set In Stock" : "Set Out of Stock"}
                                    </button>
                                    <button onClick={() => removeFood(item._id)} className='remove-button'>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>No food items found.</div>
                )}
            </div>
        </div>
    );
};

export default List;