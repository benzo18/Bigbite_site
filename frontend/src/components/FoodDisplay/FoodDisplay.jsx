import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'


const FoodDisplay = ({ category }) => {

  const { food_list } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Delicious Bites Within Easy Reach</h2>
      <div className='food-display-list'>
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return < FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              imageFilename={item.imageFilename}  // Make sure you are passing this!
              isOutOfStock={item.isOutOfStock}  // Pass the isOutOfStock prop
              />
          }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
