import { NFTStorage, TokenType } from 'nft.storage';
import { ResponseCodes } from './responseCodes';
import { MetadataSchema } from '@/types';



const storage = new NFTStorage({token: process.env.NEXT_PUBLIC_NFT_STORAGE_SK as string});

export const uploadMetadata = async(data: MetadataSchema)=>{
    const metadata = await storage.store({
        ...data
    });
    let payload: {
        storageURL: string;
        title: string;
        description: string;
        metadata: any;
    } = {
        storageURL: metadata.url,
        title: data.name,
        description: data.description,
        metadata: metadata.data
    }
    let res = await fetch(`/api/vault`, {method: "POST", body: JSON.stringify(payload)});

    if(res.status != ResponseCodes.CREATED){
        throw({msg: res.status == ResponseCodes.UNAUTHORIZED? "user not logged in":"Something went wrong! try again", status: res.status})
    }else return true;
}

export function getIPFSLink(url:string){
    if(!url) return "";
    if(url.startsWith("ipfs")){
        url = url.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_PREFIX as string)
    }else if (!url.includes("htt")){
        url = process.env.NEXT_PUBLIC_IPFS_PREFIX+url;
    }

    return url;
}

export async function uploadProfile(file: File){
    const f = await storage.storeBlob(file);
    return f;
}