import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.bigbite} alt="" className='logo' />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque elementum fringilla. Duis porta ornare pellentesque. Vestibulum quis eros dictum, sodales enim sit amet, fermentum orci. Integer sed tortor sapien. Proin nec turpis aliquam, suscipit mauris sit amet, pretium nisi. Etiam nunc nulla, porta tristique malesuada ac, tempor id ex. Nulla sit amet sapien ligula.</p>
           <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.instagram_logo} alt="" />
            <img src={assets.twitter_icon} alt="" />
           </div>
        </div>
        <div className="footer-content-center">
           <h2>Big Bite Cafe</h2>
           <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Privacy policy</li>
           </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+27 11-598-7070</li>
                <li>bigbite@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright © 2024 Big Bite Cafe. All rights reserved.</p>
    </div>
  )
}

export default Footer
