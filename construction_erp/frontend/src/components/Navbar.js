import React from "react";

function Navbar() {
  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">ERP System</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
}

export default Navbar;
