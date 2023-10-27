import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Permission } from "../../helpers/permissions";
import { AuthContext } from "../../contexts/auth";

export default function Dashboard() {
  const auth = useContext(AuthContext);
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {Permission.can(auth, "read-categories") && (
        <div
          className="container mx-auto grid grid-cols-1 border
        hover:shadow-lg md:!grid-cols-2 lg:!grid-cols-4 gap-6"
        >
          <Link to="/user/categories" className="dashboard-link">
            <div className="dashboard-link-content">
              <span className="dashboard-link-text">categories</span>
            </div>
          </Link>
        </div>
      )}
      {Permission.can(auth, "read-products") && (
        <div
          className="container mx-auto grid grid-cols-1 border
        hover:shadow-lg md:!grid-cols-2 lg:!grid-cols-4 gap-6"
        >
          <Link to="/user/products" className="dashboard-link">
            <div className="dashboard-link-content">
              <span className="dashboard-link-text">products</span>
            </div>
          </Link>
        </div>
      )}
      {Permission.can(auth, "read-tags") && (
        <div
          className="container mx-auto grid grid-cols-1 border
        hover:shadow-lg md:!grid-cols-2 lg:!grid-cols-4 gap-6"
        >
          <Link to="/user/tags" className="dashboard-link">
            <div className="dashboard-link-content">
              <span className="dashboard-link-text">tags</span>
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
