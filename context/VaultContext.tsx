"use client";

import { Vault, orderByTypes } from "@/types";
import { ResponseCodes } from "@/utils/responseCodes";
import { getMonth } from "@/utils/utils";
import { useEffect, useRef, useState, createContext } from "react";
import { toast } from "react-toastify";

export const VaultContext = createContext<{
  tracks?: Vault[];
  dashboard?: any;
  trackError: boolean;
  error: boolean;
  sorting: {sort: string, order: string},
  setSorting: any
  whitelisted: any[]
  handleWhitelist: (id: string, service: string, status: boolean)=> any
  updateTracks: (updateOrGetMore: boolean, sort?: string) => any;
  whitelistError: boolean
}>({} as any);

async function getDashBoard() {
  let payload;
  try {
    const res = await fetch(`/api/analytics`, {
      cache: "no-store",
    });
    console.log(res.status)
    if (res.status == 200) {
      payload = await res.json();
    }
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getWhitelist() {
  let payload;
  try {
    const res = await fetch(`/api/whitelist`, {
      cache: "no-store",
    });
    console.log(res.status);
    if (res.status == 200) {
      payload = await res.json();
    }
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function whitelistService(id: string, service:string, status: boolean) {
    try {
        const res = await fetch(`/api/whitelist`, {method: "POST", body: JSON.stringify({status, service, id})});
        console.log(res.status)
        if(res.status == ResponseCodes.CREATED){
            return await res.json();
        } else {
            throw(res.statusText);
        }
    }catch(error){
        console.log(error);
        throw(error);
    }
}

async function getTracks(take: number, skip: number, sort?: string) {
  let payload;
  try {
    const res = await fetch(
      `/api/vault?take=${take}&&skip=${skip}${sort ? "&&orderBy=" + sort : ""}`,
      {
        cache: "no-store",
      }
    );
    if (res.status == 200) {
      payload = await res.json();
    }
    return payload as Vault[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function VaultContextProvider({ children }: { children: any }) {
  const [tracks, setTracks] = useState<Vault[] | undefined>(undefined);
  const [whitelisted, setWhitelisted] = useState<any[]>([]);
  const [whitelistError, setWhitelistError] = useState(false);
  const [dashboard, setDashboard] = useState();
  const [error, setError] = useState(false);
  const [trackError, setTrackError] = useState(false);
  const limit = useRef({ take: 20, skip: 0 });
  const [sorting, setSorting] = useState({sort: orderByTypes[0], order: "desc"});

  useEffect(() => {
    getDashBoard()
      .then((data) => {
        let month = getMonth(new Date().getMonth());
        if (!data) return;
        data.month = data?.uys?.[month];
        setDashboard(data);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  }, []);


  useEffect(()=>{
    getTracks(0, 0, sorting.sort + "_" + sorting.order)
    .then((data) => {
      setTracks([...data as Vault[]]);
    })
    .catch((error) => {
      setTrackError(true);
      console.log(error);
    });

    getWhitelist()
    .then((data)=>{
        console.log(data);
        setWhitelisted([...data]);
    })
    .catch((error) => {
        setWhitelistError(true);
        console.log(error);
      });
  }, [sorting])

  function updateTracks(updateOrGetMore: boolean, sort?: string) {
    // true = update, false = getmore
    if (updateOrGetMore) {
      getTracks(0, 0, sorting.sort + "_" + sorting.order)
        .then((data) => {
          setTracks(data as Vault[]);
        })
        .catch((error) => {
          setTrackError(true);
          console.log(error);
        });
    } else {
      let skip = limit.current.skip + limit.current.take;
      let take = limit.current.take;
      getTracks(take, skip, sorting.sort + "_" + sorting.order)
        .then((data) => {
          setTracks([...(tracks || []), ...(data as Vault[])]);
        })
        .catch((error) => {
          setTrackError(true);
          console.log(error);
        });
    }
  }

  async function handleWhitelist(id: string, service: string, status: boolean) {
    const list = await whitelistService(id, service, status);
    setWhitelisted([...list]);
  }

  return (
    <VaultContext.Provider
      value={{ tracks, dashboard, trackError, error, updateTracks, setSorting, sorting , whitelisted, handleWhitelist, whitelistError}}
    >
      {children}
    </VaultContext.Provider>
  );
}
