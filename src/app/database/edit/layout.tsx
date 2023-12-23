import { Suspense } from "react";
import Loading from "./loading";

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <Suspense fallback={<Loading />}>
                {children}
            </Suspense>
        </>
    )
}

export default DashboardLayout;