import EmbedComp from "@/components/embedComp";
import { Vault } from "@/types";

async function getData(id: string) {
  let vault: Vault | any = null;
  try {
    console.log("getting vault");
    const res = await fetch(process.env.NEXT_URL + `/api/vault/edge/${id}`, {headers: {Authorization: "Bearer "+process.env.EDGE_AUTH}, cache: "no-store"});
    console.log(res.status);

    if (res.ok) {
      vault = await res.json();
    }
  } catch (error) {
    console.log(error);
  }finally {
    return vault;
  }
}

export default async function Embed({ params }: { params: { id: string } }) {
  const vault = await getData(params.id);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
        <EmbedComp vault={vault} full/>;
    </div>
  )
}
