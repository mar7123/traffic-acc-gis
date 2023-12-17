import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import LoginForm from "@/components/Login/LoginForm";

export const metadata: Metadata = {
    title: "Signin Page",
    description: "This is Signin page",
    // other metadata
};

const SignIn: React.FC = async () => {
    const data = await getServerSession();
    if (data) {
        redirect("/")
    }
    return (
        <div className="min-h-screen w-full flex items-center lg:px-[15vw] sm:px-[7vw] py-40 bg-gray-100">
            <LoginForm />
        </div>
    );
};

export default SignIn;
