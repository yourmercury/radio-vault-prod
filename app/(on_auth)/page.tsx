"use client";

import DashboardPage from "@/components/Dashboard/dashboard";
import { Text32 } from "@/components/texts/textSize";
import { VaultContext } from "@/context/VaultContext";
import { getMonth } from "@/utils/utils";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const { dashboard: data, error } = useContext(VaultContext);


  useEffect(()=>{
    if(error){
      toast.error("Something went wrong");
    }
  }, [error])

  if (!data && !error) {
    return <Text32 light="black">

    </Text32>;
  }
  


  return <DashboardPage data={data} />;
}
