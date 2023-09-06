"use client"

import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Toastify(){
    const {mode} = useContext(ThemeContext);
    return (
        <ToastContainer theme={mode.theme} />
    )
}