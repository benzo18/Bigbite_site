import React, {  useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
  

const [image,setImage] = useState(false);
const [data,setData] = useState({
  name: '',
  description: '',
  price: '',
  category: ''
})

const onChangeHandler = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  setData(data=>({ ...data, [name]: value }));
}

const onSubmitHandler = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description',data.description);
  formData.append('price', Number(data.price));
  formData.append('category',data.category);
  formData.append('image',image)
const response = await axios.post(`${url}/api/food/add`, formData);
if (response.data.success) {
  setData({
    name: '',
    description: '',
    price: '',
    category: '',
  })
  setImage(false)
  toast.success(response.data.message)
}
else{
  toast.error(res.data.message)
}



}

  return (
    <div className='add'>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
          <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required/>
          </div>
          <div className="add-product-name flex-col">
            <p>Product Name</p >
            <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder="Enter product name" />
          </div>
          <div className="add-product-description flex-col">
            <p>Product description</p >
            <textarea onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder="Write content here" required></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product Category</p >
              <select onChange={onChangeHandler}  value={data.category} name="category">
              <option value="">Select a category</option>
                <option value="Vegeterian">Vegeterian</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Bagels">Bagels</option>
                <option value="Burgers">Burgers</option>
                <option value="Pizzas">Pizzas</option>
                <option value="Wings">Wings</option>
                <option value="Pasta">Pasta</option>
                <option value="Tramazinnis">Tramazinnis</option>
                <option value="Grilled">Grilled</option>
                <option value="Fried">Fried</option>
                <option value="Wraps">Wraps</option>
                <option value="Snacks & Sweets">Snacks & Sweets</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Product Price</p >
              <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder="Enter price: R" />
            </div>
           
          </div>
          <button type='submit' className='add-btn'>ADD</button>
      </form>
      
    </div>
  )
}

export default Add
