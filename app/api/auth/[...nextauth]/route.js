import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signIn } from "next-auth/react";


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
        name:"Strapi",
        credentials:{
            email:{label:"Email", type:"email"},
            password:{label:"Password", type:"password"}
        },
        async authorize(credentials){
            const res=await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI}/api/auth/local`,
                {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        identifier:credentials.email,
                        password:credentials.password
                    })
                }
            );

            const data=await res.json();

            if(!res.ok || data.jwt){
                throw new Error(data.error?.message || "Login Failed")
            }

            return {
                id:data.user.id,
                name: data.user.username,
                email:data.user.email,
                jwt:data.jwt
            };
        }
    })
    // ...add more providers here
  ],
  callbacks:{
    async jwt({token, user}){
        if(user){
            token.jwt=user.jwt;
            token.id=user.id
        }
        return token;
    },
    async session({session, token}){
        session.user.id=token.id;
        session.jwt=token.jwt;
        return session;
    },
  },
  pages:{
    signIn:"/login"
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
}
const handler=NextAuth(authOptions);
export { handler as GET,  handler as POST} ;