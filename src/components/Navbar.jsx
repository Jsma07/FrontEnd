import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavbarItems } from "./consts/navbarItems";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import SettingsMenu from "./consts/sesion";
import Notifications from "@mui/icons-material/NotificationsNone";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",

  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "white",
  borderRadius: "10px",
  color: "black",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerComponent = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openCategory, setOpenCategory] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#FFFEF1" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              backgroundColor: "#FFE0E3",
              "&:hover": {
                backgroundColor: "#F291B5",
                color: "white",
              },
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <img
            src="/jacke.png"
            alt="logo"
            style={{ width: "48px", height: "48px", marginRight: "16px" }}
          />
          <Typography variant="h6" noWrap component="div">
            Jacke Nail
          </Typography>
          <div style={{ marginLeft: "auto" }}></div>
          <Notifications
            sx={{
              backgroundColor: "#FFE0E3",
              padding: "20px", // Ajusta el valor de padding según tus preferencias
              borderRadius: "10px",
              color: "black",
              fontSize: "40px",
              marginRight: "20px",
              "&:hover": {
                backgroundColor: "#F291B5",
                color: "white",
              },
            }}
          />

          <SettingsMenu />
        </Toolbar>
      </AppBar>
      <DrawerComponent
        variant="permanent"
        open={open}
        classes={{ paper: "drawer-paper" }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <List>
          {NavbarItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                button
                onClick={() => handleCategoryClick(item.id)}
                sx={{
                  borderRadius: "10px",
                  backgroundColor:
                    openCategory === item.id ? "#EFD4F5" : "#EFD4F5",
                  mt: 1,
                  "&:hover": {
                    backgroundColor: open ? "#8C09FF" : "#8C09FF",
                    color: open ? "white" : " white",
                    "& .MuiListItemIcon-root .MuiSvgIcon-root": {
                      color: "white !important", // Forzar el color blanco con !important
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {openCategory === item.id ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </ListItem>
              {openCategory === item.id && item.subitems && (
                <List sx={{ pl: 1, paddingRight: "10px" }}>
                  {item.subitems.map((subitem) => (
                    <ListItem
                      key={subitem.id}
                      button
                      onClick={() => navigate(subitem.route)}
                      sx={{
                        paddingLeft: "15px",
                        paddingRight: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#EFD4F5",
                        mt: 1,
                        "&:hover": {
                          backgroundColor: "#8C09FF",
                          color: "white",
                          "& .MuiListItemIcon-root .MuiSvgIcon-root": {
                            color: "white !important", // Forzar el color blanco con !important
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "40px" }}>
                        {subitem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subitem.label} />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </DrawerComponent>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {openCategory && (
          <DrawerHeader>
            {/* Aquí puedes renderizar el contenido que quieras mostrar cuando se selecciona una categoría */}
            <Typography variant="h5">
              Contenido de la categoría seleccionada
            </Typography>
          </DrawerHeader>
        )}
      </Box>
    </Box>
  );
}
