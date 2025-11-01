import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import QRGenerator from "../pages/qr_generator/qr";
import QRScanner from "../pages/qr_scanner/qr_scanner";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";

import Club from "../pages/club/club";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qr_generator" element={<QRGenerator />} />
            <Route path="/qr_scanner" element={<QRScanner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/club" element={<Club />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    );
};

export default AppRoutes;
