import { ResponseCodes } from "@/utils/responseCodes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { ServerSession } from "@/utils/sessionHandler";
import Iron from "@hapi/iron";

export const POST = async(request: NextRequest)=>{
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;
        const data:{
                firstName: string,
                avatar: string,
                lastName: string,
                email: string,
                metadata: any
                stageName: string,
                dateOfBirth: string,
                role: string,
              
        } = await request.json();
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }

        const session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);
        const year = String(new Date().getFullYear())
        let user = await prisma.user.findUnique({where: {email: session.magicMetadata.email as string}});

        if(!user) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND, statusText: "No user found" });
        }
        
        user = await prisma.user.update({where: {id: user.id}, data:{...data}});
       
        
        return new NextResponse(JSON.stringify(user), { status: ResponseCodes.CREATED});

    }catch(error){
        console.error(error);
        return new NextResponse(null, {status: ResponseCodes.INTERNAL_SERVER_ERROR})
    }
}