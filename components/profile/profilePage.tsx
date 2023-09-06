"use client";

import { ThemeContext } from "@/context/ThemeContext";
import ButtonComp from "../button";
import { TextColors } from "../styleGuide";
import { Text12, Text14, Text16, Text20 } from "../texts/textSize";
import { useContext, useEffect, useState } from "react";
import Icons from "../icons/icons";
import InputComp from "../input";
import { VaultContext } from "@/context/VaultContext";
import SelectComp from "../selectComp";
import { getIPFSLink, uploadProfile } from "@/utils/NFTStorage";
import { toast } from "react-toastify";
import { ResponseCodes } from "@/utils/responseCodes";
import LoadingDots from "../loading";

export default function ProfilePage() {
  const { mode } = useContext(ThemeContext);
  const { dashboard, error } = useContext(VaultContext);
  const [file, setFile] = useState<File>();

  const [user, setUser] = useState({
    firstName: "",
    avatar: "",
    lastName: "",
    email: "",
    location: "Edo, Nigeria",
    stageName: "",
    dateOfBirth: "",
    role: "",
  });

  useEffect(() => {
    if (dashboard) {
      const u = {
        avatar: user.avatar || dashboard.user.avatar,
        firstName: dashboard.user.firstName as string,
        lastName: dashboard.user.lastName as string,
        stageName: dashboard.user.stageName as string,
        email: dashboard.user.email,
        location: dashboard.user.metadata?.location as string,
        dateOfBirth: dashboard.user.dateOfBirth as string,
        role: dashboard.user.role as string,
      };

      setUser({ ...u });
    }
  }, [dashboard]);

  useEffect(() => {
    if(!file) return;
    const reader = new FileReader();
    console.log(file);
    reader.onload = (e) => {
      let a = e.target?.result;
      setUser({...user, avatar: a as string})
    };
    reader.readAsDataURL(file);
  }, [file]);


  async function saveChanges(){
    let avatar = user.avatar;
    if(file){
        avatar = await uploadProfile(file);
        console.log(avatar);
    }
    const res = await fetch('/api/profile', {method: "POST", body: JSON.stringify({...user, avatar})});
    console.log(res.status);
    ResponseCodes
  }

  return (
    <div className="p-[30px] pt-0">
      <div
        className="flex py-[30px] border-b"
        style={{ borderColor: mode.border }}
      >
        <div className="flex flex-col">
          <Text20 light="black" className="sm:text-[24px]">
            Artiste Profile
          </Text20>
          <Text12
            light={TextColors.g600}
            dark={TextColors.g200}
            className="sm:text-[14px]"
          >
            Set up your personal information
          </Text12>
        </div>

        <div className="ml-auto">
          <ButtonComp onClick={()=>{
            toast.promise(
                saveChanges(),
                {
                    pending: "Updating profile",
                    success: "Updated profile",
                    error: "Something went wrong"
                }
            )
          }}>
            <Text14 className="px-big">Save changes</Text14>
          </ButtonComp>
        </div>
      </div>

      <div>
        <div
          className="flex items-center py-5 border-b"
          style={{ borderColor: mode.border }}
        >
          <div className="relative w-fit h-fit">
            <img
              src={
                file? user.avatar : getIPFSLink(user.avatar)||
                "https://ionicframework.com/docs/img/demos/avatar.svg"
              }
              alt=""
              className="h-[100px] w-[100px] rounded-full"
            />
            <label
              htmlFor="yeyen"
              className="rounded-full w-[25px] h-[25px] flex justify-center items-center absolute bottom-0 right-0"
              style={{
                background: mode.return(TextColors.g100, TextColors.g700),
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name=""
                id="yeyen"
                onChange={(e) => {
                  let file = e.currentTarget.files && e.currentTarget.files[0];
                  if(!file) return;
                  setFile(file as File);
                }}
              />
              <Icons icon="edit" />
            </label>
          </div>

          <div className="flex flex-col ml-5">
            <Text20 light="black" className="sm:text-[24px] capitalize">
              {user.firstName} {user.lastName}
            </Text20>
            <Text12
              light={TextColors.g600}
              dark={TextColors.g200}
              className="sm:text-[14px]"
            >
              {user.email}
            </Text12>
          </div>
        </div>

        {!dashboard && !error && <div className="flex justify-center"><LoadingDots /></div>}

        {dashboard && <div>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              <Text16 light="black" className="my-5 block">
                Personal info
              </Text16>
              <div className="mb-3">
                <InputComp
                  icon="user"
                  placeholder="Eg. John"
                  label={"First name"}
                  value={user.firstName}
                  onChange={(value)=>{
                    setUser({...user, firstName: value})
                  }}
                />
              </div>
              <div className="mb-3">
                <InputComp
                  icon="user"
                  placeholder="Eg. Doe"
                  label={"Last name"}
                  value={user.lastName}
                  onChange={(value)=>{
                    setUser({...user, lastName: value})
                  }}
                />
              </div>
              <div className="mb-3">
                <InputComp
                  icon="email"
                  placeholder="Eg. johndoe@gmail.com"
                  label={"Email address"}
                  value={user.email}
                  onChange={(value)=>{
                    setUser({...user, email: value})
                  }}
                />
              </div>
              <div className="mb-3">
                <InputComp
                  icon="calendar"
                  placeholder="Eg. John Doe"
                  label={"Date of birth"}
                  type="date"
                  value={user.dateOfBirth}
                  onChange={(value)=>{
                    setUser({...user, dateOfBirth: value})
                  }}
                />
              </div>
              {/* <div className="mb-3">
                <InputComp
                  icon="location"
                  placeholder="Eg. Delaware, USA"
                  label={"Location"}
                  value={user.location}
                  onChange={(value)=>{
                    setUser({...user, location: value})
                  }}
                />
              </div> */}

              {/* <input type="date" name="" id=""  onChange={(e)=>{console.log(e.currentTarget.value)}}/> */}
            </div>

            <div className="flex-1 md:ml-10 mt-5 md:mt-[0px]">
              <Text16 light="black" className="my-5 block">
                Artiste info
              </Text16>

              <div className="mb-3">
                <InputComp
                  icon="user"
                  placeholder="Eg. Wizkid"
                  label={"Stage name"}
                  value={user.stageName}
                  onChange={(value)=>{
                    setUser({...user, stageName: value})
                  }}
                />
              </div>
              <div className="mb-3">
                <SelectComp
                  label={"Artiste main role"}
                  options={["Singer", "Instrumentalist", "Producer", "DJ"]}
                  values={["singer", "instrumentalist", "producer", "dj"]}
                  value={user.role}
                  onChange={(value)=>{
                    setUser({...user, role: value})
                  }}
                />
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}
