import { getServerSession } from "next-auth/next"
import { permanentRedirect } from "next/navigation";

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const data = await getServerSession();
    if (!data) {
        permanentRedirect("/")
    }
    return (
        <>
            {children}
        </>
    )
}

export default DashboardLayout;