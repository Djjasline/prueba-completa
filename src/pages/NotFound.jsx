import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-md border border-gray-300 shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
