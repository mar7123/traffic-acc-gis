"use client";

import Loader from "@/components/common/Loader";
import ViewPanelComponent from "./ViewPanelComponent";
import ReportPanelComponent from "./ReportPanelComponent";
import { useSearchParams } from 'next/navigation'
import { MapContainer, TileLayer, GeoJSON, useMapEvents, useMap, Popup, Marker } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { ChangeEvent, useEffect, useState } from "react";
import { GeoLocation, GeoData, Reports } from "@prisma/client";
import { Tooltip, Button } from "flowbite-react";

type GeoLocationMod = Omit<GeoLocation, 'geojs'> & {
    geojs: GeoJSON.GeoJsonObject
}
type GeoDataMod = Omit<GeoData, 'geojs'> & {
    geojs: GeoJSON.GeoJsonObject
}
type ReportsMod = Omit<Reports, 'geojs'> & {
    geojs: GeoJSON.GeoJsonObject
}

interface GeoDatas extends GeoDataMod {
    geojs: GeoJSON.GeoJsonObject,
}
interface ReportsData extends ReportsMod {
    geojs: GeoJSON.GeoJsonObject,
}
interface Geolocs extends GeoLocationMod {
    geojs: GeoJSON.GeoJsonObject,
    color?: string,
    fillOpacity?: number,
    agregate: {
        geoloc_id: string,
        _sum: {
            jumlah_kecelakaan: number,
        }
    }[],
    geodatas: GeoDatas[],
    reports: ReportsData[],
    _count: {
        georeports: number,
    }
}

const ViewMode = ['view', 'report'];
type MapViewMode = typeof ViewMode[number];


const MapComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const defaultMapOptions = {
        center: {
            lat: -7.2752731,
            lng: 110.1234954
        },
        zoom: 9
    };
    const [geolocs, setGeolocs] = useState<Geolocs[]>([]);
    const [focusedGeolocs, setFocusedGeolocs] = useState<Geolocs>();
    const focusedGeolocStyle = {
        fillOpacity: 0.4,
        color: "#1f2937",
    }
    const [markerRef, setMarkerRef] = useState<L.Marker<any> | undefined>(undefined);
    const [showPanel, setShowPanel] = useState(true);
    const [year, setYear] = useState<{ selected: number, yearDD: number[] }>({
        selected: 0,
        yearDD: []
    });
    const searchParams = useSearchParams()
    const mode = searchParams.get('mode');
    const mode_val = mode ? mode : '';
    const [filters, setFilters] = useState<{
        count: {
            data: number,
            high: number,
            med: number,
            low: number,
        },
        mean: number,
        std: number,
        n: number,
        max: number,
        min: number,
        upper: {
            val: number,
            exist: boolean
        },
        lower: {
            val: number,
            exist: boolean
        },
        mode: MapViewMode,
        toggle: boolean
    }>({
        count: {
            data: 0,
            high: 0,
            med: 0,
            low: 0,
        },
        mean: 0,
        std: 0,
        n: 0,
        max: 0,
        min: 0,
        upper: {
            val: 0,
            exist: false,
        },
        lower: {
            val: 0,
            exist: false,
        },
        mode: ViewMode.indexOf(mode_val) !== -1 ? mode_val : "view",
        toggle: true
    });

    const selectYear = (e: ChangeEvent<HTMLSelectElement>) => {
        if (String(year.selected) != e.currentTarget.value) {
            setYear({ ...year, selected: Number(e.currentTarget.value) });
            setFilters({ ...filters, n: 0, toggle: !filters.toggle })
            setFocusedGeolocs(undefined);
        }
    }

    const selectN = (target: EventTarget & HTMLInputElement) => {
        setFilters({
            ...filters,
            upper: {
                ...filters.upper,
                exist: false
            },
            lower: {
                ...filters.lower,
                exist: false
            },
            n: Number(target.value),
            toggle: !filters.toggle
        });
    }

    const mean = (
        data: Geolocs[],
        calc: {
            count: { data: number },
            mean: number
        }
    ) => {
        let count = 0;
        let sum = 0;
        data.forEach((elem) => {
            if (elem.agregate.length == 1) {
                count += 1;
                sum += elem.agregate[0]?._sum.jumlah_kecelakaan;
            }
        });
        if (count != 0) {
            calc.count.data = count;
            calc.mean = sum / count;
        } else {
            calc.count.data = 0;
            calc.mean = 0;
        }
    }

    const std = (
        data: Geolocs[],
        calc: {
            count: { data: number },
            mean: number,
            std: number
        }
    ) => {
        if (calc.count.data <= 1) {
            calc.std = 0;
        }
        let sum = 0;
        data.forEach((elem) => {
            if (elem.agregate.length == 1) {
                sum += Math.pow(elem.agregate[0]?._sum.jumlah_kecelakaan - calc.mean,
                    2);
            }
        });
        if (calc.count.data > 1) {
            calc.std = Math.sqrt(sum / (calc.count.data - 1));
        }
    }

    const assignColor = (
        data: Geolocs[],
        calc: {
            count: {
                high: number,
                med: number,
                low: number
            },
            mean: number,
            upper: {
                val: number,
                exist: boolean
            },
            lower: {
                val: number,
                exist: boolean
            }
        }
    ) => {
        calc.count.high = 0;
        calc.count.med = 0;
        calc.count.low = 0;
        const result = data.map((elem) => {
            if (elem.agregate.length == 1) {
                elem.fillOpacity = 0.5;
                if (elem.agregate[0]?._sum.jumlah_kecelakaan > calc.upper.val) {
                    calc.count.high += 1;
                    calc.upper.exist = true;
                    elem.color = "#ef4444";
                    return elem;
                }
                if (elem.agregate[0]?._sum.jumlah_kecelakaan < calc.lower.val) {
                    calc.count.low += 1;
                    calc.lower.exist = true;
                    elem.color = "#22c55e";
                    return elem;
                }
                if (elem.agregate[0]?._sum.jumlah_kecelakaan >= calc.lower.val && elem.agregate[0]?._sum.jumlah_kecelakaan <= calc.upper.val) {
                    calc.count.med += 1;
                    elem.color = "#fde047";
                    return elem;
                }
            }
            return elem;
        });
        return result;
    }

    const calculate = (
        data: Geolocs[],
        calc_var: {
            count: {
                data: number,
                high: number,
                med: number,
                low: number
            },
            mean: number,
            std: number,
            n: number,
            max: number,
            min: number,
            upper: {
                val: number,
                exist: boolean
            },
            lower: {
                val: number,
                exist: boolean
            }
        },
    ) => {
        if (calc_var.count.data <= 1) {
            return data;
        }
        let tries = 0;
        let temp = data;
        while ((!calc_var.upper.exist || !calc_var.lower.exist) && tries != 3) {
            calc_var.upper.val = calc_var.mean + (calc_var.n * calc_var.std);
            calc_var.lower.val = calc_var.mean - (calc_var.n * calc_var.std);
            temp = assignColor(data, calc_var);
            if (!calc_var.upper.exist || !calc_var.lower.exist) {
                if (Math.abs(calc_var.max - calc_var.mean) < Math.abs(calc_var.mean - calc_var.min)) {
                    calc_var.n = Math.abs(calc_var.max - calc_var.mean) / calc_var.std;
                } else {
                    calc_var.n = Math.abs(calc_var.mean - calc_var.min) / calc_var.std;
                }
                calc_var.n = (Math.floor(Number(calc_var.n) * 10) / 10 == undefined ? calc_var.n : Math.floor(Number(calc_var.n) * 10) / 10)
            }
            tries += 1;
        }
        setFilters({
            ...filters,
            count: {
                ...filters.count,
                high: calc_var.count.high,
                med: calc_var.count.med,
                low: calc_var.count.low,
            },
            mean: (Number(calc_var.mean.toFixed(3)) == undefined ? calc_var.mean : Number(calc_var.mean.toFixed(3))),
            std: (Number(calc_var.std.toFixed(3)) == undefined ? calc_var.std : Number(calc_var.std.toFixed(3))),
            n: calc_var.n
        });
        const result = temp;
        return result;
    }

    const geolocsAPI = async () => {
        if (filters.n <= 0) {
            const yearDB = await fetch('/api/geodata/year', {
                method: "GET",
            }).then(async (year_res) => {
                const { data: yearjson }: { data: number[] } = await year_res.json()
                const year_q = year.selected == 0 ? yearjson[0] : year.selected;
                setYear({ selected: year_q, yearDD: yearjson });
                const res = await fetch('/api/geoloc?' + new URLSearchParams({
                    year: year_q.toString(),
                }), {
                    method: "GET",
                }).then(async (geoloc_res) => {
                    const { data }: { data: Geolocs[] } = await geoloc_res.json()
                    if (data.length == 0) {
                        return
                    }

                    // Calculations
                    let calc_var = filters;
                    calc_var.n = 5;
                    calc_var.upper.exist = false;
                    calc_var.lower.exist = false;
                    calc_var.count.high = 0;
                    calc_var.count.med = 0;
                    calc_var.count.low = 0;
                    mean(data, calc_var);
                    std(data, calc_var);
                    if (calc_var.count.data != 0) {
                        calc_var.max = data.reduce(function (prev, current) {
                            if (prev.agregate.length == 1 && current.agregate.length == 1) {
                                return (prev && prev.agregate[0]?._sum.jumlah_kecelakaan > current.agregate[0]?._sum.jumlah_kecelakaan) ? prev : current
                            }
                            return current;
                        }).agregate[0]._sum.jumlah_kecelakaan
                        calc_var.min = data.reduce(function (prev, current) {
                            if (prev.agregate.length == 1 && current.agregate.length == 1) {
                                return (prev && prev.agregate[0]?._sum.jumlah_kecelakaan < current.agregate[0]?._sum.jumlah_kecelakaan) ? prev : current
                            }
                            return current;
                        }).agregate[0]._sum.jumlah_kecelakaan
                    }
                    const result = calculate(data, calc_var);
                    setGeolocs(result);
                }).catch((err) => {
                    window.alert("Error on fetching data")
                })
            }).catch((err) => {
                window.alert("Error on fetching data")
            })

        } else {
            if (focusedGeolocs) {
                const new_geolocs = geolocs.map((filter_item) => {
                    if (filter_item.id == focusedGeolocs?.id) {
                        return {
                            ...focusedGeolocs
                        }
                    }
                    return filter_item
                });
                const result = calculate(new_geolocs, filters);
                setGeolocs(result);
            } else {
                const result = calculate(geolocs, filters);
                setGeolocs(result);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true)
        geolocsAPI()
    }, [filters.toggle])

    const MarkerOnClick = () => {
        const map = useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                if (markerRef) {
                    markerRef.setLatLng([lat, lng])
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
                setMarkerRef(marker);
                marker.addTo(map);
            }
        });
        return null;
    }

    const MapPanel = ({ mode }: { mode: string }) => {
        const MinBttn = () => {
            return (
                <Button type="submit" color="custom-link bg-transparent focus:ring-0" className="w-fit custom-link bg-transparent focus:ring-0" onClick={(e: any) => {
                    setShowPanel(false);
                }}>
                    <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H8C6.34315 1 5 2.34315 5 4V5H4C2.34315 5 1 6.34315 1 8V20C1 21.6569 2.34315 23 4 23H16C17.6569 23 19 21.6569 19 20V19H20C21.6569 19 23 17.6569 23 16V4ZM19 17H20C20.5523 17 21 16.5523 21 16V4C21 3.44772 20.5523 3 20 3H8C7.44772 3 7 3.44772 7 4V5H16C17.6569 5 19 6.34315 19 8V17ZM16 7C16.5523 7 17 7.44772 17 8V20C17 20.5523 16.5523 21 16 21H4C3.44772 21 3 20.5523 3 20V8C3 7.44772 3.44772 7 4 7H16Z" fill="#ffffff"></path> </g></svg>
                </Button>
            );
        };
        if (mode == "report") {
            return (
                <>
                    <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
                        <span className="text-white text-md">
                            Panel Laporan Kecelakaan
                        </span>
                        <MinBttn />
                    </div>
                    <ReportPanelComponent markerRef={markerRef} />
                </>
            );
        }
        return (
            <>
                <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
                    <span className="text-white text-md">
                        Panel Tampilan Data
                    </span>
                    <MinBttn />
                </div>
                <ViewPanelComponent filters={filters} year={year} selectYear={selectYear} selectN={selectN} />
            </>
        );
    }

    const MapLayersComponent = ({ mode }: { mode: string }) => {
        const map = useMap();
        if (mode == "report") {
            return (
                <MarkerOnClick />
            );
        }
        return (
            <>
                {geolocs?.map((item: Geolocs, idx) => {
                    const bbox = require('geojson-bbox');
                    const extent = bbox(item.geojs);
                    const geodata_focus = (item.geodatas != undefined ? (item.geodatas.map((geodata_item) => {
                        return (
                            <Marker
                                icon={
                                    new L.Icon({
                                        iconUrl: MarkerIcon.src,
                                        iconRetinaUrl: MarkerIcon.src,
                                        iconSize: [25, 41],
                                        iconAnchor: [12.5, 41],
                                        popupAnchor: [0, -41],
                                        // shadowUrl: MarkerShadow.src,
                                        // shadowSize: [41, 41],
                                    })
                                }
                                position={[geodata_item.latitude, geodata_item.longitude]}
                            >
                                <Popup>
                                    {geodata_item.name} <br />
                                    {new Date(geodata_item.datetime_crash).toUTCString()}<br />
                                    {geodata_item.jumlah_kecelakaan} kecelakaan
                                </Popup>
                            </Marker>
                        )
                    })) : (null));
                    const georeport_focus = (item.reports != undefined ? (item.reports.map((report_item) => {
                        return (
                            <Marker
                                icon={
                                    new L.Icon({
                                        iconUrl: MarkerIcon.src,
                                        iconRetinaUrl: MarkerIcon.src,
                                        iconSize: [25, 41],
                                        iconAnchor: [12.5, 41],
                                        popupAnchor: [0, -41],
                                        // shadowUrl: MarkerShadow.src,
                                        // shadowSize: [41, 41],
                                    })
                                }
                                position={[report_item.latitude, report_item.longitude]}
                            >
                                <Popup>
                                    {report_item.name} <br />
                                    {new Date(report_item.datetime_crash).toUTCString()}<br />
                                    1 laporan
                                </Popup>
                            </Marker>
                        )
                    })) : (null));
                    return (
                        <div key={idx}>
                            <GeoJSON
                                key={JSON.stringify(item)}
                                data={item.geojs}
                                pathOptions={{
                                    fillColor: item.color ?? "#2563eb",
                                    fillOpacity: item.fillOpacity ?? 0.5,
                                    weight: 1,
                                    opacity: 1,
                                    color: "black"
                                }}
                            >
                                <Popup
                                >
                                    <div className="max-w-[180px]">
                                        {item.name2}<br />
                                        <ul className="list-disc list-inside">
                                            <li className="truncate">
                                                {item.agregate[0]?._sum.jumlah_kecelakaan ? (item.agregate[0]?._sum.jumlah_kecelakaan + " kecelakaan") :
                                                    ("tidak ada data kecelakaan")}
                                            </li>
                                            {item._count.georeports > 0 ? (
                                                <li className="truncate">
                                                    {item._count.georeports + " laporan belum diproses"}
                                                </li>
                                            ) : (null)}
                                        </ul>
                                        <div className="w-full mt-1">
                                            <Button type="submit" color="bg-black text-white hover:bg-opacity-80" className="mx-auto bg-black text-white hover:bg-opacity-80" size="xs"
                                                onClick={async () => {
                                                    if (item.color == focusedGeolocStyle.color) {
                                                        const new_geolocs = geolocs.map((filter_item) => {
                                                            if (filter_item.id == focusedGeolocs?.id) {
                                                                return {
                                                                    ...focusedGeolocs
                                                                }
                                                            }
                                                            return filter_item
                                                        });
                                                        setFocusedGeolocs(undefined);
                                                        setGeolocs(new_geolocs);
                                                        map.setView(defaultMapOptions.center, defaultMapOptions.zoom)
                                                        return;
                                                    }
                                                    setLoading(true);
                                                    map.fitBounds([
                                                        [extent[1], extent[0]],
                                                        [extent[3], extent[2]]
                                                    ]);
                                                    const res = await fetch('/api/geoloc/child?' + new URLSearchParams({
                                                        year: year.selected.toString(),
                                                        take: "30",
                                                        page: "1",
                                                        geoloc_id: item.id,
                                                    }), {
                                                        method: "GET",
                                                    }).then(async (res) => {
                                                        const { data: { geodatas: geodata_data, reports: report_data } }: { data: { geodatas: GeoDatas[], reports: ReportsData[] } } = await res.json()
                                                        const new_geolocs = geolocs.map((filter_item) => {
                                                            if (filter_item.id == item.id) {
                                                                setFocusedGeolocs(filter_item);
                                                                return {
                                                                    ...filter_item,
                                                                    color: focusedGeolocStyle.color,
                                                                    fillOpacity: focusedGeolocStyle.fillOpacity,
                                                                    geodatas: geodata_data,
                                                                    reports: report_data
                                                                }
                                                            }
                                                            if (filter_item.id == focusedGeolocs?.id) {
                                                                return {
                                                                    ...focusedGeolocs
                                                                }
                                                            }
                                                            return filter_item
                                                        });
                                                        setGeolocs(new_geolocs);
                                                        setTimeout(() => setLoading(false), 500);
                                                    }
                                                    )
                                                }}>
                                                {item.color == focusedGeolocStyle.color ? ("Kembali") : ("Lihat Detail")}
                                            </Button>
                                        </div>
                                    </div>
                                </Popup>
                            </GeoJSON>
                            <MarkerClusterGroup chunkedLoading>
                                {geodata_focus}
                                {georeport_focus}
                            </MarkerClusterGroup>
                        </div>
                    )
                })}
            </>
        );
    }

    return (
        <div className="relative flex flex-col items-center h-full">
            {loading ? (<Loader />) : (null)}
            <MapContainer
                center={defaultMapOptions.center}
                zoom={defaultMapOptions.zoom}
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
                <MapLayersComponent mode={filters.mode} />
            </MapContainer>
            {showPanel ? (
                <div className="fixed right-auto sm:right-[2vw] top-[25vh] z-1200 flex flex-col items-center max-w-1/2 w-[300px] sm:w-[400px] h-[350px] sm:h-[400px] bg-gray-100 shadow-lg rounded text-black ">
                    <div className="h-full w-full grid grid-cols-1 content-start">
                        <MapPanel mode={filters.mode} />
                    </div>
                </div>
            ) : (null)}
            <div className="fixed bottom-2 z-1200 flex flex-col items-center max-w-1/2 w-fit h-[30px] bg-gray-700 shadow-lg rounded text-black">
                <div className="w-full h-full grid grid-cols-2 text-white">
                    <div className="w-[70px] h-full flex flex-col items-center relative justify-self-center">
                        <Tooltip content="Tampilan Data" theme={{ target: "absolute w-[50px] h-[50px] flex flex-col items-center bg-sky-400 rounded-full shadow-md " + ((filters.mode == "view" && showPanel) ? "bottom-4" : "bottom-3"), base: "absolute inline-block whitespace-nowrap z-10 rounded-lg py-2 px-3 text-sm font-medium shadow-sm" }}>
                            <button className="w-full h-full flex flex-col items-center" onClick={() => {
                                if (filters.mode != "view") {
                                    if (markerRef) {
                                        markerRef.remove();
                                    }
                                    setMarkerRef(undefined);
                                    setFilters({ ...filters, n: 0, mode: "view", toggle: !filters.toggle });
                                    window.history.replaceState("", "", "/map?mode=view");
                                    setShowPanel(true);
                                    return;
                                }
                                setShowPanel(!showPanel);
                            }}>
                                <svg width="25px" height="25px" className="h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    </g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                                    </g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.25 7.70031C5.25 4.10215 8.30876 1.25 12 1.25C15.608 1.25 18.6116 3.97488 18.7454 7.45788L19.2231 7.61714C19.6863 7.77148 20.0922 7.90676 20.4142 8.05657C20.7623 8.21853 21.0814 8.42714 21.3253 8.76554C21.5692 9.10394 21.6662 9.47259 21.7098 9.85407C21.7501 10.207 21.75 10.6348 21.75 11.123V16.8712C21.75 17.4806 21.7501 18.0005 21.7028 18.4176C21.653 18.8563 21.5418 19.2875 21.2404 19.6553C21.0674 19.8665 20.8573 20.0445 20.6205 20.1805C20.2081 20.4173 19.7645 20.4561 19.3236 20.433C18.9044 20.4111 18.3915 20.3256 17.7904 20.2254L17.7488 20.2185C16.456 20.003 15.9351 19.9216 15.4274 19.9641C15.2417 19.9796 15.0571 20.0074 14.875 20.0471C14.3774 20.1558 13.8988 20.3891 12.716 20.9805C12.6749 21.0011 12.6342 21.0214 12.594 21.0415C11.2114 21.7331 10.3595 22.1592 9.44031 22.2923C9.16384 22.3323 8.88482 22.3522 8.60546 22.3516C7.67668 22.3499 6.77995 22.0508 5.32536 21.5657C5.28328 21.5517 5.24074 21.5375 5.19772 21.5231L4.81415 21.3953L4.77684 21.3828C4.31373 21.2285 3.90783 21.0932 3.5858 20.9434C3.23766 20.7815 2.91861 20.5729 2.67471 20.2345C2.4308 19.8961 2.33379 19.5274 2.29024 19.1459C2.24995 18.793 2.24997 18.3652 2.25 17.877L2.25 12.8572C2.24997 12.0711 2.24994 11.4085 2.31729 10.8895C2.38759 10.3478 2.54652 9.81811 2.98262 9.4198C3.11082 9.30271 3.25213 9.20085 3.40375 9.11626C3.91953 8.8285 4.47226 8.84521 5.00841 8.94983C5.11717 8.97105 5.23109 8.99718 5.35019 9.02754C5.28411 8.5817 5.25 8.13723 5.25 7.70031ZM5.74869 10.7093C5.32072 10.5713 4.99224 10.475 4.72113 10.4221C4.32599 10.345 4.19646 10.3917 4.13459 10.4262C4.08405 10.4544 4.03694 10.4883 3.99421 10.5274C3.9419 10.5751 3.85663 10.6833 3.80482 11.0825C3.75151 11.4933 3.75 12.0575 3.75 12.908V17.8377C3.75 18.3768 3.75114 18.7181 3.78055 18.9758C3.80779 19.2143 3.85234 19.303 3.89157 19.3574C3.9308 19.4118 4.00083 19.4821 4.21849 19.5834C4.45364 19.6928 4.77709 19.8018 5.28849 19.9723L5.67205 20.1001C7.29563 20.6413 7.95089 20.8504 8.6083 20.8516C8.81478 20.852 9.02101 20.8374 9.22537 20.8078C9.87582 20.7136 10.5009 20.411 12.0452 19.6389C12.0765 19.6232 12.1074 19.6078 12.138 19.5925C13.1987 19.062 13.852 18.7352 14.555 18.5817C14.8014 18.5279 15.051 18.4903 15.3023 18.4693C16.0193 18.4093 16.7344 18.5286 17.8945 18.7221C17.9278 18.7276 17.9614 18.7332 17.9954 18.7389C18.6497 18.8479 19.0779 18.9181 19.4019 18.9351C19.7138 18.9514 19.821 18.9098 19.8735 18.8797C19.9524 18.8344 20.0225 18.775 20.0801 18.7046C20.1185 18.6578 20.1771 18.5589 20.2123 18.2486C20.2489 17.9262 20.25 17.4923 20.25 16.829V11.1623C20.25 10.6232 20.2489 10.2819 20.2195 10.0242C20.1922 9.7857 20.1477 9.69704 20.1084 9.64261C20.0692 9.58818 19.9992 9.51787 19.7815 9.41661C19.5464 9.30722 19.2229 9.19821 18.7115 9.02774L18.6527 9.00813C18.4625 10.3095 17.9996 11.6233 17.3173 12.7959C16.4048 14.364 15.0697 15.7299 13.3971 16.4595C12.5094 16.8468 11.4906 16.8468 10.6029 16.4595C8.93027 15.7299 7.59519 14.364 6.68273 12.7959C6.29871 12.136 5.9842 11.4313 5.74869 10.7093ZM12 2.75C9.06383 2.75 6.75 5.00208 6.75 7.70031C6.75 9.11775 7.18744 10.6808 7.97922 12.0415C8.77121 13.4026 9.88753 14.5109 11.2027 15.0847C11.708 15.3051 12.292 15.3051 12.7973 15.0847C14.1125 14.5109 15.2288 13.4026 16.0208 12.0415C16.8126 10.6808 17.25 9.11775 17.25 7.70031C17.25 5.00208 14.9362 2.75 12 2.75ZM12 6.75C11.3096 6.75 10.75 7.30964 10.75 8C10.75 8.69036 11.3096 9.25 12 9.25C12.6904 9.25 13.25 8.69036 13.25 8C13.25 7.30964 12.6904 6.75 12 6.75ZM9.25 8C9.25 6.48122 10.4812 5.25 12 5.25C13.5188 5.25 14.75 6.48122 14.75 8C14.75 9.51878 13.5188 10.75 12 10.75C10.4812 10.75 9.25 9.51878 9.25 8Z" fill="#ffffff">
                                        </path>
                                    </g>
                                </svg>
                            </button>
                        </Tooltip>
                        <span className={"absolute bottom-0 font-black " + ((filters.mode == "view" && showPanel) ? "" : "hidden")}>.</span>
                    </div>
                    <div className="w-full h-full flex flex-col items-center relative justify-self-center">
                        <Tooltip content="Pelaporan Data" theme={{ target: "absolute w-[50px] h-[50px] flex flex-col items-center bg-green-400 rounded-full shadow-md " + ((filters.mode == "report" && showPanel) ? "bottom-4" : "bottom-3"), base: "absolute inline-block whitespace-nowrap z-10 rounded-lg py-2 px-3 text-sm font-medium shadow-sm" }}>
                            <button className="w-full h-full flex flex-col items-center" onClick={() => {
                                if (filters.mode != "report") {
                                    setFilters({ ...filters, mode: "report" });
                                    setGeolocs([]);
                                    window.history.replaceState("", "", "/map?mode=report");
                                    setShowPanel(true);
                                    return;
                                }
                                setShowPanel(!showPanel);
                            }}>
                                <svg width="18px" height="18px" className="h-full" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    </g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                                    </g>
                                    <g id="SVGRepo_iconCarrier">
                                        <title>report_flag [#ffffff]
                                        </title>
                                        <desc>Created with Sketch.
                                        </desc>
                                        <defs>
                                        </defs>
                                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -600.000000)" fill="#ffffff">
                                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                                    <path d="M381.9,440 L369.3,440 C368.13975,440 367.2,440.895 367.2,442 L367.2,450 C367.2,451.105 368.13975,452 369.3,452 L381.9,452 C383.06025,452 384,451.105 384,450 L384,442 C384,440.895 383.06025,440 381.9,440 M365.1,441 L365.1,459 C365.1,459.552 364.6296,460 364.05,460 C363.4704,460 363,459.552 363,459 L363,441 C363,440.448 363.4704,440 364.05,440 C364.6296,440 365.1,440.448 365.1,441" id="report_flag-[#ffffff]"> </path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        </Tooltip>
                        <span className={"absolute bottom-0 font-black " + ((filters.mode == "report" && showPanel) ? "" : "hidden")}>.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
