'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const RootSessionComponent = () => {
    const { data: session, status } = useSession();
    const [checkSession, changeCheckSession] = useState(false);
    useEffect(() => {
        if (checkSession) {
            window.location.reload()
        }
        setTimeout(() => changeCheckSession(true), 1000);
    }, [status]);

    return null;
}

export default RootSessionComponent;