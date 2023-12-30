import React from 'react';
import CardComponent from '@/components/LandingPage/CardComponent';
import AccidentReportComponent from '@/components/LandingPage/AccidentReportComponent';

function LandingComponent() {
    return (
        <div className='h-fit w-full bg-gray-100'>
            <div className='min-h-screen w-full max-w-screen-2xl flex items-center px-[3vw] sm:px-[7vw] lg:px-[15vw] py-6 sm:py-10 lg:py-15 bg-gray-100 mx-auto'>
                <CardComponent />
            </div>
            <div className='h-screen min-h-fit flex items-center bg-fixed bg-top bg-cover' style={{ backgroundImage: "url('/assets/bg/bgreportfixed.jpg')" }}>
                <div className="h-full w-full min-h-fit mx-auto sm:px-[7vw] lg:px-[15vw] lg:py-15 sm:py-10 backdrop-brightness-50 bg-blue/50">
                    <AccidentReportComponent />
                </div>
            </div>
        </div>
    );
};
export default LandingComponent;

