import { ResponseCodes } from "@/utils/responseCodes";
import { ServerSession } from "@/utils/sessionHandler";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { prisma } from "@/prisma/prisma";
import { Magic } from "@magic-sdk/admin";

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;
        let { service, status }: { service: string, status: boolean } = await request.json();

        if (!(service.includes("https://") || service.includes("http://"))) {
            service = "https://" + service;
        }

        
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }
        let session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);
        let email = session.magicMetadata.email;

        let user = await prisma.user.findUnique({ where: { email: email as string } });

        //If the user is not registered or deleted, Make sure they cannot get here again
        if (!user) {
            const magic = new Magic(process.env.MAGIC_SK);
            await magic.users.logoutByToken(session.didToken);
            cookies().delete(process.env.AUTH_TOKEN_NAME as string);
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "User does not exist" });
        }

        let data;
        let wh = await prisma.whitelist.findFirst({ where: { userId: user.id, service } });
        if (wh) {
            await prisma.whitelist.updateMany({ where: { userId: user.id, service }, data: { status } });
        } else {
            await prisma.whitelist.create({ data: { service, status, userId: user.id } });
        }

        data = await prisma.whitelist.findMany({ where: { userId: user.id } });


        return new NextResponse(JSON.stringify(data), { status: ResponseCodes.CREATED });
    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}




export const GET = async (request: NextRequest) => {
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;


        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }
        let session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);
        let email = session.magicMetadata.email;

        let user = await prisma.user.findUnique({ where: { email: email as string } });

        //If the user is not registered or deleted, Make sure they cannot get here again
        if (!user) {
            const magic = new Magic(process.env.MAGIC_SK);
            await magic.users.logoutByToken(session.didToken);
            cookies().delete(process.env.AUTH_TOKEN_NAME as string);
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "User does not exist" });
        }


        let data = await prisma.whitelist.findMany({ where: { userId: user.id } });

        return new NextResponse(JSON.stringify(data), { status: ResponseCodes.OK });
    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}