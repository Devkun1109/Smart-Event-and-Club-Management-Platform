import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import QRGenerator from "../pages/qr_generator/qr";
import QRScanner from "../pages/qr_scanner/qr_scanner";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qr_generator" element={<QRGenerator />} />
            <Route path="/qr_scanner" element={<QRScanner />} />
        </Routes>
    );
};

export default AppRoutes;
