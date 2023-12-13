'use client';

import Loader from "@/components/common/Loader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/navigation'


export default function AddForm() {
    const center = {
        lat: -3.3675549,
        lng: 117.1377759,
    }

    const [formData, setFormData] = useState({
        lat: center.lat,
        lng: center.lng,
        tahun: "",
        prov_id: "",
        prov: "None",
        kw_hutan: "",
        kw_bukan_hutan: "",
        total: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const markerRef = useRef<any>(null)
    const router = useRouter()


    const DraggableMarker = () => {
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        const latlng = marker.getLatLng();
                        setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng })
                    }
                },
            }),
            [],
        )

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={[formData.lat, formData.lng]}
                ref={markerRef}
                icon={
                    new L.Icon({
                        iconUrl: MarkerIcon.src,
                        iconRetinaUrl: MarkerIcon.src,
                        iconSize: [25, 41],
                        iconAnchor: [12.5, 41],
                        popupAnchor: [0, -41],
                    })
                }
            >
            </Marker>
        )
    }
    const getMarkerGeoComp = async () => {
        const res = await fetch('/api/geoloc/findarea?' + new URLSearchParams({
            lat: formData.lat.toString(),
            lng: formData.lng.toString(),
        }), {
            method: "GET",
        })
        const { data } = await res.json()
        if (data.length != 0) {
            setFormData({ ...formData, prov_id: data[0]?._id.$oid, prov: data[0]?.name })
        } else {
            setFormData({ ...formData, prov_id: "", prov: "None" })
        }
    }
    const addGeoData = async () => {
        if(formData.prov_id == ""){
            return
        }
        const res = await fetch('/api/geodata/add', {
            method: "POST",
            body: JSON.stringify({
                geoloc_id: formData.prov_id,
                data: {
                    tahun: Number(formData.tahun),
                    provinsi: formData.prov,
                    kawasan_hutan: Number(formData.kw_hutan),
                    bukan_kawasan_hutan: Number(formData.kw_bukan_hutan),
                    total_deforestasi: Number(formData.total),
                }
            })
        })
        const { message } = await res.json()
        if (res.status == 201) {
            router.push("/tables");
        } else {
        }
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 500);
    }, [])

    useEffect(() => {
        getMarkerGeoComp()
    }, [formData.lat, formData.lng])

    return (
        <div className="grid  w-full gap-9 ">
            <div className="flex flex-col w-full gap-9">
                {/* <!-- Form --> */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Tambah Data
                        </h3>
                    </div>
                    <div className="h-96">
                        {loading ? (<Loader />) : (
                            <>
                                <MapContainer
                                    center={[center.lat, center.lng]}
                                    zoom={5}
                                    scrollWheelZoom={true}
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <DraggableMarker />
                                </MapContainer>
                            </>
                        )}
                    </div>
                    <form onSubmit={(event: any) => {
                        event.preventDefault();
                        addGeoData();
                    }}>
                        <div className="p-6.5">

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Latitude <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Latitude"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.lat}
                                    disabled
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Longitude <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Longitude"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.lng}
                                    disabled
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Tahun <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Year"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.tahun}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, tahun: target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Provinsi
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Provinsi"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.prov}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, prov: target.value })
                                    }
                                    disabled
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Kawasan Hutan
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Kawasan Hutan"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.kw_hutan}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, kw_hutan: target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Bukan Kawasan Hutan
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Bukan Kawasan Hutan"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.kw_bukan_hutan}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, kw_bukan_hutan: target.value })
                                    }
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Total Deforestasi
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Total Deforestasi"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.total}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, total: target.value })
                                    }
                                />
                            </div>

                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}