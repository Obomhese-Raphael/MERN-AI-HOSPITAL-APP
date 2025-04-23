import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { FaBars, FaTimes } from 'react-icons/fa'; 

const Navbar = () => {
  const { isLoaded, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="">
        <div className="">
          <div className="flex justify-between items-center py-5 text-black p-4">
            <div className="text-lg font-bold font-logo">
              <Link to={"/"} className="pl-5 italic">TeleCare Hub</Link>
            </div>
            {/* Hamburger Menu Icon for smaller screens */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="focus:outline-none">
                {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6 cursor-pointer" />}
              </button>
            </div>
            {/* Links */}
            <div className={`hidden md:flex links`}>
              <ul className="flex space-x-4 cursor-pointer gap-3 mr-20">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/services">Services</Link>
                </li>
                <li>
                  <Link to="/history">History</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <span className="cursor-pointer">
                    <SignedOut>
                      {isLoaded ? (
                        <SignInButton />
                      ) : (
                        <div>Loading...</div>
                      )}
                    </SignedOut>
                  </span>
                  <span className="">
                    <SignedIn>
                      {isLoaded && user && <UserButton />}
                    </SignedIn>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <hr />
          {/* Mobile Menu */}
          <div
            className={`fixed top-0 right-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:hidden ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleMenu} className="focus:outline-none">
                <FaTimes className="h-6 w-6 cursor-pointer" />
              </button>
            </div>
            <ul className="flex flex-col items-start space-y-7 p-4">
              <li>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={toggleMenu}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/history" onClick={toggleMenu}>
                  History
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={toggleMenu}>
                  Contact
                </Link>
              </li>
              <li>
                <span className="cursor-pointer">
                  <SignedOut>
                    {isLoaded ? <SignInButton /> : <div>Loading...</div>}
                  </SignedOut>
                </span>
              </li>
              <li>
                <span className="">
                  <SignedIn>
                    {isLoaded && user && <UserButton />}
                  </SignedIn>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;