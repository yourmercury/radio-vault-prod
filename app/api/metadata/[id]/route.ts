import { metadata } from "@/app/layout";
import { prisma } from "@/prisma/prisma";
import { ResponseCodes } from "@/utils/responseCodes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params: { id } }: { params: { id: string } })=>{
    try {

        const vault = await prisma.vault.findUnique({where: {id}});
        if(vault){
            return new NextResponse(JSON.stringify({...vault.metadata as object, streams: vault.streams}), {status: ResponseCodes.OK});
        }else {
            return new NextResponse(null, {status: ResponseCodes.NOT_FOUND});
        }

    }catch(error){
        console.error(error);
        return new NextResponse(null, {
            status: ResponseCodes.INTERNAL_SERVER_ERROR,
          });
    }
}