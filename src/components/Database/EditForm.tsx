'use client';
import { editDataAction } from "./DatabaseFormAction";
import { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useFormState } from "react-dom";
import ModalComponent from "@/components/Modal/ModalComponent";
import { GeoData, GeoLocation } from "@prisma/client";
import { useRouter } from 'next/navigation'

type GeoLocationMod = Omit<GeoLocation, 'geojs'> & {
    geojs: GeoJSON.GeoJsonObject,
}

interface GeoDataMod extends GeoData {
    geoloc: {
        name2: string;
    }
}

const initialState = {
    message: null,
}

export default function EditForm({ data, boundary }: { data: GeoDataMod, boundary?: GeoLocationMod | null }) {
    const router = useRouter()
    const center = {
        lat: -7.2752731,
        lng: 110.1234954
    }
    const [mapLocation, setMapLocation] = useState<{
        markerRef: L.Marker<any>,
        prov: string,
        geoloc_id: string,
    }>({
        markerRef: new L.Marker(
            [data.latitude, data.longitude],
            {
                icon: L.icon({
                    iconUrl: MarkerIcon.src,
                    iconRetinaUrl: MarkerIcon.src,
                    iconSize: [25, 41],
                    iconAnchor: [12.5, 41],
                    popupAnchor: [0, -41],
                }),
            }
        ),
        prov: data.geoloc.name2,
        geoloc_id: data.geoloc_id,
    });
    const [state, editFormAction] = useFormState(editDataAction, initialState);
    const [disableEdit, setDisableEdit] = useState(false);
    const [optModal, setOptModal] = useState<{
        open: boolean,
        status: "success" | "error",
        message: string
    }>({
        open: false,
        status: "success",
        message: ""
    });


    const getMarkerGeoComp = async (markerRef: L.Marker<any>) => {
        const res = await fetch('/api/geoloc/findarea?' + new URLSearchParams({
            lat: markerRef ? markerRef.getLatLng().lat.toString() : "0",
            lng: markerRef ? markerRef.getLatLng().lng.toString() : "0",
        }), {
            method: "GET",
        })
        const { data } = await res.json()
        if (data.length != 0) {
            setMapLocation({ markerRef: markerRef, geoloc_id: data[0]?._id.$oid, prov: data[0]?.name2 })
        } else {
            setMapLocation({ markerRef: markerRef, geoloc_id: "", prov: "" })
        }
    }

    const MarkerOnClick = () => {
        const mapready = useMap();
        mapready.whenReady(() => {
            mapLocation.markerRef.addTo(mapready);
        })
        const map = useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                mapLocation.markerRef.setLatLng([lat, lng])
                getMarkerGeoComp(mapLocation.markerRef)
            },
            load: (e) => {
                mapLocation.markerRef.addTo(map);
            }
        });
        return null;
    }

    const setModal = ({ open, status, message }: { open: boolean, status: "success" | "error", message: string }) => {
        setOptModal({ open: open, status: status, message: message });
    }

    useEffect(() => {
        if (state.message == null) {
            return
        }
        if (state.message == "Update data berhasil") {
            setOptModal({ open: true, status: "success", message: state.message });
            router.push('/database')
            return
        }
        setDisableEdit(false);
        setOptModal({ open: true, status: "error", message: state.message });
    }, [state, router])

    useEffect(() => {
        if (optModal.open) {
            setTimeout(() => { setOptModal({ ...optModal, open: false }) }, 1500)
        }
    }, [optModal])

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
                                Edit Data
                            </h3>
                        </div>
                        <div className="h-96">
                            <MapContainer
                                center={[center.lat, center.lng]}
                                zoom={8}
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
                                {boundary != null ? (
                                    <GeoJSON
                                        key={JSON.stringify(boundary)}
                                        data={boundary.geojs}
                                        pathOptions={{
                                            fillColor: "#f3f4f6",
                                            fillOpacity: 0.3,
                                            weight: 2,
                                            opacity: 1,
                                            color: "black"
                                        }}
                                    >
                                    </GeoJSON>
                                ) : (null)}
                                <MarkerOnClick />
                            </MapContainer>
                        </div>

                        <form className="flex w-full flex-col gap-4 py-4 px-8" action={editFormAction} onSubmit={(e) => {
                            setDisableEdit(true);
                        }}>
                            <TextInput id="geodata_id" name="geodata_id" type="hidden" defaultValue={data.id} required />
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="nama" value="Nama / Identifier" />
                                </div>
                                <TextInput id="nama" name="nama" type="text" placeholder="Masukan nama" defaultValue={data.name} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="desc" value="Deskripsi Kecelakaan" />
                                </div>
                                <Textarea id="desc" name="desc" placeholder="Masukan deskripsi kecelakaan" defaultValue={data.name} required shadow />
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
                                <TextInput id="longitude" name="longitude" type="number" readOnly value={mapLocation.markerRef ? mapLocation.markerRef.getLatLng().lng : ""} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="wilayah" value="Wilayah" />
                                </div>
                                <TextInput id="wilayah" name="wilayah" type="text" readOnly value={mapLocation.prov} required shadow />
                                <TextInput id="geoloc_id" name="geoloc_id" type="hidden" value={mapLocation.geoloc_id} required />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="waktu_kecelakaan" value="Waktu Kecelakaan" />
                                </div>
                                <TextInput id="waktu_kecelakaan" name="waktu_kecelakaan" type="datetime-local" placeholder="Masukan waktu kecelakaan" defaultValue={data.datetime_crash.toLocaleString('sv-SE').substring(0, 16)} onChange={(e) => {
                                    if (e.target.value != "" && new Date(e.target.value) > new Date()) {
                                        e.target.value = new Date().toLocaleString('sv-SE').substring(0, 16);
                                    }
                                }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="jumlah_kecelakaan" value="Jumlah Kecelakaan" />
                                </div>
                                <TextInput id="jumlah_kecelakaan" name="jumlah_kecelakaan" type="number" placeholder="Masukan jumlah kecelakaan" defaultValue={data.jumlah_kecelakaan} onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} min={1} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="meninggal" value="Meninggal" />
                                </div>
                                <TextInput id="meninggal" name="meninggal" type="number" placeholder="Masukan jumlah korban meninggal" defaultValue={data.meninggal} min={0} onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="luka_berat" value="Korban Luka Berat" />
                                </div>
                                <TextInput id="luka_berat" name="luka_berat" type="number" placeholder="Masukan jumlah korban luka berat" defaultValue={data.luka_berat} onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} min={0} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="luka_ringan" value="Korban Luka Ringan" />
                                </div>
                                <TextInput id="luka_ringan" name="luka_ringan" type="number" placeholder="Masukan jumlah korban luka ringan" defaultValue={data.luka_ringan} onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} min={0} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="kerugian" value="Jumlah kerugian" />
                                </div>
                                <div className="relative h-fit w-full">
                                    <div className="absolute flex h-full w-[40px] z-1">
                                        <span className="text-sm m-auto">Rp</span>
                                    </div>
                                    <TextInput id="kerugian" name="kerugian" type="number" sizing={"md"} defaultValue={data.kerugian} theme={{ field: { input: { sizes: { md: "pl-8 text-sm" } } } }} step={1000} onKeyDown={(e) => { ["e", "E", "+", "-"].includes(e.key) && e.preventDefault() }} min={0} shadow required />
                                </div>
                            </div>
                            <div className="relative flex w-full h-full flex-col">
                                {disableEdit ? (
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
                                <Button className="bg-black hover:bg-opacity-80 text-white" color="bg-black hover:bg-opacity-80 text-white" type="submit" disabled={disableEdit}>
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