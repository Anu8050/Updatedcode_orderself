import React from "react";
import { Button, Typography, Box, Card, CardActions, CardContent, Paper  } from "@mui/material";
import { useParams ,useNavigate} from "react-router";
import orderselfLogo from "../../assets/images/orderself-logo.png";

import Success from '../../assets/images/success.png';

export default function CheckInCompleted() {
  const params = useParams();
  const navigate = useNavigate();

  const gotoFoodMenu = () => {
    setTimeout(()=>{
      navigate(`/dashboard/foodmenu/${params.restaurantId}/${params.tableNumber}`);
    },2000)
  };

  return (
    <React.Fragment>
      <Paper>
        <Box
          sx={{ height: "30vh", backgroundColor: "black",display: "grid",placeItems: "center",}}
        >
          <center>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                component="img"
                sx={{ height: 64 }}
                alt="OrderSelf"
                src={orderselfLogo}
              />
            </Box>
          </center>
        </Box>
        <Box
          sx={{height: "70vh",position: "relative",backgroundColor: "#eef2f6",}}
        >
          <Card
            style={{width: "100%",maxWidth: "360px",margin: "20px auto",maringTop: "-200px",position: "absolute",top: "-80px",left: "50%",transform: "translateX(-50%)",}}
          >
            <CardContent>
              <center>
                <Typography variant="h2" sx={{ m: 2 }}>Congratulations!</Typography>
                <Box
                    component="img"
                    sx={{ height: 64}}
                    alt="success"
                    src={Success}
                  />
                <Typography  sx={{ m:1,mb:2, color:"rgba(65, 67, 69, 0.80)", fontSize:"14px" }}>
                  You have just completed the check-in form
                </Typography>
                <Typography variant="h3" sx={{ m: 3 ,color:"rgba(65, 67, 69, 0.80)"}}>Before we start</Typography>
                <Box sx={{ m: 1, fontSize: "14px", lineHeight: "100%", color: "rgba(65, 67, 69, 0.80)", textAlign: "left" }}>
                  <ul  >
                    <li>You are responsible for your orders.</li><br/>
                    <li>For every order, you will be asked whether the order was intended.</li><br/>
                    <li>Please reach out to the porter for your queries.</li><br/>
                    <li>If an order that is placed is in progress, no corrections will be possible.</li><br/>
                  <li>All orders have to be paid by you.</li>
                </ul>
                </Box>

              </center>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                sx={{ width: "100%", mb: 2, mx: 1 ,mt:-1}}
                onClick={gotoFoodMenu}
              >
                Order your Food Now
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Paper>
    </React.Fragment>
  );
}
