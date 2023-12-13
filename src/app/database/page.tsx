import DatabaseComponent from '@/components/Database/DatabaseComponent';
import React from 'react';

async function DBPage() {
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full lg:px-[15vw] sm:px-[7vw] lg:py-20 sm:py-10 bg-gray-100'>
            <DatabaseComponent/>
        </div>
    );
};
export default DBPage;