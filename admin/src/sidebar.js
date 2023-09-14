import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

const Sidebar = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();

  // Adjust width of sidebar here
  const drawerWidth = 240;

  const handleLogout = () => {
    signOut();
    navigate("../signin");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      ></AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box paddingLeft={"8%"} paddingRight={"8%"}>
          <img
            src={require("./images/logos/logo light bg cropped.png")}
            width={175}
            height={43.75}
            style={{ marginBottom: "10%" }}
          />
          <h4>Welcome back</h4>
          <h3>(Insert Admin Username here)</h3>
        </Box>

        <Divider />
        <List>
          {[
            "Dashboard",
            "Rental",
            "Users",
            "Businesses",
            "Listings",
            "Transactions",
          ].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          size="medium"
          style={{
            marginLeft: "10%",
            marginRight: "10%",
            marginTop: "auto",
            marginBottom: "20%",
          }}
        >
          Log out
        </Button>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
