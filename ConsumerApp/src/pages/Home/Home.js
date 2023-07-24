import "../Home/Home.scss";
import { ShoppingCart, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Typography from "@mui/material/Typography";

import ResponsiveAppBar from "../../components/ResponsiveAppBar/ResponsiveAppBar";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import FoodItemCard from "../../components/FoodItemCard/FoodItemCard";
import { getMenuItems } from "../../services/menuService";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled, alpha } from "@mui/material/styles";
import { AppBar, CircularProgress, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Home() {
  const params = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lengthOfMenuItems, setLengthOfMenuItems] = useState(true);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (localStorage.getItem("checkInInfo-id") != undefined) {
      localStorage.setItem("restaurantId", params.restaurantId);
      localStorage.setItem("tableNumber", params.tableNumber);
      const timeout = setTimeout(() => {
        fetchMenuItems();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  const fetchMenuItems = async (searchString) => {
    await getMenuItems(params.restaurantId, searchString).then((response) => {
      if (Object.keys(response).length <= 0) {
        setLengthOfMenuItems(false);
      } else {
        setLengthOfMenuItems(true);
      }
      setMenuItems(response);
      setLoading(true);
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = async (searchString) => {
    setValue(0);
    setSearchTerm(searchString);
    if (searchString) {
      await fetchMenuItems(searchString);
    } else {
      await getMenuItems(params.restaurantId).then((response) => {
        setMenuItems(response);
        setLoading(true);
      });
    }
  };

  const [loading, setLoading] = useState(false);

  const getTotalQuantity = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Box>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              margin: "16px auto 12px auto",
              zIndex: "1100",
              textAlign: "center",
              height: "44px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              maxWidth: { xs: "92%", sm: "854px" },
              position: "fixed",
              left: "50%",
              top: "32px",
              transform: "translate(-50%, 6px)",
            }}
          >
            <IconButton type="button" sx={{ p: "8px" }} aria-label="search">
              <SearchIcon sx={{ color: "#ccc", fontWeight: 100 }} />
            </IconButton>
            <InputBase
              sx={{ flex: 1 }}
              placeholder="Search your favorite food"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              inputProps={{ "aria-label": "Search your favorite food" }}
            />
          </Paper>
        </Box>
        <Box sx={{ width: "100%" }} color="secondary">
          {loading ? (
            lengthOfMenuItems ? (
              <>
                <AppBar
                  position="sticky"
                  sx={{
                    top: {
                      xs: "102px",
                      sm: "103px",
                      border: "1px solid #d5d5d5",
                      borderRadius: "5px",
                      backgroundColor:
                        theme.palette.background.paper + " !important",
                    },
                  }}
                  elevation={0}
                  color="primary"
                >
                  <Tabs
                    selectionFollowsFocus
                    variant="scrollable"
                    textColor="primary"
                    indicatorColor="primary"
                    value={value}
                    onChange={handleChange}
                    allowScrollButtonsMobile
                    scrollButtons="auto"
                    aria-label="food items"
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      "& .MuiTabs-indicator": {
                        height: "4px",
                      },
                    }}
                  >
                    {Object.keys(menuItems).map((tbName, index) => {
                      const isActive = index === value;
                      const fontWeight = isActive ? 600 : 300;
                      if (tbName == "undefined") {
                        tbName = "Others";
                      }
                      return (
                        <Tab
                          label={tbName}
                          {...a11yProps(index)}
                          style={{
                            color: "primary",
                            fontWeight: fontWeight,

                          }}
                          key={index}
                        />
                      );
                    })}
                  </Tabs>
                </AppBar>

                {Object.values(menuItems).map((menuItem, index) => {
                  return (
                    <TabPanel
                      value={value}
                      index={index}
                      key={index}
                      style={{ padding: "46px 0 100px 0" }}
                    >
                      {menuItem.map((item) => (
                        <FoodItemCard
                          key={item.id}
                          id={item.id}
                          title={item.foodName}
                          price={item.foodPrice}
                          image={item.imageUrl}
                          description={item.foodDescription}
                          tableNumber={params.tableNumber}
                          restaurantId={params.restaurantId}
                          comment={item.comment}
                        />
                      ))}
                    </TabPanel>
                  );
                })}
              </>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Typography
                  variant="body2"
                  style={{ fontSize: "1rem", color: "#ff0000" }}
                >
                  No menu items found!
                </Typography>
              </Box>
            )
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
        <Paper
          sx={{
            position: "fixed",
            bottom: 32,
            left: 0,
            right: 0,
            p: 1,
          }}
          elevation={2}
        >
          <BottomNavigation
            showLabels
            value={0}
            onClick={() => navigate("/dashboard/cart")}
            sx={{
              pointerEvents: cart.length <= 0 ? "none" : "auto",
              opacity: cart.length <= 0 ? "0.25" : "1",
            }}
          >
            <BottomNavigationAction
              label="Place Order"
              icon={
                <Badge badgeContent={getTotalQuantity() || 0} color="primary">
                  <LocalDiningIcon color="primary" />
                </Badge>
              }
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </React.Fragment>
  );
}

export default Home;
