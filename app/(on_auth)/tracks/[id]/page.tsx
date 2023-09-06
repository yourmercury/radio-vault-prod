"use client";

import { Text32 } from "@/components/texts/textSize";
import TrackPreview from "@/components/tracks/preview";
import { Vault } from "@/types";
import { useEffect, useState } from "react";


async function getData(id:string){
    try {
        const res = await fetch(`/api/vault/${id}`, {cache: "no-store"});
        console.log(res.status);
        if(res.status == 200){
            return await res.json()
        }else {
            return undefined;
        }
    }catch(error){
        console.log(error);
        return undefined;
    }
}

export default function Tracks({ params }: { params: { id: string } }) {
    const [vault, setVault] = useState<Vault | undefined>()
    const [error, setError] = useState(false);

    useEffect(()=>{
        getData(params.id)
        .then((vault)=>{
            if(!vault) {
                setError(true);
                return;
            }
            setVault(vault);
        })
        .catch(()=>{
            setError(true);
        })
    }, [])

    if(error) {
        return (
            <Text32 light={"black"}>
                No Vault found
            </Text32>
        )
    }

    if(!error && !vault) {
        return (
            <Text32 light={"black"}>
                Loading
            </Text32>
        )
    }

    return (
        <TrackPreview vault={vault}/>
    )
}