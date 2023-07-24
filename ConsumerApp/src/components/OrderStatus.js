import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getOrderInfo } from "../services/menuService";

//order progress bar
const OrderProgressBar = ({ completed, total }) => {
  const result = (completed / total) * 100;
  const percentage = Math.round(result);

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "250px",
      }}
    >
      <Box style={{ width: "100%", display: "flex" }}>
        <Box
          style={{
            width: `${percentage}%`,
            height: "20px",
            backgroundColor: "#FC8019",
          }}
        />
        <Box
          style={{
            width: `${100 - percentage}%`,
            height: "20px",
            backgroundColor: "lightgray",
          }}
        />
      </Box>
      {percentage >= 0 && (
        <Box style={{ width: "5%", marginLeft: "5px" }}>
          <strong>{`${percentage}%`}</strong>
        </Box>
      )}
    </Box>
  );
};

function OrderStatus() {
  var completedOrders = 0;
  var totalOrders = -1;
  var count = 0;
  const navigate = useNavigate();
  const handleViewOrder = () => {
    navigate("/dashboard/view-order");
  };
  const [orderInfo, setOrderInfo] = React.useState();
  React.useEffect(() => {
    var result = getOrderInfo(localStorage.getItem("restaurantId"));
    result.then((data) => {
      setOrderInfo(data);
    });
  }, []);
  console.log(orderInfo);
  if (orderInfo) {
    orderInfo.map((info) => {
      totalOrders = info.menuItems.length;
      count = info.menuItems.filter((menu) => menu.orderStatus === "Completed");
    });
  }
  completedOrders = count.length;

  // const backToCart = () => {
  //   navigate("/dashboard/cart");
  // };
  return (
    <>
      <Box
        style={{
          display: "flex",
          backgroundColor: "gray",
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Typography
          style={{ fontSize: "70px", color: "#FC8019", fontWeight: "700" }}
        >
          OrderSelf
        </Typography>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "340px",
            height: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          {/* <ArrowBackIcon
            sx={{
              fontSize: "2rem",
              color: "white",
              marginRight: "auto",
              border: "1px solid #FC8019",
              backgroundColor: "#FC8019",
              borderRadius: "50%",
              marginTop: "-10px",
              marginLeft: "5px",
            }}
            onClick={backToCart}
          /> */}
          <AccessTimeFilledIcon
            style={{ fontSize: "150px", marginTop: "-40px" }}
          />
          <Box style={{ width: "250px" }}>
            <OrderProgressBar completed={completedOrders} total={totalOrders} />
          </Box>
          <strong>your Order is in Progress</strong>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FC8019" }}
            onClick={handleViewOrder}
          >
            View Order
          </Button>
        </Box>
      </Box>
    </>
  );
}
export default OrderStatus;
