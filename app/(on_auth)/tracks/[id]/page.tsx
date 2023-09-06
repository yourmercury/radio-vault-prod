"use client";

import EmptyState from "@/components/emptyState";
import LoadingDots from "@/components/loading";
import { Text32, TextLink } from "@/components/texts/textSize";
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
            <div className="p-big flex justify-center">
                <EmptyState title="Not found">
                    The Vault does not exist or Something went wrong.
                    <TextLink link="/tracks"> Click</TextLink> to go to Tracks
                </EmptyState>
            </div>
        )
    }

    if(!error && !vault) {
        return (
            <div className="flex justify-center p-big">
                <LoadingDots />
            </div>
        )
    }

    return (
        <TrackPreview vault={vault}/>
    )
}