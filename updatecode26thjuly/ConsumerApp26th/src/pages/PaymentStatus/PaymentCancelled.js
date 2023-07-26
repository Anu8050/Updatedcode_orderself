import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderSelfLogo from "../../assets/images/orderself-logo.png"

function PaymentCancelled() {
  const tableNumber = localStorage.getItem("tableNumber");
  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantName = localStorage.getItem("restuarantName");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(
        `/dashboard/view-order`
      );
    }, 3000);
  }, []);

  return (
    <Paper sx={{ height: "100vh" }}>
      <center>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card variant="outlined" sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '300px'}}>
          <CardMedia
              sx={{ height:"100px",width:"150px", objectFit: 'contain'}}
              image={orderSelfLogo}
              title="green iguana"
            />
            <CardContent>
              <Typography variant="h4">Cancelled</Typography>
            </CardContent>
          </Card>
        </Box>
      </center>
    </Paper>
  );
}

export default PaymentCancelled;
