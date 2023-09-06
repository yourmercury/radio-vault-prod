import { ResponseCodes } from "@/utils/responseCodes";
import { ServerSession } from "@/utils/sessionHandler";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Iron from "@hapi/iron";
import { prisma } from "@/prisma/prisma";
import { Magic } from "@magic-sdk/admin";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;
    const auth = request.headers.get("Authorization");
    if (auth !== "Bearer "+process.env.EDGE_AUTH) {
      return new NextResponse(null, { status: ResponseCodes.UNAUTHORIZED });
    }
    const vault = await prisma.vault.findUnique({
      where: {
        id,
      },
    });

    if (!vault) {
      return new NextResponse(null, {
        status: ResponseCodes.NOT_FOUND,
        statusText: "No vault found",
      });
    }

    return new NextResponse(JSON.stringify(vault), {
      status: ResponseCodes.OK,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, {
      status: ResponseCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
