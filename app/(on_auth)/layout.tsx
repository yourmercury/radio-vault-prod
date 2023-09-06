import AuthContextProvider from "@/context/AuthContext";
import ".././globals.css";
import { Inter } from "next/font/google";
import ThemeContextProvider from "@/context/ThemeContext";
import PageContainer from "@/components/PageContainer";
import { ToastContainer } from "react-toastify";
import Toastify from "@/components/Toastify";
import SideBar from "@/components/sidebar";
import NavBar from "@/components/navbar";
import ContentContainer from "@/components/content";
import Blur from "@/components/blur";
import VaultContextProvider from "@/context/VaultContext";
import LayoutContextProvider from "@/context/LayoutContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crea Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VaultContextProvider>
        <LayoutContextProvider>{children}</LayoutContextProvider>
    </VaultContextProvider>
  );
}