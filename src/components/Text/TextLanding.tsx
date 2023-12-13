'use client';

import React from 'react';
import { Button } from 'flowbite-react';

function TextLanding() {
  return (
    <div className="text-left pl-15 mt-20 max-w-xl"> {/* Menambahkan padding kiri, margin atas, dan lebar maksimum */}
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Sistem Informasi Geografis untuk Pemantauan Deforestasi di Indonesia</h1>
      <p className="text-lg md:text-xl text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut </p>
      <Button href="/map" className="mt-4 bg-[#174405] hover:bg-[#EFBE55] w-full md:w-auto md:inline-block py-1 font-semibold text-white">Lihat Peta</Button>
    </div>
  );
}

export default TextLanding;




