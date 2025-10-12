"use client"

import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {

  const [info,setInfo]=useState<any>(null);
  const [loading, setLoading] = useState(false); 
  const API_BASE_URL = "http://localhost:8080";
  const handleKeyDown=async (e:any)=>{
    if (e.key === 'Enter'){
      const question = e.target.value ||'';
      setLoading(true);
      try {
      const response = await fetch(`${API_BASE_URL}/api/interference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });
      const data= await response.json();
      setInfo(data?.result?.[0])
     }catch(err){
      console.error(err);
     }finally {
      setLoading(false); 
    }
    }

  }

  return (
    <div>
      <Header />
      <div className="m-auto flex w-full mt-5 hover:shadow-lg focus-within:shadow-lg max-w-md rounded-md border border-gray-200 px-5 py-3 items-center sm:max-w-xl lg:max-w-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 mr-3 text-gray-500">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input onKeyDown={handleKeyDown} type="text" className="focus:outline-none flex-grow" placeholder="Recommend the top company to invest in" />
      </div>
      {loading && (
        <div className="my-5 flex justify-center items-center">
          <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
          <span className="ml-2 text-gray-700">Loading...</span>
        </div>
      )}
      {info && <div className="my-5 w-[80%] m-auto info-container">
        <div className="m-auto">
          {info?.companies?.map((company: any, index: number) => {
            return <div className="mb-4" key={index}>
              <div className="max-w-sm mx-auto p-4 bg-gray-50 rounded-lg shadow">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Company</dt>
                    <dd className="text-gray-900">{company.company_name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Revenue</dt>
                    <dd className="text-gray-900">{company.revenue}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">EBIDTA</dt>
                    <dd className="text-gray-900">{company.ebitda}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">PE RATION</dt>
                    <dd className="text-gray-900">{company.pe_ratio}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">ROA</dt>
                    <dd className="text-gray-900">{company.roa}</dd>
                  </div>
                </dl>
              </div>
            </div>
          })}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mx-auto">
          <span className="font-extrabold text-gray-800">Verdict:</span>
          <span className="ml-2 text-green-600">{info?.investment_recommendation}</span>
        </div>
      </div>}
    </div>
  );
}
