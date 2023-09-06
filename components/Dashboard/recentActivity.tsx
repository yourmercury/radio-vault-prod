import { getIPFSLink } from "@/utils/NFTStorage";
import Icons from "../icons/icons";
import InputComp from "../input";
import { TextColors } from "../styleGuide";
import { Text14, Text16, TextLink } from "../texts/textSize";
import EmptyState from "../emptyState";

export default function RecentActivites({
  mode,
  vaults,
}: {
  mode: any;
  vaults: any;
}) {
  return (
    <div
      className="md:p-big md:border md:rounded-[20px] rounded-[10px] md:mt-5 relative"
      style={{ borderColor: mode.return(mode.border, TextColors.g800) }}
    >
      <Text16 light="black" className="flex items-center font-bold mb-5">
        <Icons icon="Recent" className="mr-2" /> Top Vaults
      </Text16>

      <div className="flex justify-between">
        {/* <div
          className="flex items-center border rounded-[10px] px-big py-3 my-2 flex-1"
          style={{ borderColor: mode.return(mode.border, TextColors.g700) }}
        >
          <Icons icon="search" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-transparent ml-2"
          />

        </div> */}

        {/* <div className="flex items-center absolute md:static top-0 right-0 md:pt-0 md:pr-0 flex-1 justify-end">
          <Icons icon="indicators" />
          <Text16 light="black" dark={TextColors.g200}>
            Sort
          </Text16>
          <Icons icon="chevron_down" className="ml-2" />
        </div> */}
      </div>

      <div className="flex relative mb-2 sm:mb-5">
        <Text16 className="flex-1" light="black">
          Tracks
        </Text16>
        <Text16 className="w-[15%] hidden md:block" light="black">
          Streams
        </Text16>
        <Text16 className="w-[15%] hidden md:block" light="black">
          Shares
        </Text16>
        <Text16 className="w-[15%] hidden md:block" light="black">
          Created
        </Text16>
      </div>

      {vaults.map((vault:any, index:any) => (
        <TableVault mode={mode} vault={vault} key={index}/>
      ))}

      {!vaults.length && <div className="flex justify-center my-10">
        <EmptyState title={"No Vault"}>
        You have not uploaded any vault, go to <TextLink link="/upload-vault">Create</TextLink> to upload a vault
        </EmptyState>
      </div>}
    </div>
  );
}

function TableVault({ mode, vault }: { mode: any, vault: any }) {
  return (
    <div
      className="flex items-center py-3 border-b"
      style={{ borderColor: mode.return("#E3E3E8", TextColors.g700) }}
    >
      <div className="flex items-center flex-1">
        <img
          src={getIPFSLink(vault.metadata.image)}
          className="h-[60px] w-[80px] rounded-lg mr-2"
          alt=""
        />
        <div className="flex flex-col">
          <Text16 dark={TextColors.g300} light={"black"}>
            {vault.title}
          </Text16>
          <Text14 dark={TextColors.g300} light={TextColors.g400}>
            {vault.description}
          </Text14>
        </div>
      </div>

      <Text16
        dark={TextColors.g300}
        light={"black"}
        className="w-[15%] hidden md:block"
      >
        {vault.streams}
      </Text16>
      <Text16
        dark={TextColors.g300}
        light={"black"}
        className="w-[15%] hidden md:block"
      >
        0
      </Text16>
      <Text16
        dark={TextColors.g300}
        light={"black"}
        className="w-[15%] hidden md:block"
      >
        {new Date(vault.createdAt).toDateString()}
      </Text16>
    </div>
  );
}
