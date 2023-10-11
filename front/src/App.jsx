import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from "./contexts/auth";
import GuestLayout from "./layouts/GuestLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./views/Home";
import Login from "./views/Login";
import { useContext } from "react";
import { GuestRoute,ProtectedRoute } from "./auth";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<GuestRoute children={<Login />} />}/>
            <Route path="/dashboard" element={<ProtectedRoute children={<><h1>dashboard</h1></>}/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
