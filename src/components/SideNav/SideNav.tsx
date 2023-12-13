"use client";

import React, { useState } from 'react';
import { Database, House, MapPinLine, SignOut } from "@phosphor-icons/react";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 bg-gray-500 text-white w-full lg:bottom-0 lg:z-auto lg:w-64">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Skripsi GIS</h1>
      </div>
      <button
        onClick={toggleNav}
        className="p-4 text-right cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      <nav className={isOpen ? "block" : "hidden"}>
        <ul className="p-4">
          <li className="mb-2 flex items-center">
            <a href="#" className="text-gray-300 hover:text-white flex items-center">
              <House className="w-5 h-5 mr-2" /> Dashboard
            </a>
          </li>
          <li className="mb-2 flex items-center">
            <a href="#" className="text-gray-300 hover:text-white flex items-center">
              <MapPinLine className="w-5 h-5 mr-2" /> Maps
            </a>
          </li>
          <li className="mb-2 flex items-center">
            <a href="#" className="text-gray-300 hover:text-white flex items-center">
              <Database className="w-5 h-5 mr-2" /> Database
            </a>
          </li>
          <li className="mb-2 flex items-center">
            <a href="#" className="text-gray-300 hover:text-white flex items-center">
              <SignOut className="w-5 h-5 mr-2" /> Keluar
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;

