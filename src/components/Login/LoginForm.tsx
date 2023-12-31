"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Label, TextInput } from 'flowbite-react';
import { useFormState } from "react-dom";
import { LoginAction } from "./LoginAction";
import ModalComponent from "@/components/Modal/ModalComponent";

const initialState = {
    message: null,
}

function LoginForm() {
    const [state, loginFormAction] = useFormState(LoginAction, initialState);
    const [disableLogin, setDisableLogin] = useState(false);
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
        if (state.message == null) {
            return
        }
        setDisableLogin(false);
        setOptModal({ open: true, status: state.message == "success" ? "success" : "error", message: state.message });
    }, [state])
    useEffect(() => {
        if (optModal.open) {
            setTimeout(() => { setOptModal({ ...optModal, open: false }) }, 1500)
        }
    }, [optModal])

    return (
        <>
            <ModalComponent optModal={optModal} setModal={setModal} />
            <div className="h-fit w-full max-h-fit max-w-screen-2xl py-5 sm:py-10 my-auto mx-autorounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full content-center">
                    <div className="hidden w-full lg:flex lg:flex-col lg:items-center justify-self-center sm:py-5 lg:py-15 sm:px-[5%] lg:px-[10%]">
                        <Link className="inline-block m-auto" href="/">
                            <svg className="h-[200px] w-[200px] xl:h-[300px] xl:w-[300px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="1.08"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M17.861 3.16338C17.9137 3.18096 17.967 3.19877 18.0211 3.2168L19.2231 3.61748C19.6863 3.77182 20.0922 3.9071 20.4142 4.05691C20.7623 4.21887 21.0814 4.42748 21.3253 4.76588C21.5692 5.10428 21.6662 5.47292 21.7098 5.85441C21.7501 6.20729 21.75 6.63515 21.75 7.12331V15.3359C21.75 16.0343 21.75 16.6234 21.6959 17.089C21.6397 17.5728 21.5136 18.0511 21.161 18.4369C20.9519 18.6658 20.6978 18.8489 20.4146 18.9749C19.9371 19.1874 19.4435 19.1557 18.9667 19.0561C18.5078 18.9602 17.949 18.7739 17.2865 18.5531L17.2438 18.5388C16.1233 18.1653 15.7393 18.049 15.3665 18.0617C15.218 18.0668 15.0703 18.0865 14.9257 18.1207C14.5627 18.2065 14.2229 18.4198 13.2401 19.075L11.8577 19.9966C11.8103 20.0282 11.7635 20.0594 11.7173 20.0903C10.6558 20.7988 9.91754 21.2915 9.05448 21.4071C8.19141 21.5227 7.3495 21.2416 6.13896 20.8373C6.08632 20.8197 6.03298 20.8019 5.97892 20.7839L4.77683 20.3832C4.31373 20.2288 3.90783 20.0936 3.5858 19.9438C3.23766 19.7818 2.91861 19.5732 2.67471 19.2348C2.4308 18.8964 2.33379 18.5278 2.29024 18.1463C2.24995 17.7934 2.24997 17.3655 2.25 16.8774L2.25 8.66478C2.24998 7.96634 2.24996 7.37729 2.3041 6.91163C2.36035 6.42784 2.48645 5.94957 2.83896 5.56377C3.04807 5.33491 3.30221 5.15174 3.58544 5.02573C4.06293 4.81331 4.55653 4.84493 5.03328 4.94455C5.49217 5.04044 6.05097 5.22673 6.71356 5.44762L6.75619 5.46183C7.87675 5.83535 8.26073 5.95172 8.63351 5.93899C8.78204 5.93392 8.9297 5.91415 9.07432 5.87996C9.43731 5.79415 9.77714 5.58086 10.7599 4.92565L12.1423 4.00407C12.1897 3.97246 12.2365 3.94124 12.2827 3.91043C13.3442 3.2019 14.0825 2.70913 14.9455 2.59355C15.8086 2.47797 16.6505 2.75913 17.861 3.16338ZM15.75 4.10577V16.5796C16.2857 16.6377 16.8498 16.826 17.5931 17.0741C17.6342 17.0878 17.6759 17.1017 17.7182 17.1158C18.4348 17.3547 18.9103 17.5119 19.2735 17.5878C19.6287 17.6621 19.7505 17.6286 19.8049 17.6044C19.8993 17.5624 19.984 17.5014 20.0537 17.4251C20.0938 17.3812 20.164 17.2762 20.2059 16.9158C20.2488 16.5472 20.25 16.0464 20.25 15.291V7.16261C20.25 6.62355 20.2489 6.28223 20.2195 6.02455C20.1922 5.78604 20.1477 5.69737 20.1084 5.64294C20.0692 5.58851 19.9992 5.51821 19.7815 5.41695C19.5464 5.30755 19.2229 5.19854 18.7115 5.02808L17.5467 4.63982C16.6604 4.34437 16.1345 4.17626 15.75 4.10577ZM14.25 16.7599V4.43371C13.9388 4.61353 13.5397 4.87528 12.9744 5.25214L11.592 6.17373C11.5549 6.19844 11.5184 6.22284 11.4823 6.24691C10.794 6.70619 10.281 7.04856 9.75 7.24073V19.567C10.0612 19.3871 10.4603 19.1254 11.0256 18.7485L12.408 17.8269C12.4451 17.8022 12.4816 17.7778 12.5177 17.7538C13.206 17.2945 13.719 16.9521 14.25 16.7599ZM8.25 19.8949V7.42108C7.71431 7.36301 7.15021 7.17471 6.40693 6.92659C6.36579 6.91286 6.32411 6.89894 6.28185 6.88485C5.5652 6.64597 5.08969 6.48874 4.72647 6.41284C4.37129 6.33862 4.2495 6.37205 4.19515 6.39623C4.10074 6.43823 4.01603 6.49929 3.94632 6.57557C3.9062 6.61949 3.83597 6.72446 3.79406 7.08488C3.75121 7.45346 3.75 7.9543 3.75 8.7097V16.8381C3.75 17.3771 3.75114 17.7184 3.78055 17.9761C3.80779 18.2146 3.85234 18.3033 3.89157 18.3577C3.9308 18.4122 4.00083 18.4825 4.21849 18.5837C4.45364 18.6931 4.77709 18.8021 5.28849 18.9726L6.45326 19.3609C7.33961 19.6563 7.86547 19.8244 8.25 19.8949Z" fill="#ffffff"></path> </g></svg>
                        </Link>
                    </div>
                    <div className="justify-self-center w-full py-3 xl:py-15 px-[5%] lg:px-[10%] ">
                        <div className="lg:hidden w-full flex">
                            <a href='/' className="w-fit pb-4 my-auto bg-transparent hover:text-primary">
                                <svg width="25" height="25" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                            </a>
                        </div>
                        <form className="flex w-full flex-col gap-4" action={loginFormAction} onSubmit={(e) => {
                            setDisableLogin(true);
                        }}>
                            <h2 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                Sign In to TRASK Admin<br />
                            </h2>

                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="email" value="Email" />
                                </div>
                                <TextInput id="email" name="email" type="email" placeholder="Enter your email" required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="password" value="Password" />
                                </div>
                                <TextInput id="password" name="password" type="password" placeholder="Enter your password" required shadow />
                            </div>
                            <div className="relative flex w-full h-full flex-col">
                                {disableLogin ? (
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
                                <Button id="login-bttn" className="bg-black hover:bg-opacity-80 text-white" color="bg-black hover:bg-opacity-80 text-white" type="submit" disabled={disableLogin}>
                                    <span className="my-2 font-extrabold">
                                        Sign In
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
