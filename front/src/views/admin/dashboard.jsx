import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Permission } from "../../helpers/permissions";
import { AuthContext } from "../../contexts/auth";

const DashboardLink = ({ to, text }) => (
  <div className="container mx-auto border hover:shadow-lg md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Link to={to} className="dashboard-link">
      <div className="dashboard-link-content p-4 bg-white rounded-lg">
        <span className="dashboard-link-text text-lg font-semibold">{text}</span>
      </div>
    </Link>
  </div>
);

export default function Dashboard() {
  const auth = useContext(AuthContext);

  const dashboardLinks = [
    { permission: "read-categories", route: "/user/categories", text: "Categories" },
    { permission: "read-products", route: "/user/products", text: "Products" },
    { permission: "read-tags", route: "/user/tags", text: "Tags" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardLinks.map(({ permission, route, text }) => (
          Permission.can(auth, permission) && (
            <DashboardLink key={permission} to={route} text={text} />
          )
        ))}
      </div>
    </div>
  );
}
