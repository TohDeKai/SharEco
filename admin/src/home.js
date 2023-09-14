import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";

const Home = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();

  const handleLogout = () => {
    signOut();
    navigate("../signin");
  };

  return (
    <div>
      <ThemeProvider theme={styles.shareCoTheme}>
        <Sidebar></Sidebar>
        <h1>Welcome</h1>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          style={{ marginTop: "20px" }}
        >
          Logout
        </Button>
      </ThemeProvider>
    </div>
  );
};

export default Home;
