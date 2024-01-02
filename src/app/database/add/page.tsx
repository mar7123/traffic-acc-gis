import { findGeoLocsBound } from "@/lib/prisma/geoloc";
import { Metadata } from "next";
import dynamic from 'next/dynamic'
import { GeoLocation } from '@prisma/client';

const AddForm = dynamic(() => import('@/components/Database/AddForm'), { ssr: false });

export const metadata: Metadata = {
    title: "Add Form Page | TRASK",
    description: "TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan",
    // other metadata
};

type GeoLocationMod = Omit<GeoLocation, 'geojs'> & {
    geojs: GeoJSON.GeoJsonObject
}

const TambahForm = async () => {
    const { res, error } = await findGeoLocsBound();
    const data = res as any;
    return (
        <div className="flex flex-col items-center min-h-screen h-fit w-full px-[3vw] sm:px-[5vw] lg:px-[8vw] py-5 sm:py-10 lg:py-15 bg-gray-100">
            <AddForm boundary={data}/>
        </div>
    );
};

export default TambahForm;
