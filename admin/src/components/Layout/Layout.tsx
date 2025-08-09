// Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sideBar/SideBar";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}