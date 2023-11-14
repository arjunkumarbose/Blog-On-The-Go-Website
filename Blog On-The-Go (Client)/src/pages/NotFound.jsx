import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="bg-gray-100 h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-bold text-red-600 text-center my-8">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-700 text-center">
          The page you are looking for does not exist!
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
