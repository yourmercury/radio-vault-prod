import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { parse } from "cookie";
import { ServerSession } from "@/utils/sessionHandler";
import { ResponseCodes } from "@/utils/responseCodes";
import { Magic } from "@magic-sdk/admin";
import { prisma } from "@/prisma/prisma";

export const POST = async (request: NextRequest)=>{
    try {
        const {token} = await request.json();

        if(!token){
            return new NextResponse(null, {status: ResponseCodes.UNAUTHORIZED});
        }
    
        let session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);
    
        console.log(session, Date.now());

        if(Math.floor(Date.now()/1000) > session.maxAge + session.createdAt){
            return new NextResponse(null, {status: ResponseCodes.UNAUTHORIZED});
        }

        let user = await prisma.user.findUnique({ where: { email: session.magicMetadata.email as string } });

        const magic = new Magic(process.env.MAGIC_SK);
        //If the user is not registered or deleted, Make sure they cannot get here again
        if (!user) {
            await magic.users.logoutByToken(session.didToken);
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "User does not exist" });
        }

    
        return new Response(null, {status: ResponseCodes.ACCEPTED});
    }catch(error){
        return new Response(null, {status: ResponseCodes.INTERNAL_SERVER_ERROR});
    }
}