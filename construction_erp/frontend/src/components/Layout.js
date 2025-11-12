import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
