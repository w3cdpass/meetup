import Sidebar_One from "../components/Sidebar_1";
import Sidebar_Two from "../components/Sidebar_2";
import { TypingProvider } from "../context/TypingContext";
import { SocketProvider } from "../context/SocketContext";
export default function MainApp() {

  
  return (
    <>
      <SocketProvider>
        <TypingProvider>
          <div className="flex">
            <Sidebar_One />
            <Sidebar_Two />
          </div>
      </TypingProvider>
      </SocketProvider>
    </>
  );
}
