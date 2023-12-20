import { signIn } from "next-auth/react";

export async function LoginAction(prevState: any, formData: FormData) {
    try {
        const status = await signIn("credentialsAuth", {
            redirect: true,
            email: formData.get("email"),
            password: formData.get("password"),
            // callbackUrl: "/login"
        });
        return { message: "Success" };
    } catch (e) {
        return { messasge: "Login failed" };
    }
}