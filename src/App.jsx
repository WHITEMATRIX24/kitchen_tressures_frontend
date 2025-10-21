import React, { useState } from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MonthlyDistance from "./pages/MonthlyDistance";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
<>
<Routes>
   <Route path="/" element={<Login/>}></Route>
  <Route path="/home" element={<Home />}></Route>
  <Route path="/dist" element={<MonthlyDistance/>}></Route>
    <Route path="/dashboard" element={<Dashboard/>}></Route>

</Routes>
</>
  );
}