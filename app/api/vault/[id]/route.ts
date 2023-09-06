import { ResponseCodes } from "@/utils/responseCodes";
import { ServerSession } from "@/utils/sessionHandler";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { prisma } from "@/prisma/prisma";
import { Magic } from "@magic-sdk/admin";

export const GET = async (request: NextRequest, { params }: {params: { id: string }}) => {
    try {
        const id = params.id;
        // return new NextResponse(JSON.stringify({id}), { status: ResponseCodes.OK });

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
        
        const vault = await prisma.vault.findUnique({where: {
            id
        }})

    
        
        if(!vault) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND, statusText: "No vault found" });
        }
        
        //Only a user can access their vault
        //@ts-ignore
        if(vault.controller != user.id) {
            // console.log("----------------------------->>>>>>...................", vault.owner?.email, );
            return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED });
        }

        const vys = await prisma.vault_yearly_stream.findFirst({where: {
            vaultId: vault?.id,
            year: new Date().getFullYear().toString()
        }})

        return new NextResponse(JSON.stringify({...vault, vys}), {status: ResponseCodes.OK});
    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}