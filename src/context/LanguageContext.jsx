"use client"
import React,{useContext,createContext,useState,useEffect} from "react" 

import en from "../../locale/en.json"
import ar from "../../locale/ar.json"
import fr from "../../locale/fr.json"
import sp from "../../locale/sp.json"

const translator={
    en,ar,fr,sp
}
const LanguageContext=createContext()

export default function LanguageProvider({children}){
const[lang,setLang]=useState("en")
const t=translator[lang]
const handleSetLang=(newLang)=>{
    localStorage.setItem("lang",newLang)
    setLang(newLang)
}
useEffect(()=>{
    if(typeof window!== "undefined"){
        const newLang=localStorage.getItem("lang")||"en"
        setLang(newLang)
    }
},[])
const dir=lang==="ar"?"rtl":"ltr"
return(
    <LanguageContext.Provider value={{t,setLang:handleSetLang,dir,lang}}>
        {children}
    </LanguageContext.Provider>
)
}

export const useLang=()=>useContext(LanguageContext)
