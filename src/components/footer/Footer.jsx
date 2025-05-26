import React, { useState } from "react";
import { BiEnvelope } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { FaPhone, FaSolarPanel, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logobg.png";

const Footer = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:sales@DS.com?subject=Solar Inquiry&body=${message}`;
  };

  return (
    <footer className="bg-primary_blue  pt-12 pb-8 mt-auto border-t-8 border-primary_yellow">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="mb-8 md:mb-0">
            <img src={logo} alt="DS Logo" className="h-20 mb-4" />
            <p className="text-gray-700 text-sm">
              Harnessing Solar Energy for Sustainable Living
            </p>
            <div className="flex space-x-4 mt-6 text-white">
              <a href="#" className="p-2 bg-primary_yellow rounded-full hover:bg-yellow-500 transition">
                <FaFacebookF className="text-primary_blue text-lg" />
              </a>
              <a href="#" className="p-2 bg-primary_yellow rounded-full hover:bg-yellow-500 transition">
                <FaTwitter className="text-primary_blue text-lg" />
              </a>
              <a href="#" className="p-2 bg-primary_yellow rounded-full hover:bg-yellow-500 transition">
                <FaLinkedinIn className="text-primary_blue text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FaSolarPanel className="mr-2 text-primary_yellow" />
              Quick Links
            </h2>
            <nav className="space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-primary_yellow transition">
                Home
              </Link>
              <Link to="/system-advisor" className="block text-gray-700 hover:text-primary_yellow transition">
                System Advisor
              </Link>
              <Link to="/system-sizing" className="block text-gray-700 hover:text-primary_yellow transition">
                System Sizing
              </Link>
              <Link to="/get-a-quote" className="block text-gray-700 hover:text-primary_yellow transition">
                Get Quote
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="mb-8 md:mb-0">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FaSolarPanel className="mr-2 text-primary_yellow" />
              Contact Us
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <HiLocationMarker className="mt-1 mr-3 text-primary_yellow" />
                <div>
                  <p className="font-medium">Nairobi Headquarters</p>
                  <p className="text-gray-700 text-sm">P.O Box 12345-00100</p>
                  <p className="text-gray-700 text-sm">Nairobi, Kenya</p>
                </div>
              </div>
              <a href="tel:+254743739212" className="flex items-center hover:text-primary_yellow transition">
                <FaPhone className="mr-3 text-primary_yellow" />
                0711 079000
              </a>
              <a href="mailto:sales@DS.com" className="flex items-center hover:text-primary_yellow transition">
                <BiEnvelope className="mr-3 text-primary_yellow" />
                sales@DS.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FaSolarPanel className="mr-2 text-primary_yellow" />
              Quick Inquiry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Your solar questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-600 focus:border-none  focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 placeholder-gray-400 transition"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-primary_yellow text-white  text-primary_blue py-3 px-6 rounded-full font-semibold hover:bg-yellow-500 transition transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Davis & Shirtliff. All rights reserved. | 
            <a href="#" className="ml-2 hover:text-primary_yellow transition">Privacy Policy</a> | 
            <a href="#" className="ml-2 hover:text-primary_yellow transition">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;