import React from "react";
import Button from "@mui/material/Button";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";

const Home = () => {
  return (
    <div>
      <ThemeProvider theme={styles.shareCoTheme}>
        <Sidebar></Sidebar>
      </ThemeProvider>
    </div>
  );
};

export default Home;
