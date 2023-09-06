import { MagicUserMetadata } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import {CookieSerializeOptions, serialize} from "cookie";
import { ResponseCodes } from "./responseCodes";

export type ServerSession = {
    magicMetadata: MagicUserMetadata;
    createdAt: number;
    maxAge: number
}

export async function setLoginSession(metadata: MagicUserMetadata, user:any){
    const session: ServerSession = {
        magicMetadata: metadata,
        createdAt: Date.now(),
        maxAge: Number(process.env.COOKIE_MAX_AGE) * 10
    }

    const token = await Iron.seal(session, process.env.COOKIE_SECRET as string, Iron.defaults);
    
    const cookie = setCookie(token);
    // user.auth = cookie;
    // await user.save();
    const res =  new Response(JSON.stringify({metadata}), {status: ResponseCodes.CREATED})

    res.headers.set("Set-Cookie", cookie);
    return res;
}

export function setCookie(token: string) {
    const options: CookieSerializeOptions = {
        maxAge: Number(30) * 10,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return serialize("token", token, options)
}