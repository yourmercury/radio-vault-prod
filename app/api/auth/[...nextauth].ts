import UserModel from '@/models/userModel';
import { Magic } from '@magic-sdk/admin';
import NextAuth from 'next-auth/next';
import CredentialProviders from "next-auth/providers/credentials";

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

const handler = NextAuth({
    providers: [
        CredentialProviders({
            name: "Magic Link",

            credentials: {
                email: { label: "Email address", type: "text" },
                didToken: { label: "DID Token", type: "text" },
            },

            authorize: async (credentials, req) => {
                console.log("authorize was called ")
                try {
                    let user = await UserModel.findOne({ email: credentials?.email })
                    let metadata = await magic.users.getMetadataByToken(credentials?.didToken as string)
                    if (user && metadata.email == credentials?.email) {
                        return user;
                    } else { return null }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
        })
    ],

    debug: process.env.NODE_ENV == "development"
})

export {handler as GET, handler as POST};