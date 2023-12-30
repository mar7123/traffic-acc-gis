'use client';
import { editDataAction } from "./DatabaseFormAction";
import { useEffect, useState } from "react";
import { Button, Label, TextInput } from 'flowbite-react';
import { useFormState } from "react-dom";
import ModalComponent from "@/components/Modal/ModalComponent";
import { GeoData } from "@prisma/client";

const initialState = {
    message: null,
}

export default function EditForm({ data }: { data: GeoData }) {
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

    const setModal = ({ open, status, message }: { open: boolean, status: "success" | "error", message: string }) => {
        setOptModal({ open: open, status: status, message: message });
    }
    useEffect(() => {
        if (state.message == null || state.message == "Success") {
            return
        }
        setDisableEdit(false);
        setOptModal({ open: true, status: "error", message: state.message });
    }, [state])

    return (
        <>
            <ModalComponent optModal={optModal} setModal={setModal} />
            <div className="grid  w-full gap-9 ">
                <div className="flex flex-col w-full gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Edit Data
                            </h3>
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
                                    <Label className="text-md" htmlFor="waktu_kecelakaan" value="Waktu Kecelakaan" />
                                </div>
                                <TextInput id="waktu_kecelakaan" name="waktu_kecelakaan" type="datetime-local" placeholder="Masukan waktu kecelakaan" defaultValue={data.datetime_crash.toLocaleString('sv-SE').substring(0, 16)} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="jumlah_kecelakaan" value="Jumlah Kecelakaan" />
                                </div>
                                <TextInput id="jumlah_kecelakaan" name="jumlah_kecelakaan" type="number" placeholder="Masukan jumlah kecelakaan" defaultValue={data.jumlah_kecelakaan} onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="meninggal" value="Meninggal" />
                                </div>
                                <TextInput id="meninggal" name="meninggal" type="number" placeholder="Masukan jumlah korban meninggal" defaultValue={data.meninggal} onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="luka_berat" value="Korban Luka Berat" />
                                </div>
                                <TextInput id="luka_berat" name="luka_berat" type="number" placeholder="Masukan jumlah korban luka berat" defaultValue={data.luka_berat} onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="luka_ringan" value="Korban Luka Ringan" />
                                </div>
                                <TextInput id="luka_ringan" name="luka_ringan" type="number" placeholder="Masukan jumlah korban luka ringan" defaultValue={data.luka_ringan} onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}} required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="kerugian" value="Jumlah kerugian" />
                                </div>
                                <TextInput id="kerugian" name="kerugian" type="number" placeholder="Masukan jumlah kerugian" defaultValue={data.kerugian} onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}} required shadow />
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