import { Theme } from "../../../theme/globalTheme";

export function Sidebar_One() {
    return (
        <div className="w-[15%] sm:w-[10%] md:w-[5%]" style={{ backgroundColor: Theme.thirdBackgroundColor }}>
            <div className="flex items-center justify-between h-screen flex-col py-5">
                <div className="flex flex-col gap-5 text-xl">
                    <i className="fa-solid fa-bars" ></i>
                    <i className="fa-solid fa-message" style={{ color: Theme.button.active }}></i>
                    <i className="fa-solid fa-video" style={{ color: Theme.button.inactive }}></i>
                    <i className="fa-solid fa-users-line" style={{ color: Theme.button.inactive }}></i>
                </div>
                <div className="flex flex-col gap-3 text-xl ">
                    <i className="fa-solid fa-user"></i>
                    <i className="fa-solid fa-gear"></i>
                </div>
            </div>
        </div>
    )
}