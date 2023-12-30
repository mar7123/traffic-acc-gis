'use client';

import { Button, Label, TextInput } from 'flowbite-react';
import ModalComponent from "@/components/Modal/ModalComponent";
import { addDataAction } from "./DatabaseFormAction";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from 'next/navigation'

const initialState = {
    message: null,
}

export default function AddForm() {
    const router = useRouter()
    const center = {
        lat: -3.3675549,
        lng: 117.1377759,
    }

    const [mapLocation, setMapLocation] = useState<{
        markerRef: L.Marker<any> | undefined,
        toggle: boolean,
        prov: string,
        prov_id: string,
    }>({
        markerRef: undefined,
        toggle: true,
        prov: "",
        prov_id: "",
    });
    const [state, addFormAction] = useFormState(addDataAction, initialState);
    const [disableAdd, setDisableAdd] = useState(false);
    const [optModal, setOptModal] = useState<{
        open: boolean,
        status: "success" | "error",
        message: string
    }>({
        open: false,
        status: "success",
        message: ""
    });

    const setModal = ({ open, status, message }: { open: boolean, status: "success" | "error", message: string }) => {
        setOptModal({ open: open, status: status, message: message });
    }

    const MarkerOnClick = () => {
        const map = useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                if (mapLocation.markerRef) {
                    mapLocation.markerRef.setLatLng([lat, lng])
                    setMapLocation({ ...mapLocation, toggle: !mapLocation.toggle })
                    return
                }
                const marker = L.marker([lat, lng],
                    {
                        icon: L.icon({
                            iconUrl: MarkerIcon.src,
                            iconRetinaUrl: MarkerIcon.src,
                            iconSize: [25, 41],
                            iconAnchor: [12.5, 41],
                            popupAnchor: [0, -41],
                        }),
                    });
                setMapLocation({ ...mapLocation, markerRef: marker, toggle: !mapLocation.toggle });
                marker.addTo(map);
            }
        });
        return null;
    }

    const getMarkerGeoComp = async () => {
        const res = await fetch('/api/geoloc/findarea?' + new URLSearchParams({
            lat: mapLocation.markerRef ? mapLocation.markerRef.getLatLng().lat.toString() : "0",
            lng: mapLocation.markerRef ? mapLocation.markerRef.getLatLng().lng.toString() : "0",
        }), {
            method: "GET",
        })
        const { data } = await res.json()
        if (data.length != 0) {
            setMapLocation({ ...mapLocation, prov_id: data[0]?._id.$oid, prov: data[0]?.name2 })
        } else {
            setMapLocation({ ...mapLocation, prov_id: "", prov: "" })
        }
    }

    useEffect(() => {
        if (mapLocation.markerRef == undefined) {
            return
        }
        getMarkerGeoComp()
    }, [mapLocation.toggle])

    useEffect(() => {
        if (state.message == null || state.message == "Success") {
            return
        }
        if (state.message == "Tambah data berhasil") {
            setOptModal({ open: true, status: "success", message: state.message });
            router.push('/database')
            return
        }
        setDisableAdd(false);
        setOptModal({ open: true, status: "error", message: state.message });
    }, [state])
    return (
        <>
            <ModalComponent optModal={optModal} setModal={setModal} />
            <div className="grid  w-full gap-9 ">
                <div className="flex flex-col w-full gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex h-fit border-b border-stroke  dark:border-strokedark">
                            <a href='/database' className="px-3 sm:px-5 my-auto bg-transparent hover:text-primary">
                                <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                            </a>
                            <h3 className="my-4 mx-2 w-fit font-medium text-black dark:text-white">
                                Tambah Data
                            </h3>
                        </div>
                        <div className="h-96">
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
                                <MarkerOnClick />
                            </MapContainer>
                        </div>
                        <form className="flex w-full flex-col gap-4 py-4 px-8" action={addFormAction}>
                            <TextInput id="geodata_id" name="geodata_id" type="hidden" required />
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="nama" value="Nama / Identifier" />
                                </div>
                                <TextInput id="nama" name="nama" type="text" placeholder="Masukan nama" required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="latitude" value="Latitude" />
                                </div>
                                <TextInput id="latitude" name="latitude" type="number" readOnly value={mapLocation.markerRef ? mapLocation.markerRef.getLatLng().lat : ""} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="longitude" value="Longitude" />
                                </div>
                                <TextInput id="longitude" name="longitude" type="number" readOnly value={mapLocation.markerRef ? mapLocation.markerRef.getLatLng().lng : ""} onChange={(e) => {
                                    if (e.target.value != "" && new Date(e.target.value) > new Date()) {
                                        e.target.value = new Date().toLocaleString('sv-SE').substring(0, 16);
                                    }
                                }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="wilayah" value="Wilayah" />
                                </div>
                                <TextInput id="wilayah" name="wilayah" type="text" readOnly value={mapLocation.prov} required shadow />
                                <TextInput id="geoloc_id" name="geoloc_id" type="hidden" value={mapLocation.prov_id} required />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="waktu_kecelakaan" value="Waktu Kecelakaan" />
                                </div>
                                <TextInput id="waktu_kecelakaan" name="waktu_kecelakaan" type="datetime-local" placeholder="Masukan waktu kecelakaan" onChange={(e) => {
                                    if (e.target.value != "" && new Date(e.target.value) > new Date()) {
                                        e.target.value = new Date().toLocaleString('sv-SE').substring(0, 16);
                                    }
                                }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="jumlah_kecelakaan" value="Jumlah Kecelakaan" />
                                </div>
                                <TextInput id="jumlah_kecelakaan" name="jumlah_kecelakaan" type="number" min={1} placeholder="Masukan jumlah kecelakaan" onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="meninggal" value="Meninggal" />
                                </div>
                                <TextInput id="meninggal" name="meninggal" type="number" min={0} placeholder="Masukan jumlah korban meninggal" onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="luka_berat" value="Korban Luka Berat" />
                                </div>
                                <TextInput id="luka_berat" name="luka_berat" type="number" min={0} placeholder="Masukan jumlah korban luka berat" onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="luka_ringan" value="Korban Luka Ringan" />
                                </div>
                                <TextInput id="luka_ringan" name="luka_ringan" type="number" min={0} placeholder="Masukan jumlah korban luka ringan" onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="kerugian" value="Jumlah kerugian" />
                                </div>
                                <TextInput id="kerugian" name="kerugian" type="number" min={0} placeholder="Masukan jumlah kerugian" required onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} shadow />
                            </div>
                            <div className="relative flex w-full h-full flex-col">
                                {disableAdd ? (
                                    <div className="absolute w-full h-full z-1500">
                                        <div className="flex items-center justify-center bg-black h-full rounded-lg">
                                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (null)}
                                <Button className="bg-black hover:bg-opacity-80 text-white" color="bg-black hover:bg-opacity-80 text-white" type="submit" disabled={(disableAdd || (mapLocation.prov == ""))}>
                                    <span className="my-2 font-extrabold">
                                        Submit
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}