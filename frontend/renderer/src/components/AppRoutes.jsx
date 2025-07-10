// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MainApp from "./App";
import ProtectedRoute from "./ProctectedRoutes";
import App from "../App"; // your login screen
import PersonalInfo from "./Profile/PersonalInfo";

export default function AppRoutes({ clientId }) {
  return (
    <Routes>
      <Route path="/" element={<App clientId={clientId} />} />
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PersonalInfo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
