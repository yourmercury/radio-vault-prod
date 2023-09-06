import { ResponseCodes } from "@/utils/responseCodes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { ServerSession } from "@/utils/sessionHandler";
import { prisma } from "@/prisma/prisma";
import { Magic } from "@magic-sdk/admin";
import { Deployed, orderByTypes } from "@/types";


export const POST = async (request: NextRequest) => {
    try {
        const token = cookies().get(process.env.AUTH_TOKEN_NAME as string)?.value;
        if (!token) {
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED, statusText: "No logged user" });
        }

        const data: Deployed = await request.json();

        if (!(data.contractAddress && data.txHash && data.vaultId)) {
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

        let deployed = await prisma.$transaction([
            prisma.deployed.create({
                data: {
                    ...data,
                    controller: user.id,
                }
            }),
            prisma.vault.update({where: {id: data.vaultId}, data: {deploymentCount: {increment: 1}}})
        ]);

        return new NextResponse(JSON.stringify(deployed[1]), { status: ResponseCodes.CREATED });

    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR })
    }
}


