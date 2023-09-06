import { ResponseCodes } from "@/utils/responseCodes";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { getMonth } from "@/utils/utils";


/**
 * During SDK development, remember to make some serious security protocols to avoid direct stream farming
 */

export const POST = async (request: NextRequest, { params: { id } }: { params: { id: string } }) => {
    try {
        const vault = await prisma.vault.findUnique({ where: { id } });
        if (!vault) {
            return new NextResponse(null, { status: ResponseCodes.NOT_FOUND });
        }

        const vys = await prisma.vault_yearly_stream.findFirst({where: {vaultId: vault.id, year: new Date().getFullYear().toString()}});
        const uys = await prisma.user_yearly_stream.findFirst({where: {userId: vault.id, year: new Date().getFullYear().toString()}});

        const year = (new Date()).getFullYear().toString();
        const month = getMonth((new Date()).getMonth());
        const newMonth = {
            firstStream: new Date(),
            lastStream: new Date(),
            streams: 1
        }
        const updatedMonth = {
            upsert: {
                update: {
                    streams: { increment: 1 },
                    lastStream: new Date()
                },
                set: {
                    firstStream: new Date(),
                    lastStream: new Date(),
                    streams: 1
                }
            },
        }

        if(vys){
            prisma.vault_yearly_stream.update({
                where: {id: vys.id}, data: {
                    streams: {
                        increment: 1
                    },
                    [month]: updatedMonth
                }
            })
        }else {
            prisma.vault_yearly_stream.create({
                data: { year, vaultId: vault.id, controller: vault.controller, streams: 1, [month]: newMonth }
            })
        }
        if(uys){
            prisma.user_yearly_stream.update({
                where: {id: uys.id}, data: {
                    streams: {
                        increment: 1
                    },
                    [month]: updatedMonth
                }
            })
        }else {
            prisma.user_yearly_stream.create({
                data: { year, userId: vault.controller, streams: 1, [month]: newMonth }
            })
        }

        await prisma.$transaction([
            prisma.vault.update({ where: { id }, data: { streams: { increment: 1 } } }),
            prisma.user.update({ where: { id: vault.controller }, data: { streams: { increment: 1 } } }),
            // prisma.vault_yearly_stream.upsert({
            //     where: vys? {id: vys.id}:{  }, create: { year, vaultId: vault.id, controller: vault.controller, streams: 1, [month]: newMonth }, update: {
            //         streams: {
            //             increment: 1
            //         },
            //         [month]: updatedMonth
            //     }
            // }),
            // prisma.user_yearly_stream.upsert({
            //     where: uys? {id: uys.id}:{  }, create: { year, userId: vault.controller, streams: 1, [month]: newMonth }, update: {
            //         streams: {
            //             increment: 1
            //         },
            //         [month]: updatedMonth
            //     }
            // }),
        ]);

        return new NextResponse(null, {status: ResponseCodes.ACCEPTED});
    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: ResponseCodes.INTERNAL_SERVER_ERROR });
    }
}