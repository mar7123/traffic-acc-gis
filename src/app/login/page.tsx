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
        <div className="h-screen w-screen px-[7vw] grid content-center">
            <LoginForm />
        </div>
    );
};

export default SignIn;
