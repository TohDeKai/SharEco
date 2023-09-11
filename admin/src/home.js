import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useAuthUser } from "react-auth-kit";

const Home = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const auth = useAuthUser();

  const handleLogout = () => {
    signOut();
    navigate("../signin");
  };

  console.log("user: ", auth().user);

  return (
    <div>
      <h1>Welcome {auth().username}</h1>

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
