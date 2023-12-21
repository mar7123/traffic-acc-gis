import React from 'react';
import CardComponent from '@/components/LandingPage/CardComponent';
import TextareaComponent from '@/components/LandingPage/AccidentReportComponent';

function LandingComponent() {
    return (
        <div className='h-fit w-full'>
            <div className='min-h-screen w-full flex items-center lg:px-[15vw] sm:px-[7vw] lg:py-15 sm:py-10 bg-gray-100'>
                <CardComponent />
            </div>
            <div className='min-h-screen h-screen w-full flex items-center bg-fixed bg-top bg-cover' style={{ backgroundImage: "url('/assets/bgreportfixed.jpg')" }}>
                <div className="h-full w-full lg:px-[15vw] sm:px-[7vw] lg:py-15 sm:py-10 backdrop-brightness-50 bg-blue/50">
                    <TextareaComponent />
                </div>
            </div>
        </div>
    );
};
export default LandingComponent;

