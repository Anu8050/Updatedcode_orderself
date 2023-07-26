// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
  ListItemText,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import orderselfLogo from "../../assets/images/orderself-logo.png";
import "./ResponsiveAppBar";
import Search from "./Search";
import { useParams } from "react-router";
import * as menuService from "../../services/menuService";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const drawerWidth = 240;

function getStylingForPath(path) {
  return {
    margin: "8px",
    background: "#ffffff25",
    border: "1px solid #f9f9f930",
    borderRadius: "8px",
  };
}

function ResponsiveAppBar(props) {
  const location = useLocation();
  const params = useParams();
  const pages = [
    {
      id: 1,
      label: "View Cart",
      path: "/dashboard/cart",
      icon: <ShoppingCartOutlinedIcon />,
    },
    {
      id: 2,
      label: "View Orders",
      path: "/dashboard/view-order",
      icon: <RamenDiningOutlinedIcon />,
    },
    {
      id: 3,
      label: "Food Menu",
      path:
        "/dashboard/foodmenu/" +
        localStorage.getItem("restaurantId") +
        "/" +
        localStorage.getItem("tableNumber"),
      icon: <MenuBookIcon />,
    },
  ];

  const theme = useTheme();
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const getTotalQuantity = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  const { window } = props;
  const [customerName, setCustomerName] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [restaurantInfo, setRestaurantInfo] = React.useState([]);

  const navigateTo = (path) => {
    navigate(path);
    handleDrawerToggle();
  };

  React.useEffect(() => {
    console.log(
      "🚀 ~ file: ResponsiveAppBar.js:92 ~ ResponsiveAppBar ~ location.pathname:",
      location.pathname
    );
  }, [location.pathname]);

  React.useEffect(() => {
   const restaurantId = localStorage.getItem('restaurantId')
    if (restaurantId != undefined) {
      const result = menuService.getRestaurantInfo(restaurantId);
      result.then((restInfo) => {
        setRestaurantInfo(restInfo);
      });
    }

    const custName = menuService.getCustomerNameById(
      localStorage.getItem("customer-id")
    );
    custName.then((name) => {
      setCustomerName(name);
    });
  }, [localStorage.getItem("restaurantId")]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getStyling = (path) => getStylingForPath(path);
  const styling = getStyling(location.pathname);

  const drawer = (
    <Box>
      <Toolbar
        sx={{ backgroundColor: theme.palette.primary.dark }}
      >
        {restaurantInfo && (
          <List sx={{ px: 0, mb: 2 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar
                  alt="restuarant_logo"
                  src={
                    restaurantInfo
                      ? restaurantInfo.restaurantLogoUrl
                      : "/broken-image.jpg"
                  }
                ></Avatar>
              </ListItemAvatar>
            </ListItem>
            <Typography
              style={{ fontSize: "18px", color: "#fff", fontWeight: "600" }}
            >
              {restaurantInfo ? restaurantInfo.restaurantName : "Welcome"}
            </Typography>
          </List>
        )}
      </Toolbar>
      <Divider />
      <List>
        {pages.map((nav, index) => (
          <ListItem
            key={nav.id}
            disablePadding
            onClick={() => navigateTo(`${nav.path}`)}
          >
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  color: "white",
                },
                ...(location.pathname === nav.path ? getStyling(nav.path) : {}),
              }}
            >
              <ListItemAvatar sx={{ color: "#fff" }}>{nav.icon}</ListItemAvatar>
              <Typography sx={{ color: "#fff", fontWeight: 400 }} variant="h4">
                {nav.label}{" "}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List >
        <ListItem sx={{position:"fixed", bottom:0}}>
          <ListItemButton>
            <strong style={{color:"white"}}>OrderSelf</strong>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", bgcolor: theme.palette.secondary.dark }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: theme.palette.secondary.dark + " !important",
        }}
      >
        <Toolbar sx={{ p: 0 }}>
          <Container
            maxWidth="md"
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            {/* {location.pathname.includes("/dashboard/foodmenu/") ? null : (
              <IconButton edge="start" onClick={() => navigate(-1)}>
                <ArrowBackIcon color="primary" />
              </IconButton>
            )} */}
            {!props.hideComponent && (
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon color="primary" />
              </IconButton>
            )}
            <Link href="#">
              <Box
                component="img"
                sx={{ height: { xs: 42, sm: 54 } }}
                alt="Logo"
                src={orderselfLogo}
              />
            </Link>
            {!props.hideComponent &&
              localStorage.getItem("restaurantId") != undefined && (
                <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                {customerName && (
                  <Box>Welcome {customerName}</Box>
                )} 
                  <IconButton
                    onClick={() => navigate("/dashboard/cart")}
                    sx={{ ml: 2, mr: 1 }}
                  >
                    <Badge
                      badgeContent={getTotalQuantity() || 0}
                      color="primary"
                    >
                      <ShoppingCartIcon color="primary" />
                    </Badge>
                  </IconButton>
                </Box>
              )}
          </Container>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          backgroundColor: "#ccc",
          "& .MuiListItem-root:hover": {
            backgroundColor: "#aaa",
          },

          "& .MuiListItemText-root:hover span": {
            color: "#fff",
          },
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
export default ResponsiveAppBar;
