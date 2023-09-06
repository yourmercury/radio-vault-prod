import { NextRequest } from "next/server";
import { ResponseCodes } from "./utils/responseCodes";

export async function middleware(request: NextRequest){

    // return;
    // console.log("this is here", request);
    try {
        // return
        const cookie = request.cookies.get(process.env.AUTH_TOKEN_NAME as string);

        if(!cookie){
            return Response.redirect(process.env.NEXT_URL+"/login");
        }

        const res = await fetch(process.env.NEXT_URL+'/api/cookie-auth', {method: "POST", body: JSON.stringify({token: cookie.value})});
        // console.log(res.status);
        if(res.status == ResponseCodes.UNAUTHORIZED) {
            return Response.redirect(process.env.NEXT_URL+"/login");
        }else if(res.status == ResponseCodes.INTERNAL_SERVER_ERROR){
            throw(res.status);
        }

    }catch(error){
        console.error(error);
        return new Response(null, {status: ResponseCodes.INTERNAL_SERVER_ERROR});
    }
}

export const config = {
    // matcher: ["/"]
    matcher: ["/", "/tracks", "/tracks/:path*", "/upload-vault", "/whitelist", "/deploy", "/profile"]
}