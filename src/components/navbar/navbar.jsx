import React, { useState } from "react";
import { FaX } from "react-icons/fa6";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/logobg.png";
import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaPhone, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { HiBars3BottomRight } from "react-icons/hi2";
import { BiUser } from "react-icons/bi";
import axios from "axios";

const Navbar = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Clear any previous auth tokens
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <div className="md:px-8">
      <div className="f">
        {/* Mobile */}
        <div className="bg-primary_yellow md:hidden flex py-1 justify-between">
          <img src={logo2} alt="logo" className="h-16" />
          <button onClick={() => setSideMenu(true)}>
            <HiBars3BottomRight size={35} className="p-1 mr-1 text-white hover:cursor-pointer" />
          </button>
        </div>

        {sideMenu && (
          <div className="fixed top-0 left-0 w-full h-screen bg-primary_yellow z-50 flex flex-col text-white justify-center items-center">
            <button
              onClick={() => setSideMenu(false)}
              className="absolute top-6 right-6"
            >
              <FaX size={20} />
            </button>
            <img
              src={logo2}
              alt="logo"
              className="flex justify-center items-center w-fit h-16 p-2"
            />

            <ul className="flex flex-col gap-4 text-center mt-8">
              <li><Link to="/" onClick={() => setSideMenu(false)}>Home</Link></li>
              <li><Link to="/client-details" onClick={() => setSideMenu(false)}>System Advisor</Link></li>
              <li><Link to="/system-sizing" onClick={() => setSideMenu(false)}>System Sizing</Link></li>
              {/* <li><Link to="/get-a-quote" onClick={() => setSideMenu(false)}>Get a Quote</Link></li> */}
            </ul>

            {/* Mobile Sign In Button */}
            <button
              className="flex items-center gap-2 px-6 py-2 mt-6 text-primary_yellow bg-white rounded-lg hover:bg-gray-200"
              onClick={() => {
                setSideMenu(false);
                handleSignIn();
              }}
            >
              <BiUser /> Sign In
            </button>


            <div className="flex gap-4 mt-6 text-sm">
              <a href="tel:+254797871876"><FaPhone size={20} className="rotate-90" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={20} /></a>
              <a href="https://wa.me/254796871876?text=Hello%20JTours," target="_blank" rel="noopener noreferrer"><FaWhatsapp size={20} /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok size={20} /></a>
            </div>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex justify-between items-center py-4">
        <img src={logo} alt="logo" className="h-16" />
        <ul className="flex gap-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/system-advisor">System Advisor</Link></li>
          <li><Link to="/system-sizing">System Sizing</Link></li>
          {/* <li><Link to="/get-a-quote">Get a Quote</Link></li> */}
          {/* <li><Link to="/test">Solar Intensity</Link></li> */}
        </ul>
        <div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-white bg-primary_yellow rounded-lg hover:bg-yellow-500"
            onClick={handleSignIn}
          >
            <BiUser /> Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
