import { useState } from "react";
import { Theme } from "../../../theme/globalTheme";

export function Sidebar_One() {
    const [active, setActive] = useState(null);
    function handleClick(str) {
        setActive(str);
    }
    return (
        <div className="w-[15%] sm:w-[10%] md:w-[5%]" style={{ backgroundColor: Theme.thirdBackgroundColor }}>
            <div className="flex items-center justify-between h-screen flex-col py-5">
                <div className="flex flex-col gap-5  lg:text-xl text-sm ">
                    <i className="fa-solid fa-bars cursor-pointer"  ></i>
                    <i className="fa-solid fa-message cursor-pointer" title="Chats" onClick={() => handleClick('msg')} style={{ color: active === 'msg' ? Theme.button.active : Theme.button.inactive }}></i>
                    <i className="fa-solid fa-video cursor-pointer" title="Video calls"  onClick={() => handleClick('vid')} style={{ color: active === 'vid' ? Theme.button.active : Theme.button.inactive }}></i>
                    <i className="fa-solid fa-users-line cursor-pointer" title="Plugins"  onClick={() => handleClick('usr')} style={{ color: active === 'usr' ? Theme.button.active : Theme.button.inactive }}></i>
                </div>
                <div className="flex flex-col gap-3 lg:text-xl text-sm ">
                    <i className="fa-solid fa-user"></i>
                    <i className="fa-solid fa-gear"></i>
                </div>
            </div>
        </div>
    )
}