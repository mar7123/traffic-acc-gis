import React from 'react';
import CardComponent from '@/components/LandingPage/CardComponent';
import TextareaComponent from '@/components/LandingPage/TextareaComponent';

function Landing() {
    return (
        <div className='h-fit w-full'>
            <div className='min-h-screen w-full flex items-center lg:px-[15vw] sm:px-[7vw] lg:py-20 sm:py-10 bg-gray-100'>
                <CardComponent />
                {/* Konten halaman Anda akan ada di sini */}
            </div>
            <div className='min-h-screen h-screen w-full flex items-center bg-fixed bg-top bg-cover' style={{ backgroundImage: "url('/assets/bgreportfixed.jpg')" }}>
                <div className="h-full w-full lg:px-[15vw] sm:px-[7vw] lg:py-20 sm:py-10 backdrop-brightness-50 bg-blue/50">
                    <TextareaComponent />
                </div>
                {/* Konten halaman Anda akan ada di sini */}
            </div>
        </div>
    );
};
export default Landing;

