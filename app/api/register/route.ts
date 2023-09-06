import { ResponseCodes } from "@/utils/responseCodes";
import { NextRequest, NextResponse } from "next/server";
import { Magic, MagicUserMetadata } from "@magic-sdk/admin";
import { setLoginSession } from "@/utils/sessionHandler";
import { prisma } from "@/prisma/prisma";
import { uuid } from "uuidv4";

export const POST = async (request: NextRequest) => {
    try {
        const {firstName, lastName, didToken, email} = await request.json();

        console.log(firstName, lastName, didToken, email)
    
        if (!(didToken && firstName && lastName && email)) {
            return new NextResponse(null, { status: ResponseCodes.BAD_REQUEST, statusText: 'Incomplete credentials' });
        }

        let user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        // let user = null

        if(user) {
            return new NextResponse(null, {status: ResponseCodes.FORBIDDEN, statusText: "User already exists"});
        }

        const magic = new Magic(process.env.MAGIC_SK);
        let metadata: MagicUserMetadata;
        try {
            metadata = await magic.users.getMetadataByToken(didToken as string);
            if(!metadata?.email) throw("error");
        }catch (error) {
            console.error(error);
            return new NextResponse(null, {status: ResponseCodes.BAD_REQUEST, statusText: "Invalid DID token"})
        }

        user = await prisma.user.create({
            data: {
                email: email,
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
                signature: uuid()
            }
        });

        return new NextResponse(JSON.stringify(user), {status: ResponseCodes.CREATED});
    } catch (error) {
        console.error(error);
        return new Response(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}