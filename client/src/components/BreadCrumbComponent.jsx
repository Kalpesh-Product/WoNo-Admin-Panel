import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BreadCrumbComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract and process the path, excluding 'app' for display purposes
  const pathSegments = location.pathname
    .split("/") // Split the path into segments
    .filter((segment) => segment && segment !== "app" && segment !== "dashboard"); // Remove empty segments and exclude '/app'

  // Generate breadcrumb links
  const breadcrumbs = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;

    // Build the navigation path
    const path = pathSegments.slice(0, index + 1).join("/");
    const isDirectAppPath = location.pathname.startsWith(`/app/${path}`) && !location.pathname.includes("/dashboard");
    const fullPath = isDirectAppPath ? `/app/${path}` : `/app/dashboard/${path}`;

    // Capitalize for display
    const displayText = segment
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize for display

    return isLast ? (
      <Typography key={index} color="text.primary">
        {displayText}
      </Typography>
    ) : (
      <Link
        key={index}
        underline="hover"
        color="inherit"
        onClick={() => navigate(fullPath)} // Navigate using the determined fullPath
        style={{ cursor: "pointer" }}
      >
        {displayText}
      </Link>
    );
  });

  return (
    <div className="rounded-t-md">
      <Breadcrumbs
        separator="›"
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-ol": {
            fontSize: "1rem !important", // For the entire ordered list
            color: "#1E3D73",
          },
          "& .MuiBreadcrumbs-li": {
            fontSize: "0.9rem !important", // For all list items
          },
          "& .MuiBreadcrumbs-li .MuiTypography-root": {
            fontSize: "0.9rem !important", // For active Typography-based breadcrumb
            color: "#1E3D73 !important",
          },
          "& .MuiBreadcrumbs-separator": {
            margin: "0 1rem", // Add margin around the separator
          },
        }}
      >
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
};

export default BreadCrumbComponent;
