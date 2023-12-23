'use client'

import { useState } from "react";
import Sidebar from "@/components/Navbar/Sidebar";
import Header from "@/components/Navbar/Header";
import { Session } from "next-auth";


const AdminNavbarComponent = ({ children, server_session }: { children: React.ReactNode, server_session: Session }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    session={server_session}
                />
                {children}
            </div>
        </>
    )
};

export default AdminNavbarComponent;
