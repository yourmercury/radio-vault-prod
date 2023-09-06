import { ResponseCodes } from "@/utils/responseCodes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { ServerSession } from "@/utils/sessionHandler";
import Iron from "@hapi/iron";

export const GET = async(request: NextRequest)=>{
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }

        const session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);
        const year = String(new Date().getFullYear())
        const user = await prisma.user.findUnique({where: {email: session.magicMetadata.email as string}});

        if(!user) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND, statusText: "No user found" });
        }
        const vault = await prisma.vault.findUnique({where: {id: user.id}});
        if(!vault) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND, statusText: "No vault found" });
        }

        
        const uys = await prisma.user_yearly_stream.findFirst({where: {year: year, userId: user.id}});
        
        const payload: {user: any, vault: any, uys: any} = {
            user,
            vault,
            uys
        }
        
        return new NextResponse(JSON.stringify(payload), { status: ResponseCodes.OK});

    }catch(error){
        console.error(error);
        return new NextResponse(null, {status: ResponseCodes.INTERNAL_SERVER_ERROR})
    }
}