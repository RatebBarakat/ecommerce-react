import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="container mx-auto grid grid-cols-1 border
       hover:shadow-lg md:!grid-cols-2 lg:!grid-cols-4 gap-6">
        <Link to="/user/categories" className="dashboard-link">
          <div className="dashboard-link-content">
            <span className="dashboard-link-text">Categories</span>
          </div>
        </Link>
      </div>
    </>
  );
}
