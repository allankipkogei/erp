import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or is under construction.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Home size={20} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
