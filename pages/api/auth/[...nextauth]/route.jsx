import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"


export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        Credentials({
            name: "strapi",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add logic here to look up the user from the credentials supplied
                const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identifier: credentials.email,
                        password: credentials.password,
                    }),

                })
            }
        }),
    ],
}

export default NextAuth(authOptions)