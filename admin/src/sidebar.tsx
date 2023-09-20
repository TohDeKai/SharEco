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
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

const Sidebar = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const auth = useAuthUser();

  // Adjust width of sidebar here
  const drawerWidth = 240;

  const handleLogout = () => {
    signOut();
    navigate("../signin");
  };

  // Menu items
  const customListItems = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
    },
    {
      text: "Rental",
      path: "/rental",
      icon: <ShoppingBasketOutlinedIcon />,
    },
    {
      text: "Users",
      path: "/users",
      icon: <PersonOutlinedIcon />,
    },
    {
      text: "Businesses",
      path: "/businesses",
      icon: <BusinessCenterOutlinedIcon />,
    },
    {
      text: "Listings",
      path: "/listings",
      icon: <NoteAltOutlinedIcon />,
    },
    {
      text: "Transactions",
      path: "/transactions",
      icon: <PaymentsOutlinedIcon />,
    },
  ];

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
            src={"/images/logos/logo light bg cropped.png"}
            width={175}
            height={43.75}
            style={{ marginBottom: "10%" }}
          />
          <title>Welcome back</title>
          <h3 style={{ marginTop: "0%", textTransform: "capitalize" }}>
            {auth()?.username}
          </h3>
        </Box>

        <Divider />
        <List>
          {customListItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
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
