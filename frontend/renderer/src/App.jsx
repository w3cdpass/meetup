import "@fortawesome/fontawesome-free/css/all.min.css";
import { Theme } from "./theme/globalTheme";
function App() {
  return (
    <div className="w-full flex  gap-1 h-[100vh]">
      <div className="w-[15%] sm:w-[10%] md:w-[5%]" style={{backgroundColor:Theme.thirdBackgroundColor}}>
        <div className="flex items-center justify-between h-screen flex-col py-5">
          <div className="flex flex-col gap-5 text-xl">
            <i className="fa-solid fa-bars" ></i>
            <i className="fa-solid fa-message" style={{ color: Theme.button.active}}></i>
            <i className="fa-solid fa-video" style={{ color: Theme.button.inactive}}></i>
            <i className="fa-solid fa-users-line" style={{ color: Theme.button.inactive}}></i>
          </div>
          <div className="flex flex-col gap-3 text-xl ">
            <i className="fa-solid fa-user"></i>
            <i className="fa-solid fa-gear"></i>
          </div>
        </div>
      </div>

      <div className="w-[100%] md:w-[30%]   py-5" style={{backgroundColor:Theme.secondaryBackgroundColor}}>
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
            style={{backgroundColor: Theme.searchInout}}
          />
          <div className=" p-1 rounded" style={{backgroundColor:Theme.searchInout}}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

        <div className="px-5 flex items-start justify-between " style={{backgroundColor:Theme.onchat.active}}>
          <div className="flex">
            <img
              className="w-15 mix-blend-multiply "
              src={"/profile.svg"}
              alt=""
            />
            <div>
              <p className="py-2 text-lg">Hello Bro wher are u ??</p>
            </div>
                  </div>
                  <span>4:40pm</span>
        </div>
      </div>

      <div className="hidden md:flex w-[65%] p-1.5  py-5  justify-center items-center " style={{backgroundColor:Theme.primaryBackgroundColor}}>
        <div className="flex justify-center">
          <div className="w-full">
          <img className="w-full" src={'/logo.svg'} alt="meetup logo"/>
          <p className="text-2xl text-center text- font-semibold " style={{color: Theme.primaryTextColor}}>"Type, Send, Smile – No Fuss Messaging."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
