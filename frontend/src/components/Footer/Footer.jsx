import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.bigbite} alt="" className='logo' />
          
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
