import DatabaseComponent from '@/components/Database/DatabaseComponent';
import React from 'react';

async function DBPage() {
    return (
        <div className='h-[3029px] w-full px-[7vw] bg-cover bg-top' style={{ backgroundImage: "url('/assets/bg/bg-landing.png')" }}>
            <DatabaseComponent/>
        </div>
    );
};
export default DBPage;