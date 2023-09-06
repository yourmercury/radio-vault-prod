import { MagicUserMetadata } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export type ServerSession = {
    magicMetadata: MagicUserMetadata;
    createdAt: number;
    maxAge: number,
    didToken: string
}

export async function setLoginSession(metadata: MagicUserMetadata, didToken: string, maxAge: number, createdAt: number){
    const session: ServerSession = {
        magicMetadata: metadata,
        didToken,
        createdAt,
        maxAge
    }

    const token = await Iron.seal(session, process.env.COOKIE_SECRET as string, Iron.defaults);

    return token;
}