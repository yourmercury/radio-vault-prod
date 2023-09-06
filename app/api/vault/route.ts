import { ResponseCodes } from "@/utils/responseCodes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { ServerSession } from "@/utils/sessionHandler";
import { prisma } from "@/prisma/prisma";
import { Magic } from "@magic-sdk/admin";
import { orderByTypes } from "@/types";


export const POST = async (request: NextRequest) => {
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }

        const data: {
            storageURL: string;
            title: string;
            description: string;
            metadata: any;
        } = await request.json();

        if (!(data.title && data.description && data.storageURL && data.metadata)) {
            return new NextResponse(null, { status: ResponseCodes.BAD_REQUEST, statusText: "Incomplete post body" });
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

        const vault = await prisma.vault.create({
            data: {
                ...data,
                streams: 0,
                shares: 0,
                controller: user.id,
            }
        })

        return new NextResponse(JSON.stringify(vault), { status: ResponseCodes.CREATED });

    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR })
    }
}


export const GET = async (request: NextRequest) => {
    try {
        let skip = Number(request.nextUrl.searchParams.get("skip")) || 0;
        let take = Number(request.nextUrl.searchParams.get("take")) || 20;
        take = take > 20 ? 20 : take;


        let ordering = request.nextUrl.searchParams.get("orderBy");

        let orders = [...orderByTypes];
        let order: string;
        let orderBy: string;
        if(!(ordering?.includes("_") && (ordering.endsWith("_desc") || ordering.endsWith("_asc")) && orders.includes(ordering.split("_")[0]))){
            orderBy = orders[0];
            order = "desc";
        }else {
            orderBy = ordering.split("_")[0];
            order = ordering.split("_")[1];
        }

        // return new Response(JSON.stringify(query));

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

        let vaults = await prisma.vault.findMany({
            where: {
                controller: user.id
            },
            orderBy: [
                {
                    [orderBy]: order
                }
            ],
            skip,
            take
        })

        return new NextResponse(JSON.stringify(vaults));

    } catch (error) {
        console.error(error);
    }
}