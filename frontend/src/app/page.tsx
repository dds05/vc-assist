"use client"

import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {

  const [info,setInfo]=useState(null);

  const handleKeyDown=async(e:any)=>{
    if (e.key === 'Enter'){
      const question = e.target.value ||'';
      const response = await fetch('http://localhost:8080/api/interference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });
      const data= await response.json();
      setInfo(data?.context[0])
    }

  }

  return (
    <div>
      <Header />
      <div className="m-auto flex w-full mt-5 hover:shadow-lg focus-within:shadow-lg max-w-md rounded-md border border-gray-200 px-5 py-3 items-center sm:max-w-xl lg:max-w-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 mr-3 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input onKeyDown={handleKeyDown} type="text" className="focus:outline-none flex-grow" placeholder="Recommend the top company to invest in"/>
        </div>
        <div className="my-5 w-[80%] m-auto info-container">
          {info}
        </div>
    </div>
  );
}
