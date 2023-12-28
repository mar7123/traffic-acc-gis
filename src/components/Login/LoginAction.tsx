import { signIn } from "next-auth/react";

export async function LoginAction(prevState: any, formData: FormData) {
    try {
        const status = await signIn("credentialsAuth", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
            // callbackUrl: "/login"
        });
        if(status?.error){
            return { message: status?.error };
        }
        return { message: "Success" };
    } catch (e) {
        return { messasge: "Login failed" };
    }
}