import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Typography,Link,Button
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderSelfLogo from "../../assets/images/orderself-logo.png"

function PaymentSuccess() {
  // const tableNumber = localStorage.getItem("tableNumber");
  // const restaurantId = localStorage.getItem("restaurantId");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {      
      localStorage.clear();            
    }, 1000);
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
          <Card
            variant="outlined"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: '300px'
            }}
          >
            <CardMedia
              sx={{ height:"100px",width:"150px", objectFit: 'contain'}}
              image={orderSelfLogo}
              title="green iguana"
            />
            <CardContent>
              <Typography variant="h4">Thank you for visiting. See you soon again!<br/>To check-in again, please scan the QR code on the table.</Typography>
              {/* <Link onClick={goToCheckIn} >Go to CheckIn Page</Link> */}
              <br/>
              {/* <Button variant="contained" style={{width:"150px"}} onClick={handleClose}>Close </Button> */}
            </CardContent>
          </Card>
        </Box>
      </center>
    </Paper>
  );
}

export default PaymentSuccess;
