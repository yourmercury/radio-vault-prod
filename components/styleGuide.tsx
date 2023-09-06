export const LightMode = {
  primary: "#BB0029",
  secondary: "#1974F8",
  white: "#FFFFFF",
  black: "#121212",
  background: "#FFFFFF",
  border: "#D3C5C8",
  lowEm: "#996671",
  highEm: "#5C3D44",
  theme: "light",
  getIcon: (name: string, ext: string) => name + "." + ext,
  return: (a:any, b:any)=> a
};

export const DarkMode = {
  primary: "#FD2654",
  secondary: "#1974F8",
  white: "#FFFFFF",
  black: "#121212",
  background: "#121212",
  border: "#3D292D",
  lowEm: "#FD587C",
  highEm: "##560113",
  theme: "dark",
  getIcon: (name: string, ext: string) => name + "_dark" + "." + ext,
  return: (a:any, b:any)=> b
};

export const TextColors = {
  g50: "#F6F4F4",
  g100: "#D3C5C8",
  g200: "#BFA6AC",
  g300: "#AD858D",
  g400: "#996671",
  g500: "#7A525A",
  g600: "#5C3D44",
  g700: "#3D292D",
  g800: "#1F1417",
  g900: "#060405",
  black: "#121212",
  white: "#FFFFFF",
  trackHeaderColor: "#F7F8FA",
  accent_warning700: "#C29200",
  accent_warning300: "#FFE38F",
  primary300: "#FE8BA4",
  grey100: "#B6B6BA",
  neutral50: "#F9F9FA"

};
