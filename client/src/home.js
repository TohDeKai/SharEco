import React from "react";
import Button from "@mui/material/Button";

const Home = () => {
  // Define your logout function here
  const handleLogout = () => {
    // Implement your logout logic here
    // For example, clearing user session and redirecting to the login page
  };

  return (
    <div>
      <h1>Welcome</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        style={{ marginTop: "20px" }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Home;
