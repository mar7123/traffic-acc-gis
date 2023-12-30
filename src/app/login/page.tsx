import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { permanentRedirect } from "next/navigation";
import LoginForm from "@/components/Login/LoginForm";

export const metadata: Metadata = {
    title: "Login Page | TRASK",
    description: "TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan",
    // other metadata
};

const SignIn: React.FC = async () => {
    const data = await getServerSession();
    if (data) {
        permanentRedirect("/")
    }
    return (
        <div className="flex items-center min-h-screen h-fit w-full bg-gray-100">
            <div className="flex flex-col items-center max-w-screen-2xl mx-auto h-full w-full px-[2vw] sm:px-[5vw] lg:px-[8vw] py-5 sm:py-10 lg:py-15">
                <LoginForm />
            </div>
        </div>
    );
};

export default SignIn;
