import { useState } from "react";
import profile from "/profile.svg";
export function Messaging() {
  // const [dialog, setdialog] = useState(false);

  // function whenCLick() {
  //   setdialog(true);
  // }

  return (
    <>
      <div className="w-[65%] bg-gray-100 flex  flex-col ">
        <div className=" mt-10 flex justify-center items-center">
          <hr className="text-gray-300 w-full" />
          <div className="p-1 rounded-xl text-xs bg-gray-200 text-center absolute">
            <span className="p-1">16/12/25: Monday</span>
          </div>
        </div>

        {/* Profile View Client one */}
        <div className="px-5 py-5">
          <div className="flex gap-2  place-items-baseline">
            <img
              className="w-8  bg-amber-200 rounded-full "
              src={profile}
              alt=""
            />
            <span className="text-xs">4:89pm</span>
          </div>
          <div className="p-2 bg-gray-200 rounded-lg inline-block w-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex
            praesentium modi quaerat eveniet hic{" "}
          </div>
        </div>

        {/* Profile View Client Two */}
        <div className="flex flex-col place-items-end px-5 py-5 ">
          <div className="flex gap-2 place-items-baseline ">
            <img
              className="w-8  bg-amber-200 rounded-full "
              src={profile}
              alt=""
            />
            <span className="text-xs">4:89pm</span>
          </div>
          <div className="p-2 bg-gray-200 rounded-lg inline-block w-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex
            praesentium modi quaerat eveniet hic{" "}
          </div>
        </div>

        <div className="w-[64%] absolute bottom-0 bg-gray-200 p-4  ">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <li className="fa-solid  fa-paperclip"></li>
              <input
                className="outline-none w-xl"
                type="text"
                placeholder="Type here..."
              />
            </div>
            <div className="flex items-center">
            <li className="fa-solid fa-paper-plane"></li>
            </div>
            {/* <div className="flex items-center gap-3">
              <li className="fa-solid fa-link"></li>
              <li className="fa-solid fa-film"></li>
              <li className="fa-solid fa-mobile-button"></li>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
