import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { AppDataProvider } from "./contexts/AppDataContext";

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Routes />
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
