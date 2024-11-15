import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {

const [menu,setMenu] = useState("menu");

const{getTotalCartAmount,token,setToken} = useContext(StoreContext)

const navigate = useNavigate();

const logout = () =>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/");

}
    
  return (
    <div className='navbar'>
        <NavLink to='/'><img src={assets.bigbite} alt='' className='logo' /></NavLink>
        <ul className="navbar-menu">
            <NavLink to='/' onClick={()=>setMenu("Home")} className={menu==="Home"?"active":""}>Home</NavLink>
            <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</a>
            <a href='#footer' onClick={()=>setMenu("Contact Us")} className={menu==="Contact Us"?"active":""}>Contact Us</a>
      </ul>
        <div className='navbar-right'>
        
        <div className='navbar-serach-icon'>
           <NavLink to='/cart'><img src={assets.basket_icon} alt="" /></NavLink>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?<button onClick={()=>setShowLogin(true)} >Sign in</button>
        :<div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              
              <hr />
              <li onClick={logout} ><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>}
        
      </div>
    </div>
  )
}

export default Navbar
