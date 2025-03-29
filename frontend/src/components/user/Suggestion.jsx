import { useState } from "react";


export default function SuggestionItem({ suggestion , onSelect}) {
  return (
    
    <div
      className="bg-[#333] w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white/50 outline-offset-0 outline-2 "
      // onClick={updateData}
    >
      {suggestion.description}
      {/* <hr/> */}
    </div>
  );
}
