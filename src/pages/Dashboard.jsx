import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BarChart3 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Hero Section */}
      <div
        className="w-full h-64 relative overflow-hidden mb-10"
        style={{
           backgroundImage: `url('https://img.freepik.com/premium-photo/russian-kitchen-treasure_960396-172727.jpg?w=740')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            🍴 Kitchen Treasure
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Your shop visit and route optimization dashboard
          </p>
        </div>
      </div>
{/* 
    
  Page Title
      <h1 className="text-4xl font-thin font-roboto mb-10 text-gray-800">
        Dashboard
      </h1> */}
      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-11/12 max-w-4xl mt-12">
        {/* Route Planner Dashboard Section */}
        <Link
          to="/home"
          className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-10 hover:shadow-2xl transition-transform hover:-translate-y-1"
        >
          <MapPin className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Route Planner Dashboard
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Plan and optimize your daily shop visit routes efficiently.
          </p>
        </Link>

        {/* Monthly Total Distance Section */}
        <Link
          to="/dist"
          className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-10 hover:shadow-2xl transition-transform hover:-translate-y-1"
        >
          <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Monthly Total Distance
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            View the total distance covered by visits for each month.
          </p>
        </Link>
      </div>
    </div>
  );
}