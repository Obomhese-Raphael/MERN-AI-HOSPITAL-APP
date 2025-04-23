import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-50 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-gray-600 px-5">
        <div>
          <h6 className="font-semibold text-gray-800 mb-4 text-xl logo-font">TeleCare Hub</h6>
          <p className="text-sm">Your trusted platform for online healthcare. Connecting you with professionals for convenient and quality care.</p>
        </div>
        <div>
          <h6 className="font-semibold text-gray-800 mb-4">Services</h6>
          <ul>
            <li className="mb-2"><Link to={"/"} className="text-sm hover:text-blue-500">Teleconsultation</Link></li>
            <li className="mb-2"><Link to={"/"} className="text-sm hover:text-blue-500">E-Prescription</Link></li>
            <li className="mb-2"><Link to={"/"} className="text-sm hover:text-blue-500">Health Records</Link></li>
            <li className="mb-2"><Link to={"/"} className="text-sm hover:text-blue-500">Find Specialists</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-semibold text-gray-800 mb-4">Contact & Support</h6>
          <ul>
            <li className="mb-2"><Link to={"/contact"} className="text-sm hover:text-blue-500">Contact Us</Link></li>
            <li className="mb-2"><Link to={"/"} className="text-sm hover:text-blue-500">FAQ</Link></li>
            <li className="mb-2"><Link to={"/"} className="text-sm hover:text-blue-500">Support</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-semibold text-gray-800 mb-4">Follow Us</h6>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-500"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-500"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-pink-500"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 py-4 font-bold italic text-center text-gray-600 text-sm mt-8 mb-0">
        <p>&copy; {currentYear} TeleCare Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;