import "@fortawesome/fontawesome-free/css/all.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContex.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/AppRoutes.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId);
if (!clientId) {
  console.error("Google Client ID is missing!");
}
const fbId = import.meta.env.VITE_FB_APP_ID;
console.log("Google Client ID:", fbId);
if (!fbId) {
  console.error("Google Client ID is missing!");
}
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes clientId={clientId} />
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
