import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={assets.bigbite} alt="" className="logo" />
        <img src={assets.admin_icon} alt="" className="profile" />
      
    </div>
  )
}

export default Navbar
