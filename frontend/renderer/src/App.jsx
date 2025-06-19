import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar_One from "./components/Sidebar_1";
import Sidebar_Two from "./components/Sidebar_2";
function App() {
  return (
    <div className="w-full flex  gap-1 h-[100vh]">
      <Sidebar_One/>
      <Sidebar_Two openMessageBox={'hee'}/>
    </div>
  );
}

export default App;
