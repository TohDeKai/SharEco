import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("../signin");
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
