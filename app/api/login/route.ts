import { ResponseCodes } from "@/utils/responseCodes";
import { NextRequest, NextResponse } from "next/server";
import { Claim, Magic, MagicUserMetadata, ParsedDIDToken } from "@magic-sdk/admin";
import { setLoginSession } from "@/utils/sessionHandler";
import { prisma } from "@/prisma/prisma";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const POST = async (request: NextRequest) => {
    try {
        const magic = new Magic(process.env.MAGIC_SK);
        const { didToken } = await request.json();
        if (!didToken) {
            return new NextResponse(null, { status: ResponseCodes.BAD_REQUEST, statusText: 'No DID token' });
        }

        let metadata: MagicUserMetadata;
        let tokenData: Claim;
        let maxAge: number;
        try {
            metadata = await magic.users.getMetadataByToken(didToken);
            [, tokenData] = magic.token.decode(didToken);
            if(tokenData.ext < Math.floor(Date.now()/1000)){
                await magic.users.logoutByToken(didToken);
                return new NextResponse(null, {status: ResponseCodes.BAD_REQUEST, statusText: "Expired DID token"});
            }
            maxAge = Number(process.env.COOKIE_MAX_AGE) * 60 * 60 * 24;
            // maxAge = tokenData.ext - tokenData.iat;
            if (!metadata?.email) throw ("error");
        } catch (error) {
            console.error(error);
            return new NextResponse(null, { status: ResponseCodes.BAD_REQUEST, statusText: "Invalid DID token" })
        }

        const email = metadata.email;

        //here use prisma to check the email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND, statusText: "No user found with email" });
        }

        let token = await setLoginSession(metadata, didToken, maxAge, tokenData.iat);

        const cookieOption: Partial<ResponseCookie> = {
            maxAge,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV == "production",
            path: '/'
        }
        cookies().set(process.env.AUTH_TOKEN_NAME as string, token, cookieOption);

        return new NextResponse(JSON.stringify(user), { status: ResponseCodes.CREATED });
    } catch (error) {
        console.error(error);
        return new Response(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}