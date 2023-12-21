import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/lib/prisma/users";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

async function auth(req: NextRequest, res: any) {
    // Do whatever you want here, before the request is passed down to `NextAuth`
    const providers = [
        CredentialsProvider({
            id: "credentialsAuth",
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                try {
                    const { password, email } = credentials as Record<"email" | "password", string>;
                    // check user existance
                    const { res, error } = await getUserByEmail(email);
                    if (error) {
                        throw new Error("Request cannot be processed");
                    }
                    if (!res) {
                        throw new Error("No user Found with Email Please Sign Up...!");
                    }
                    const checkPassword = await bcrypt.compare(password, res.password);
                    if (!checkPassword || res.email !== email) {
                        throw new Error("Email or Password doesn't match");
                    }
                    return res;
                } catch (error: any) {
                    throw new Error(error.message);
                }
                return null;
                // const res = await fetch("/your/endpoint", {
                //     method: 'POST',
                //     body: JSON.stringify(credentials),
                //     headers: { "Content-Type": "application/json" }
                // })
                // const user = await res.json()

                // // If no error and we have user data, return it
                // if (res.ok && user) {
                //     return user
                // }
                // // Return null if user data could not be retrieved
                // return null
            }
        }),
    ];
    return await NextAuth(req, res, {
        adapter: PrismaAdapter(prisma),
        providers: providers,
        session: {
            strategy: "jwt",
            maxAge: 60 * 30,
        },
        pages: {
            signIn: '/login',
            // signOut: '/auth/signout',
            error: '/login', // Error code passed in query string as ?error=
            verifyRequest: '/auth/verify-request', // (used for check email message)
            // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
        }
    });
}
export { auth as GET, auth as POST }