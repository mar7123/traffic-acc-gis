import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Loader from "@/components/common/Loader";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Reports } from "@prisma/client";

type ReportsMod = Omit<Reports, 'id' | 'geoloc_id'>

const ReportPanelComponent = ({
    markerRef
}: {
    markerRef: L.Marker<any>
}) => {
    const { lat, lng } = markerRef.getLatLng();
    const [loading, setLoading] = useState<boolean>(false);
    const [checkTime, setCheckTime] = useState<{
        interval: NodeJS.Timeout | undefined,
        time_disable: boolean
    }>({
        interval: undefined,
        time_disable: false,
    });
    const [formData, setFormData] = useState<ReportsMod>({
        datetime_crash: new Date(),
        name: "",
        latitude: 0,
        longitude: 0,
        geojs: {},
        jumlah_kecelakaan: 1,
        meninggal: 0,
        luka_berat: 0,
        luka_ringan: 0,
        kerugian: 0,
    });
    const addReport = async () => {
        setLoading(true);
        const geolocid = await getMarkerGeoComp();
        const formDataInput = {
            ...formData,
            latitude: markerRef.getLatLng().lat,
            longitude: markerRef.getLatLng().lng,
            geojs: {
                type: "Feature",
                properties: {
                    name: formData.name,
                },
                geometry: {
                    type: "Point",
                    coordinates: [formData.longitude, formData.latitude]
                }
            },
        }
        const addrep = await fetch('/api/report/add', {
            method: "POST",
            body: JSON.stringify({
                data: formDataInput,
                geoloc_id: geolocid
            })
        })
        const { data } = await addrep.json()
        if (addrep.status == 201) {
            alert('success')
            setLoading(false)
        } else {
            alert('fail')
        }
    }
    const getMarkerGeoComp = async () => {
        const res = await fetch('/api/geoloc/findarea?' + new URLSearchParams({
            lat: String(markerRef.getLatLng().lat),
            lng: String(markerRef.getLatLng().lng),
        }), {
            method: "GET",
        })
        const { data } = await res.json()
        if (data.length != 0) {
            return data[0]?._id.$oid;
        }
        return null;
    }

    return (
        <>
            {loading ? (<Loader />) : (null)}
            <div className="overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 py-2 px-4">
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="datetime_crash" value="Waktu Kecelakaan" />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <Checkbox id="now" onChange={(e) => {
                                if (e.target.checked) {
                                    setFormData({ ...formData, datetime_crash: new Date() });
                                    setCheckTime({
                                        interval: setInterval(() => {
                                            setFormData({ ...formData, datetime_crash: new Date() });
                                        }, 60000), time_disable: true
                                    })
                                } else {
                                    clearInterval(checkTime.interval);
                                    setCheckTime({ interval: undefined, time_disable: false })
                                }
                            }} />
                            <Label htmlFor="now">sekarang</Label>
                        </div>
                        <input type="datetime-local" id="datetime_crash" name="datetime_crash" onChange={({ target }) => { setFormData({ ...formData, datetime_crash: new Date(target.value) }) }} value={formData.datetime_crash.toLocaleString('sv-SE').substring(0, 16)} disabled={checkTime.time_disable}></input>
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="latitude" value="Latitude" />
                        </div>
                        <TextInput id="latitude" type="number" value={markerRef.getLatLng().lat} shadow disabled />
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="longitude" value="Longitude" />
                        </div>
                        <TextInput id="longitude" type="number" value={markerRef.getLatLng().lng} shadow disabled />
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="name" value="Nama" />
                        </div>
                        <TextInput id="name" type="text" onChange={({ target }) => { setFormData({ ...formData, name: target.value }) }} value={formData.name} shadow required />
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="death_toll" value="Korban Meninggal" />
                        </div>
                        <TextInput id="death_toll" type="number" min={0} onChange={({ target }) => { setFormData({ ...formData, meninggal: Number(target.value) }) }} value={formData.meninggal} shadow required />
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="severe_injuries" value="Luka Berat" />
                        </div>
                        <TextInput id="severe_injuries" type="number" min={0} onChange={({ target }) => { setFormData({ ...formData, luka_berat: Number(target.value) }) }} value={formData.luka_berat} shadow required />
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="minor_injuries" value="Luka Ringan" />
                        </div>
                        <TextInput id="minor_injuries" type="number" min={0} onChange={({ target }) => { setFormData({ ...formData, luka_ringan: Number(target.value) }) }} value={formData.luka_ringan} shadow required />
                    </div>
                    <div className="h-full w-full">
                        <div className="mb-2">
                            <Label htmlFor="material_loss" value="Kerugian" />
                        </div>
                        <TextInput id="material_loss" type="number" min={0} onChange={({ target }) => { setFormData({ ...formData, kerugian: Number(target.value) }) }} value={formData.kerugian} shadow required />
                    </div>
                    <Button type="submit" onClick={addReport}>Submit</Button>
                </div>
            </div>
        </>
    )
}

export default ReportPanelComponent;