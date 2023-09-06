"use client";

import PageContainer from "@/components/PageContainer";
import ButtonComp, { Button2Comp } from "@/components/button";
import FileInputComp from "@/components/fileInput";
import Icons from "@/components/icons/icons";
import InputComp from "@/components/input";
import SelectComp from "@/components/selectComp";
import { DarkMode, LightMode, TextColors } from "@/components/styleGuide";
import TextAreaComp from "@/components/textArea";
import { Text14, Text16, Text18, Text24 } from "@/components/texts/textSize";
import { ThemeContext } from "@/context/ThemeContext";
import { uploadMetadata } from "@/utils/NFTStorage";
import { MetadataSchema } from "@/types";
import { Console } from "console";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

enum role {
  main = "main",
  writer = "writer",
  producer = "producer",
  feature = "feature",
  vocals = "vocals",
  none = "none",
}
type Contributor =
  | { name: string; role: string; external_url: string }
  | undefined;

type Form = {
  name?: string;
  image?: File | null;
  audio?: File | null;
  description?: string;
  license?: string;
  genre?: string;
  keywords?: string;
  external_link?: string;
};

const UploadVault = () => {
  const { mode } = useContext(ThemeContext);
  const router = useRouter();
  const [contributors, setContributors] = useState<Contributor[] | undefined[]>(
    [
      { name: "hippo", role: "main", external_url: "" },
      { name: "hippo", role: "main", external_url: "" },
    ]
  );
  const [contributorsCount, setContributorsCount] = useState([true]);
  const [form, setForm] = useState<Form>({
    name: "In the Jungle",
    image: null,
    audio: null,
    description: "A song about the king of the jungle",
    license: "MIT",
    genre: "blues",
    keywords: "lion jungle,awimboweh",
    external_link: "https://www.inthejungle.com",
  });
  const [errors, setErrors] = useState({
    name: false,
    image: false,
    audio: false,
    description: false,
    license: false,
    genre: false,
    keywords: false,
    contributors: [],
  });

  const clicked = useRef(false);
  const uploading = useRef(false);
  const imageViewer = useRef<any>(null);

  async function canSubmit(_submit?: boolean) {
    const values = Object.values(form);
    const keys = Object.keys(form);

    values.forEach((value, index) => {
      //@ts-ignore
      errors[keys[index]] = !Boolean(value);
    });

    errors.contributors = [];
    contributors.forEach((contributor, index) => {
      if (contributor) {
        // @ts-ignore
        errors.contributors[index] = {
          name: !Boolean(contributor?.name),
          role: !Boolean(contributor?.role),
        };
      }
    });

    setErrors({ ...errors });

    if (_submit) {
      let hasErrors = false;
      const errorValues = Object.values(errors);
      if (errorValues.includes(true)) {
        hasErrors = true;
      }
      errors.contributors.forEach((cont) => {
        if (Object.values(cont).includes(true)) {
          hasErrors == true;
        }
      });

      if (hasErrors) {
        //alert here
        toast.error("Please complete the Form");
      } else if (form.image && form.audio) {
        const contributors_: Contributor[] = [];
        contributors.forEach((contributor, index) => {
          if (index == 0) return;
          if (contributor) contributors_.push(contributor);
        });
        const metadata: MetadataSchema = {
          name: String(form.name),
          description: String(form.description),
          image: form.image,
          media: form.audio,
          media_type: form.audio?.type,
          external_url: String(form.external_link),
          attributes: [],
        };

        //@ts-ignore
        metadata.attributes.push({ trait_type: "genre", value: form.genre });
        //@ts-ignore
        metadata.attributes.push({
          trait_type: "license",
          value: form.license,
        });
        //@ts-ignore
        metadata.attributes.push({
          trait_type: "creator",
          value: { ...contributors[0] },
        });
        //@ts-ignore
        metadata.attributes.push({
          trait_type: "contributors",
          value: contributors_,
        });
        //@ts-ignore
        metadata.attributes.push({
          trait_type: "keywords",
          value: form.keywords
            ?.replaceAll(", ", " ")
            .replaceAll(",", " ")
            .split(" "),
        });

        toast.promise(
          async function () {
            uploading.current = true;
            return await uploadMetadata(metadata);
          },
          {
            pending: "Uploading to IPFS and RadioVault",
            success: {
              render({ data }) {
                setTimeout(() => {
                  router.push("/");
                }, 3000);
                return "uploaded successfully";
              },
            },
            error: {
              render({ data }) {
                uploading.current = false;
                //@ts-ignore
                return data?.msg || "Something went wrong, Please try again";
              },
            },
          }
        );
        try {
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  function addOrRemoveContributor(add: boolean) {
    if (add) {
      setContributorsCount([...contributorsCount, true]);
    } else {
      contributorsCount.length > 1 && contributorsCount.pop();
      setContributorsCount([...contributorsCount]);
    }
  }

  function updateForm(field: string, value: any) {
    //@ts-ignore
    form[field] = value;
    setForm({ ...form });
  }

  function submit() {
    clicked.current = true;

    canSubmit(true);
  }

  console.log(contributors, errors, form);

  useEffect(() => {
    clicked.current && canSubmit();
  }, [form, contributors, contributorsCount]);

  useEffect(() => {
    if (form.image) {
      const reader = new FileReader();
      console.log(form.image);
      reader.onload = (e) => {
        // console.log(e.target?.result);
        imageViewer.current.src = e.target?.result;
      };
      reader.readAsDataURL(form.image);
    }
  }, [form.image]);

  return (
    <div className="my-5">
      <Text24
        dark={DarkMode.white}
        light={LightMode.black}
        className="text-black block px-10"
      >
        Create a track
      </Text24>
      <div className="flex flex-col relative justify-between px-10 md:flex-row">
        <div className="relative md:w-[60%]">
          <div className="flex flex-col">
            <Text16
              dark={TextColors.g200}
              light={LightMode.black}
              className="font-light"
            >
              Radio vault allows you save your media files, register its meta
              data and can be streamed to all other platforms
            </Text16>
          </div>

          <div>
            <div
              className="py-mid border-b"
              style={{
                borderColor:
                  mode.theme == "dark" ? TextColors.g700 : TextColors.g100,
              }}
            >
              <InputComp
                label={"Title"}
                placeholder="EX. Wonderful song"
                theme={mode.theme}
                className="my-5"
                value={form.name || ""}
                onChange={(value) => {
                  updateForm("name", value);
                }}
                required
                //@ts-ignore
                hasError={errors?.name}
              />

              <TextAreaComp
                label="Description"
                placeholder="EX. Very wonderful song that heals the mind"
                cols={2}
                theme={mode.theme}
                className="my-5"
                value={form.description || ""}
                onChange={(value) => {
                  updateForm("description", value);
                }}
                required
                //@ts-ignore
                hasError={errors?.description}
              />

              <InputComp
                label={"License"}
                placeholder="EX. MIT"
                theme={mode.theme}
                className="my-5"
                value={form.license || ""}
                onChange={(value) => {
                  updateForm("license", value);
                }}
                required
                //@ts-ignore
                hasError={errors?.license}
              />
            </div>

            <div
              className="py-mid border-b"
              style={{
                borderColor:
                  mode.theme == "dark" ? TextColors.g700 : TextColors.g100,
              }}
            >
              <div className="flex items-center">
                <Icons icon={"volume_max"} className={"h-[20px]"} />
                <Text18
                  dark={TextColors.white}
                  light={TextColors.black}
                  className="ml-2"
                >
                  Song Information
                </Text18>
              </div>
              <Text14
                dark={TextColors.g200}
                light={TextColors.black}
                className="font-light"
              >
                Radio vault allows you save your media files, register its meta
                data and can be streamed to all other platforms
              </Text14>

              <div>
                <InputComp
                  label={"Genre"}
                  placeholder="EX. rap"
                  theme={mode.theme}
                  className="my-5"
                  value={form.genre || ""}
                  onChange={(value) => {
                    updateForm("genre", value);
                  }}
                  required
                  //@ts-ignore
                  hasError={errors?.genre}
                />
                <InputComp
                  label={"Keywords"}
                  placeholder="Use spacebar or coma (,) to seperate keywords"
                  theme={mode.theme}
                  className="my-5"
                  value={form.keywords || ""}
                  onChange={(value) => {
                    updateForm("keywords", value);
                  }}
                  required
                  //@ts-ignore
                  hasError={errors?.keywords}
                />
                <InputComp
                  label={"Related links"}
                  placeholder="EX. Wikipedia page, portfolio, etc."
                  theme={mode.theme}
                  className="my-5"
                  value={form.external_link || ""}
                  onChange={(value) => {
                    updateForm("external_link", value);
                  }}
                  // required
                  //@ts-ignore
                  // hasError={errors?.external_link}
                />
              </div>
            </div>

            <div
              className="py-mid border-b"
              style={{
                borderColor:
                  mode.theme == "dark" ? TextColors.g700 : TextColors.g100,
              }}
            >
              <div className="flex items-center">
                <Icons icon={"users"} className={"h-[20px]"} />
                <Text18
                  dark={TextColors.white}
                  light={TextColors.black}
                  className="ml-2"
                >
                  Artists/Collaboration
                </Text18>
              </div>
              <Text14
                dark={TextColors.g200}
                light={TextColors.black}
                className="font-light"
              >
                Radio vault allows you save your media files, register its meta
                data and can be streamed to all other platforms
              </Text14>

              <div>
                {contributorsCount.map((cont, index) => (
                  <div
                    key={index}
                    className="p-3 my-4 border rounded-xl"
                    style={{
                      borderColor:
                        mode.theme == "dark"
                          ? TextColors.g700
                          : "rgba(0,0,0,0.3)",
                    }}
                  >
                    {index > 0 && (
                      <Button2Comp
                        className="py-2 w-[80px] ml-auto"
                        onClick={() => {
                          if (contributorsCount.length <= 1) return;
                          contributors.splice(index, 1);
                          setContributors([...contributors]);
                          addOrRemoveContributor(false);
                        }}
                      >
                        <Icons icon="close" />
                      </Button2Comp>
                    )}
                    <InputComp
                      label={"Name"}
                      placeholder="EX. John"
                      theme={mode.theme}
                      className="my-5"
                      onChange={(value) => {
                        let contributor: Contributor = contributors[index];
                        if (contributor) {
                          contributor.name = value;
                        } else {
                          contributor = {
                            name: value,
                            role: "",
                            external_url: "",
                          };
                        }
                        contributors[index] = contributor;
                        setContributors([...contributors]);
                      }}
                      value={contributors[index]?.name || ""}
                      required
                      //@ts-ignore
                      hasError={errors?.contributors[index]?.name}
                    />
                    <SelectComp
                      label={"Role"}
                      theme={mode.theme}
                      className="my-5"
                      options={
                        index == 0
                          ? ["Main Artiste"]
                          : [
                              "Main Artiste",
                              "Song writer",
                              "Producer",
                              "Backup Vocals",
                              "Featuring Artiste",
                            ]
                      }
                      values={
                        index == 0
                          ? ["main"]
                          : ["main", "writer", "producer", "vocals", "feature"]
                      }
                      noNull={index === 0}
                      onChange={(value) => {
                        let contributor: Contributor = contributors[index];
                        if (contributor) {
                          contributor.role = value;
                        } else {
                          contributor = {
                            name: "",
                            role: value,
                            external_url: "",
                          };
                        }

                        contributors[index] = contributor;
                        setContributors([...contributors]);
                      }}
                      required
                      //@ts-ignore
                      hasError={errors?.contributors[index]?.role}
                    />
                    <InputComp
                      label={"Related links"}
                      placeholder="EX. Wikipedia page, portfolio, etc."
                      theme={mode.theme}
                      className="my-5"
                      onChange={(value) => {
                        let contributor: Contributor = contributors[index];
                        if (contributor) {
                          contributor.external_url = value;
                        } else {
                          contributor = {
                            name: "",
                            role: "",
                            external_url: value,
                          };
                        }

                        contributors[index] = contributor;
                        setContributors([...contributors]);
                      }}
                      value={contributors[index]?.external_url || ""}
                      required
                      //@ts-ignore
                      hasError={errors?.contributors[index]?.external_link}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button2Comp
                  className="py-2  w-[80px]"
                  onClick={() => {
                    addOrRemoveContributor(true);
                  }}
                >
                  <Icons icon="plus" />
                </Button2Comp>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[30%] mt-10 md:mt-0">
          <label
            htmlFor="image-input"
            className="h-[300px] relative w-full flex justify-center items-center border rounded-xl border-dashed p-3"
            style={{
              borderColor: errors.image
                ? "red"
                : mode.theme == "dark"
                ? TextColors.g700
                : "rgba(0,0,0,0.3)",
            }}
            onDragOver={(e) => {
              // console.log(e);
              e.preventDefault();
            }}
            onDropCapture={(ev) => {
              // console.log(e);
              console.log("File(s) dropped");

              // Prevent default behavior (Prevent file from being opened)
              ev.preventDefault();

              if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                //@ts-ignore
                [...ev.dataTransfer.items].forEach((item, i) => {
                  // If dropped items aren't files, reject them
                  if (item.kind === "file") {
                    const file = item.getAsFile();
                    if (file.type.includes("image")) {
                      if (file.size > 20_000_000) {
                      } else {
                        form.image = file;
                        setForm({ ...form });
                        console.log(file);
                      }
                      console.log(
                        `… file[${i}].name = ${file.name}  ${file.size}`
                      );
                    }
                  }
                });
              } else {
                // Use DataTransfer interface to access the file(s)
                //@ts-ignore
                [...ev.dataTransfer.files].forEach((file, i) => {
                  console.log(`… file[${i}].name = ${file.name}`);
                });
              }
            }}
          >
            <input
              type="file"
              accept="imgage/*"
              className="hidden"
              id="image-input"
              onChange={(e) => {
                let v = e.target.files && e.target.files[0];
                if (v) {
                  form.image = v;
                  setForm({ ...form });
                }
              }}
            />
            {form.image && (
              <img
                ref={imageViewer}
                alt=""
                className="absolute h-full w-full top-0 left-0 outline-none object-contain"
              />
            )}
            {!form.image && (
              <div className="flex justify-center items-center flex-col h-full w-full absolute rounded-xl z-30 p-4">
                <Icons icon="upload" className="mb-3" />
                <Text14 dark="white" light="black" className="text-center">
                  Drag an image file here or click to{" "}
                  <span style={{ color: mode.primary }}>upload</span> a cover
                  image
                </Text14>
              </div>
            )}
          </label>

          <div className="my-5">
            <FileInputComp
              label="Upload track file"
              icon="folder_plus"
              placeholder="Upload MP3, AUD, WAV, etc"
              id={"fileInp"}
              onChange={(_file) => {
                if (_file.type.startsWith("audio/")) {
                  form.audio = _file;
                  console.log(_file);
                  setForm({ ...form });
                }else{
                  toast.error("Please only chose audio files");
                }
              }}
              accept="audio/*"
              value={form?.audio?.name || ""}
              hasError={errors.audio}
              required
            />
          </div>
        </div>
      </div>
      <div className="px-10 md:flex md:flex-row pt-5">
        <ButtonComp
          onClick={() => {
            if (uploading.current) return;
            submit();
          }}
          className="md:w-[60%]"
        >
          <Text16 className="mr-2 font-[500]">Create</Text16>{" "}
          <Icons icon="arrow_right_dark" noToggle />
        </ButtonComp>
      </div>
    </div>
  );
};

export default UploadVault;
