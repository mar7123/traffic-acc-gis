import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { permanentRedirect } from "next/navigation";
import LoginForm from "@/components/Login/LoginForm";

export const metadata: Metadata = {
    title: "Signin Page",
    description: "This is Signin page",
    // other metadata
};

const SignIn: React.FC = async () => {
    const data = await getServerSession();
    if (data) {
        permanentRedirect("/")
    }
    return (
        <div className="min-h-screen w-full flex flex-col items-center px-[4vw] sm:px-[7vw] lg:px-[15vw] bg-gray-100">
            <LoginForm />
        </div>
    );
};

export default SignIn;
