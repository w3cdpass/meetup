import { useState } from "react";
import { Theme } from "../../../theme/globalTheme";
import Logo from "/logo.svg";
import profile from "/profile.svg";
import { Messaging } from "../../Message/Components/Message";

const fakeUser = [
  { id: 1, img: profile, name: "Rahul", msg: "hi! how are you." , timeLine:'3:34pm'},
  { id: 2, img: profile, name: "Kiran", msg: "fuck u bitch", timeLine:'3:34pm' },
  { id: 3, img: profile, name: "Rohan", msg: "Tiger is my fav animal", timeLine:'3:34pm' },
  { id: 4, img: profile, name: "Abishek", msg: "allah hu akbar", timeLine:'3:34pm' },
  { id: 5, img: profile, name: "Savita", msg: "hi! how are you.", timeLine:'3:34pm' },
  { id: 6, img: profile, name: "Nigam", msg: "i will killu", timeLine:'3:34pm' },
  { id: 7, img: profile, name: "Baljeet", msg: "frutti pine chale", timeLine:'3:34pm' },
  { id: 8, img: profile, name: "pie", msg: "hi! how are you.", timeLine:'3:34pm' },
  { id: 9, img: profile, name: "Lofar", msg: "1 2 ka 4", timeLine:'3:34pm' },
  { id: 10, img: profile, name: "Rohan", msg: "Tiger is my fav animal", timeLine:'3:34pm' },
  { id: 11, img: profile, name: "Abishek", msg: "allah hu akbar", timeLine:'3:34pm' },
  { id: 12, img: profile, name: "Savita", msg: "hi! how are you.", timeLine:'3:34pm' },
  { id: 13, img: profile, name: "Nigam", msg: "i will killu", timeLine:'3:34pm' },
  { id: 14, img: profile, name: "Baljeet", msg: "frutti pine chale", timeLine:'3:34pm' },

];
export function Sidebar_Two() {
  const [openMsg, setOpenMsg] = useState("");
  const [active, setActive] = useState(null);
  function openComponent(id) {
    setOpenMsg(true);
    setActive(id);
    console.log("onClick", id);
  }
  // const isActive = (element ) => element ===  fakeUser.forEach((ele) => ele.id);
  // console.log(isActive())
  return (
    <>
      <div
        className=" w-[100%] md:w-[30%] py-5"
        style={{ backgroundColor: Theme.secondaryBackgroundColor }}
      >
        <div className="flex justify-between px-5">
          <div className="flex gap-4">
            <p className="font-semibold">Chats</p>
            <p className="font-semibold">Streams</p>
          </div>
          <div>
            <i className="fa-solid fa-tower-broadcast"></i>
          </div>
        </div>
        <div className="flex justify-center px-4  items-center gap-1">
          <input
            className="w-full p-1 my-4 rounded"
            type="search"
            placeholder="Search Chats or Starts a new Chats"
            style={{ backgroundColor: Theme.searchInout }}
          />
          <div
            className=" p-1 rounded"
            style={{ backgroundColor: Theme.searchInout }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div
          className="overflow-hidden hover:overflow-y-auto scrollbar scrollbar-thin scrollbar-track-sky-200  scrollbar-thumb-blue-400 max-h-[calc(100vh-112px)] px-2"
          style={{ scrollbarGutter: 'stable' }}
        >
        {fakeUser.map((ele, index) => (
          <div
            onClick={() => openComponent(ele.id)}
            key={index}
            className="px-5 flex items-start justify-between mb-1"
            style={{
              backgroundColor: active === ele.id
                ? Theme.onchat.inactive
                : Theme.onchat.active,
              border: active === ele.id
                ? `1px solid ${Theme.onchat.borderColor}`: '',
            }}
          >
            <div className="flex ">
              <img className="w-15 mix-blend-multiply " src={ele.img} alt="" />
              <div className="">
                <span>{ele.name}</span>
                <p className="text-sm">{ele.msg}</p>
              </div>
            </div>
            <span>{ele.timeLine}</span>
          </div>
        ))}
          </div>
      </div>
      {!openMsg ? (
        <div
          className="hidden md:flex w-[65%] p-1.5  py-5  justify-center items-center "
          style={{ backgroundColor: Theme.primaryBackgroundColor }}
        >
          <div className="flex justify-center">
            <div className="w-full">
              <img className="w-full" src={Logo} alt="meetup logo" />
              <p
                className="text-2xl text-center text- font-semibold "
                style={{ color: Theme.primaryTextColor }}
              >
                "Type, Send, Smile – No Fuss Messaging."
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Messaging />
      )}
    </>
  );
}
