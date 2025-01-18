// import React from 'react'

// const Popup = () => {
//   return (
//     <>
//     <div className="text-white relative left-[8vh] top-[16vh] m-auto">
//       <div className="w-[70vw] h-[56vh] bg-white"></div>
//     </div>
//     </>
//   )
// }

// export default Popup

import React, { useState } from "react";
import Popup from "./components/Popup";

const App = () => {
  const handleOnClick = () => {
    setCheck((prevCheck) => !prevCheck);
  };

  const [check, setCheck] = useState(true);

  return (
    <>
      <div className="h-100vh">
        <div className="map w-screen bg-slate-900">
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.ZPKuUY0mrE5VBDOS1oAuAQHaEF&pid=Api&P=0&h=180"
            className="h-screen"
            alt=""
          />
        </div>

   <div
  className={`transition-transform duration-500 ease-in-out bg-zinc-900 w-screen rounded-r-3xl rounded-l-3xl`}
  style={{
    transform: check ? "translateY(0%)" : "translateY(66%)", // Animates between two positions
    height: "100vh", // Keeps height static to prioritize transform animations
    position: "fixed", // Ensures the div stays fixed
    bottom: 0, // Anchors it to the bottom of the screen
  }}
>
          <div className="relative top-9">
            <div className="text-white relative left-28 top-10">
              Pickup: <span className="text-yellow-400"> DADAR </span>
            </div>
            <div className="text-white relative left-28 top-10">
              Destination: <span className="text-yellow-400"> VJTI </span>
            </div>
          </div>



          <div
            className={`transition-all duration-500 ease-in-out`}
            style={{
              height: check ? "56vh" : "0",
              overflow: "hidden",
            }}
          >
            {check && <Popup />}
          </div>



          <div className="">
            <button
              className="bg-yellow-500 p-2 relative top-[18vh] left-[4vw] text-xl font-bold px-32 rounded-3xl mt-3"
              onClick={handleOnClick}
            >
              {check ? "Back" : "Details"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
