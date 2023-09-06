"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TextColors } from "../styleGuide";
import Icons from "../icons/icons";
import { Text14, Text16, TextLink } from "../texts/textSize";
import CheckBox from "../checkBox";
import { Vault, orderByTypes } from "@/types";
import { getIPFSLink } from "@/utils/NFTStorage";
import { VaultContext } from "@/context/VaultContext";
import { useRouter } from "next/navigation";
import EmptyState from "../emptyState";
import LoadingDots from "../loading";

export default function TracksComp() {
  const { mode } = useContext(ThemeContext);
  const [sortModal, setSortModal] = useState(false);
  const { sorting, setSorting } = useContext(VaultContext);
  const { tracks, trackError } = useContext(VaultContext);

  console.log(tracks);

  return (
    <div className="p-big">
      <div className="flex flex-col-reverse md:flex-row mb-5">
        <div
          className="flex items-center border rounded-[10px] px-big py-3 my-2 flex-1"
          style={{ borderColor: mode.return(mode.border, TextColors.g700) }}
        >
          <Icons icon="search" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none bg-transparent ml-2"
          />
        </div>

        <div className="flex flex-1">
          <div
            className="flex items-center flex-1 justify-end relative cursor-pointer"
            onClick={() => {
              setSortModal(!sortModal);
            }}
          >
            <Icons icon="indicators" />
            <Text16 light="black" dark={TextColors.g200}>
              Sort
            </Text16>
            <Icons icon="chevron_down" className="ml-2" />
            {sortModal && (
              <div
                className="absolute top-[100%] z-[39]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <SortComp
                  visible
                  mode={mode}
                  sortedBy={sorting.sort}
                  order={sorting.order}
                  setSort={(sorting_) => {
                    setSorting({ ...sorting_ });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div
          className="py-2 px-2 rounded flex items-center"
          style={{
            background: mode.return(
              TextColors.trackHeaderColor,
              TextColors.g800
            ),
          }}
        >
          <div className="w-[40px]">
            <div
              className="h-[20px] w-[20px] rounded flex justify-center items-center"
              style={{ background: mode.primary }}
            >
              <Icons icon="minus" noToggle />
            </div>
          </div>
          <div className="flex-[1.8]">
            <Text14 light="black">Track</Text14>
          </div>
          <div className="flex-1 md:block hidden">
            <Text14 light="black">Date added</Text14>
          </div>
          <div className="flex-1 sm:block hidden">
            <Text14 light="black">Deployment count</Text14>
          </div>
          <div className="md:flex-1">
            <Text14 light="black">Streams</Text14>
          </div>
        </div>
      </div>

      <div>
        {tracks?.map((track, index) => (
          <TableTrack mode={mode} track={track} index={index} key={track.id} />
        ))}
      </div>

      {!trackError && !tracks && ( 
        <div className="flex justify-center my-3">
          <LoadingDots />
        </div>
      )}

      {typeof tracks == "object" && tracks?.length === 0 && (
        <div className="flex justify-center my-10">
          <EmptyState title={"No Vault"}>
            You have not uploaded any vault, go to{" "}
            <TextLink link="/upload-vault">Create</TextLink> to upload a vault
          </EmptyState>
        </div>
      )}

      <div className="mt-10"></div>
    </div>
  );
}

function TableTrack({
  mode,
  track,
  index,
}: {
  mode: any;
  index: number;
  track: Vault;
}) {
  const router = useRouter();
  return (
    <div
      className="flex items-center py-3 px-2 border-b "
      style={{ borderColor: mode.return("#E3E3E8", TextColors.g700) }}
      onClick={() => {
        router.push(`/tracks/${track.id}`);
      }}
    >
      <div className="w-[40px]">
        <CheckBox checked={false} check={() => {}} />
      </div>

      <div className="flex items-center flex-[1.8]">
        <img
          src={getIPFSLink(track.metadata.image)}
          className="h-[60px] w-[80px] rounded-lg mr-2"
          alt=""
        />
        <div className="flex flex-col pr-2">
          <Text16 dark={TextColors.g300} light={"black"}>
            {track.title}
          </Text16>
          <div className="flex flex-col">
            <div className="">
              <span
                style={{ color: TextColors.g300 }}
                className="flex items-center text-[12px]"
              >
                <Icons icon="tag_right" className="h-[12px] mr-1" noToggle />{" "}
                Deployed {track.deploymentCount}
              </span>
            </div>

            <div>
              <span
                style={{ color: TextColors.g300 }}
                className="flex items-center text-[12px]"
              >
                <Icons icon="cloud_cross" className="h-[12px] mr-1" noToggle />{" "}
                blacklist {"6"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 md:block hidden">
        <Text14 light="black">
          {new Date(track.createdAt).toLocaleDateString()}
        </Text14>
      </div>
      <div className="flex-1 sm:block hidden">
        <Text14 light="black">{track.deploymentCount}</Text14>
      </div>
      <div className="md:flex-1">
        <Text14 light="black">{track.streams}</Text14>
      </div>
    </div>
  );
}

function SortComp({
  mode,
  visible,
  setVisible,
  setSort,
  sortedBy,
  order,
}: {
  mode: any;
  sortedBy?: string;
  order?: string;
  visible?: boolean;
  setVisible?: () => any;
  setSort?: (sorting: { sort?: string; order?: string }) => any;
}) {
  if (!visible) return null;
  return (
    <div
      className="border w-[200px] rounded-xl shadow-xl"
      style={{ borderColor: mode.border, background: mode.background }}
    >
      <div className="border-b p-3" style={{ borderColor: mode.border }}>
        <Text14
          className="flex justify-between"
          dark={TextColors.g200}
          light={TextColors.g400}
        >
          <span>Sorting</span>
          <Icons icon="indicators" />
        </Text14>
      </div>

      <OrderByComp
        name="Date created"
        sort={orderByTypes[0]}
        sortedBy={sortedBy}
        start="1"
        end="9"
        order={order}
        setSort={setSort}
      />
      <OrderByComp
        name="Date Updated"
        sort={orderByTypes[1]}
        sortedBy={sortedBy}
        start="1"
        end="9"
        order={order}
        setSort={setSort}
      />
      <OrderByComp
        name="Streams"
        sort={orderByTypes[2]}
        sortedBy={sortedBy}
        start="1"
        end="9"
        order={order}
        setSort={setSort}
      />
      <OrderByComp
        name="Shares"
        sort={orderByTypes[3]}
        sortedBy={sortedBy}
        start="1"
        end="9"
        order={order}
        setSort={setSort}
      />
    </div>
  );
}

//@ts-ignore
function OrderByComp({
  setSort,
  sortedBy,
  start,
  end,
  sort,
  order,
  name,
}: {
  name?: string;
  sortedBy?: string;
  setSort?: (sorting: { sort?: string; order?: string }) => any;
  start?: string;
  end?: string;
  sort?: string;
  order?: string;
}) {
  return (
    <div
      className={`p-3 hover:bg-[#3D292D3f]`}
      onClick={() => {
        setSort && setSort({ sort, order });
      }}
      style={{ background: sort == sortedBy ? TextColors.g700 : "" }}
    >
      <Text14
        className="flex justify-between"
        dark={TextColors.g200}
        light={TextColors.g400}
      >
        <span>{name}</span>
        <div className="flex items-center">
          <span>{order == "asc" ? start : end}</span>
          <div className="mx-1">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSort && setSort({ sort, order: "asc" });
                console.log("lalala");
              }}
            >
              <Icons
                icon={order == "asc" ? `caret_up_active` : `caret_up`}
                className="mb-2"
              />
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSort && setSort({ sort, order: "desc" });
                console.log("lalala");
              }}
            >
              <Icons
                icon={order == "desc" ? `caret_down_active` : `caret_down`}
              />
            </span>
          </div>
          <span>{order == "asc" ? end : start}</span>
        </div>
      </Text14>
    </div>
  );
}
