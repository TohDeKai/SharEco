import React from "react";
import Button from "@mui/material/Button";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
const Home = () => {
  return (
    <ThemeProvider theme={styles.shareCoTheme}>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
      </div>
    </ThemeProvider>
  );
};

export default Home;
