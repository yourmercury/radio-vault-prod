import { ResponseCodes } from "@/utils/responseCodes";
import { NextRequest, NextResponse } from "next/server";
import { Claim, Magic, MagicUserMetadata, ParsedDIDToken } from "@magic-sdk/admin";
import { setLoginSession } from "@/utils/sessionHandler";
import { prisma } from "@/prisma/prisma";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const POST = async (request: NextRequest) => {
    try {
        const { email } = await request.json();

        const user = await prisma.user.findUnique({where: {email}});

        console.log(user);

        if(user) {
            return new NextResponse(JSON.stringify(user), { status: ResponseCodes.OK });
        }

        return new NextResponse(null, { status: ResponseCodes.NOT_FOUND });
    } catch (error) {
        console.error(error);
        return new Response(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}