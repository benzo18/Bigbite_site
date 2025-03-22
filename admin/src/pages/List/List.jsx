import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
    const [list, setList] = useState();

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error");
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            await fetchList();
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error("Error");
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    };

    // New function to update the stock status
    const updateStockStatus = async (id, currentStatus) => {
        try {
            const response = await axios.post(`${url}/api/food/update-stock-status`, {
                id: id,
                isOutOfStock: !currentStatus // Toggle the status
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList(); // Refresh the list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchList();
    },);

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
                {/* Conditional Rendering Here */}
                {list && list.length > 0 ? (
                    list.map((item, index) => {
                        return (
                            <div key={index} className="list-table-format">
                                <img src={`${url}'/assets/` + item.image} alt="" />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>{item.price}</p>
                                {/* Display current status */}
                                <p>{item.isOutOfStock ? "Yes" : "No"}</p>
                                {/* Wrap buttons in a div */}
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
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default List;