import React, { useState } from "react";


interface NavItem {
  label: string;
  link: string; 
  icon?: string; 
  subItems?: NavItem[]; 
}

interface NavBarProps {
  logoText: string;
  navItems: NavItem[];
}

const NavBar = ({ logoText, navItems } : NavBarProps) => {
  const [isMobileViewOpen, setMobileViewOpen] = useState(false);

  return (
    <nav className="bg-teal-700 p-4 shadow-md rounded-tl-lg rounded-tr-lg mt-6"> 
      <div className="container mx-auto flex justify-between items-center text-white">
        {/* Logo/Brand Name */}
        <a href="/" className="text-xl font-bold">
          {logoText}
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <div key={index} className="relative group">
              <a
                href={item.link}
                className="hover:text-teal-200 transition-colors duration-200 cursor-pointer flex items-center" // Added flex items-center for icon alignment
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-5 h-5 mr-1"
                  />
                )}
                {item.label}

                {item.subItems && (
                  <svg
                    className="ml-1 w-4 h-4 inline-block transform group-hover:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                )}
              </a>

              {/* Desktop Sub-items (Dropdown) */}
              {item.subItems && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {item.subItems?.map((subItem, subindex) => (
                    <a
                      key={subindex}
                      href={subItem.link}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:rounded-md flex items-center" // Added flex items-center
                    >
                      {subItem.icon && (
                        <img
                          src={subItem.icon}
                          alt={subItem.label}
                          className="w-4 h-4 mr-1"
                        />
                      )}
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Button (Hamburger/Close Icon) */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileViewOpen(!isMobileViewOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileViewOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path> // Close icon
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path> // Hamburger icon
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Dropdown when open) */}
      {isMobileViewOpen && (
        <div className="md:hidden py-2 mt-4">
          {navItems.map((item, index) => {
            return (
              <div key={index}>
                {" "}
                <a
                  href={item.link}
                  className="block text-white px-4 py-2 hover:bg-teal-800 transition-colors duration-200 flex items-center"
                  onClick={() => setMobileViewOpen(false)}
                >
                  {item.icon && (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-5 h-5 mr-1"
                    />
                  )}
                  {item.label}
                </a>
                {item.subItems && (
                  <div className="pl-6 bg-teal-800">
                    {item.subItems.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href={subItem.link}
                        className="block text-white px-4 py-2 hover:bg-teal-800 transition-colors duration-200 text-sm flex items-center" // Added flex items-center
                        onClick={() => setMobileViewOpen(false)}
                      >
                        {subItem.icon && (
                          <img
                            src={subItem.icon}
                            alt={subItem.label}
                            className="w-4 h-4 mr-1"
                          />
                        )}
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
