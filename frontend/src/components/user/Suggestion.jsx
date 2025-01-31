import { useState } from "react";


export default function SuggestionItem({ suggestion }) {
    const onSelect = () => {
        // 
    }
  return (
    <div
      className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40,0.5)] max-w-[342px] focus:bg-[rgb(40,40,40)] focus:outline-white/50 focus:shadow-2xl shadow-white outline-offset-0 outline-2"
      onClick={() => onselect}
    >
      {suggestion}
    </div>
  );
}
