"use client";

import Icons from "@/components/icons/icons";
import { TextColors } from "@/components/styleGuide";
import { Text12, Text16, Text20 } from "@/components/texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import { Vault } from "@/types";
import { getIPFSLink } from "@/utils/NFTStorage";
import { formatMediaDuration } from "@/utils/utils";
import { useContext, useEffect, useRef, useState } from "react";

enum readyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

//counting streams.. start 0, finish 90% of length

export default function EmbedComp({ vault, children , full, autoPlay, dontCount}: { vault: Vault | null, children?: any, full?: boolean, autoPlay?: boolean, dontCount?: boolean }) {
  const { mode } = useContext(ThemeContext);
  const audio = useRef<HTMLAudioElement>(null);
  const countState = useRef({
    playing: false,
    started: false,
    ended: 0,
    count: 0,
  });
  const [isLoaded, setLoad] = useState(false);
  const [mediaState, setMediaState] = useState({
    isPlaying: false,
    isPaused: false,
  });
  const [mediaTime, setMediaTime] = useState({
    duration: 0,
    currentTime: 0,
    currentPoint: 0,
  });

  async function countStream() {
    try {
        await fetch(`/api/stream/${vault?.id}`, {method: "POST"});
        console.log("this stream was counted", countState.current.count);
    } catch (error) {
      console.log(error);
    }
  }

  async function playPause(action: boolean) {
    if (!audio.current) return;
    if (action) {
      await audio.current.play();
    } else {
      audio.current.pause();
    }

    // setMediaState({...mediaState, isPlaying: !audio.current.paused});
  }

  function toggleStreamCountAlgorithm() {
    if(dontCount) return;
    const interval = setInterval(() => {
      if (countState.current.playing) {
        countState.current.count += 0.5;
      }

      let marker = audio.current?.duration as number > 35? 30 : Math.floor(audio.current?.duration as number *90/100);

      if (countState.current.count >= marker) {
        countStream();
        clearInterval(interval);
      }

    //   console.log(countState.current)
    }, 500);
  }

  useEffect(() => {
    console.log(vault);
    if (!audio.current) return;
    const aud: HTMLAudioElement = audio.current;

    aud.onload = () => {
      console.log("ready at onload");
      setLoad(true);
    };

    aud.onpause = () => {
        console.log("pause")
        countState.current.playing = false;
      setMediaState({ ...mediaState, isPlaying: false });
    };

    aud.onwaiting = ()=>{
        console.log("waiting");
        countState.current.playing = false;
        setMediaState({ ...mediaState, isPlaying: false });
    }

    aud.onplaying = () => {
      if (
        countState.current.count == 0 &&
        !countState.current.playing &&
        !countState.current.started
      ) {
        countState.current.playing = true;
        countState.current.started = true;

        toggleStreamCountAlgorithm();
      }

      countState.current.playing = true;
      setMediaState({ ...mediaState, isPlaying: true });
    };

    aud.onended = () => {
      countState.current = {
        count: 0,
        playing: false,
        started: false,
        ended: 1,
      };
    };

    if (aud.readyState > 0) {
      console.log("ready");
      setLoad(true);
      mediaTime.duration = aud.duration;
      setMediaTime({ ...mediaTime });
    }

    aud.ontimeupdate = () => {
      mediaTime.currentTime = aud.currentTime;
      mediaTime.currentPoint = (aud.currentTime / aud.duration) * 100;

      setMediaTime({ ...mediaTime });
    };
  }, []);

  useEffect(() => {}, [mediaState]);

  return (
    <div className="">
      <audio
        src={getIPFSLink(vault?.metadata.media as string)}
        autoPlay={autoPlay}
        ref={audio}
      />
      <div
        className="w-full h-full max-h-[150px] border rounded-xl p-4 flex flex-col justify-between"
        style={{
          borderColor: mode.theme == "dark" ? TextColors.g700 : TextColors.g100,
          maxWidth: full? "100%":"600px",
        }}
      >
        <div className="flex w-full h-[70px]">
          <img
            src={
              getIPFSLink(vault?.metadata.image as string) ||
              "/assets/track_cover.png"
            }
            className="h-[70px] w-[70px] rounded-xl"
            alt=""
          />
          <div className="flex-1 ml-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Text16 light="black">{vault?.title}</Text16>

              <div className="flex h-[30px] items-center">
                <Icons icon="backward" w={20} />
                <div
                  onClick={() => {
                    // audio.current?.play()
                    if (!audio.current) return;
                    const isPlaying = !audio.current.paused;
                    playPause(!isPlaying);
                  }}
                >
                  {!mediaState.isPlaying ? (
                    <Icons icon={"play"} w={30} className="mx-2 h-[30px]" />
                  ) : (
                    <Icons icon={"pause"} w={30} className="mx-2 h-[20px]" />
                  )}
                </div>
                <Icons icon="forward" w={20} />
              </div>
            </div>

            <div className="w-full flex justify-between items-center">
              <Text12 light="gray" dark="gray">
              {formatMediaDuration(audio.current?.currentTime as number || 0)}
              </Text12>

              <div
                className="flex-1 mx-3 h-[4px] cursor-pointer relative rounded-xl flex items-center hover:border-y-[2px] hover:h-[6px]"
                style={{
                  backgroundColor:
                    mode.theme == "dark" ? TextColors.g800 : TextColors.g50,
                    borderColor: mode.theme == "dark" ? TextColors.g800 : TextColors.g50
                }}

                onClick={(e)=>{
                    if(!(audio.current && audio.current.duration)) return;
                    const prog = document.querySelector("#embed-progress");
                    let width = e.nativeEvent.offsetX
                    //@ts-ignore
                    let ratio = width/e.currentTarget.getBoundingClientRect().width;
                    // console.log(width, e.currentTarget.getBoundingClientRect().width);
                    audio.current.currentTime = (audio.current.duration * ratio);
                }}
              >
                <div
                  className="h-[4px] rounded-xl"
                  id="embed-progress"
                  style={{
                    backgroundColor: mode.primary,
                    width: `${mediaTime.currentPoint}%`,
                  }}
                ></div>
              </div>

              <Text12 light="gray" dark="gray">
                {formatMediaDuration(audio.current?.duration as number || 0)}
              </Text12>
            </div>
          </div>
        </div>

        {!children && <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/assets/image_card.png"
              className="h-[25px] w-[25px]"
              alt=""
            />
            <Text12 light="black" className="mx-4">
              {vault?.metadata.attributes[2].value.name}
            </Text12>
            <Icons icon="share" w={15} />
          </div>

          <div className="flex items-center">
            <Icons icon="logo" />
            <Text12 light="black" className="mx-4">
              From radio vaults
            </Text12>
            <Icons w={15} icon="open_in_new" />
          </div>
        </div>}
        {children && children}
      </div>
    </div>
  );
}
