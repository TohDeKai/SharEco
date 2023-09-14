import React from "react";
import Button from "@mui/material/Button";
import Sidebar from "./sidebar";
import { styles } from "./styles";
import { ThemeProvider } from "@mui/material/styles";

const Users = () => {
  return (
    <ThemeProvider theme={styles.shareCoTheme}>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <div style={{ marginLeft: "240px", padding: "16px" }}>
          {/* Add your content here */}
          <h1>Welcome to the Home Page</h1>
          <p>This is additional content alongside the sidebar.</p>
          <Button variant="contained" color="primary">
            Click Me
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Users;
