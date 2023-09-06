import { ResponseCodes } from "@/utils/responseCodes";
import { ServerSession } from "@/utils/sessionHandler";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { prisma } from "@/prisma/prisma";
import { Magic } from "@magic-sdk/admin";

export const GET = async (request: NextRequest) => {
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.NOT_MODIFIED, statusText: "No logged user" });
        }

        let session: ServerSession = await Iron.unseal(token, process.env.COOKIE_SECRET as string, Iron.defaults);

        const magic = new Magic(process.env.MAGIC_SK);
        await magic.users.logoutByToken(session.didToken);
        cookies().delete(process.env.AUTH_TOKEN_NAME as string);
        return new NextResponse(null, { status: ResponseCodes.OK, statusText: "User logged out" });

    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR })
    }
}