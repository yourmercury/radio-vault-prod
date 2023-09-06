import { ResponseCodes } from "@/utils/responseCodes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { ServerSession } from "@/utils/sessionHandler";
import Iron from "@hapi/iron";
import { Vault } from "@prisma/client";

export const GET = async(request: NextRequest)=>{
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;

        console.log(token);
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }

        const session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);
        const year = String(new Date().getFullYear())
        const user = await prisma.user.findUnique({where: {email: session.magicMetadata.email as string}});
        if(!user) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND, statusText: "No user found" });
        }

        
        const uys = await prisma.user_yearly_stream.findFirst({where: {year, userId: user.id}});
        const vaults = await prisma.vault.findMany({where: {controller: user.id}, orderBy: {streams: "desc"}, take: 10});

        const payload: {user: any, uys: any, vaults: any} = {
            user,
            uys,
            vaults
        }

        return new NextResponse(JSON.stringify(payload), { status: ResponseCodes.OK});

    }catch(error){
        console.error(error);
        return new NextResponse(null, {status: ResponseCodes.INTERNAL_SERVER_ERROR})
    }
}