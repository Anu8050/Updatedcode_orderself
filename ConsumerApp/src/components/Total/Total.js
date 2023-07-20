import React from "react";
import "./total.css";
import { useSelector } from "react-redux";
import * as menuService from "../../services/menuService";
import ShowSnackbar from "../../common/ShowSnackbar";
import {
  Button,
  Alert,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Divider,
  Dialog, DialogContent, DialogActions,DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cartSlice";
import { useTheme} from "@mui/material/styles";
import DoneIcon from '@mui/icons-material/Done';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CloseIcon from '@mui/icons-material/Close';


function Total() {
  const theme = useTheme();
  const tableNumber = localStorage.getItem("tableNumber");
  const restaurantId = localStorage.getItem("restaurantId");

  let documentIds = JSON.parse(localStorage.getItem('orderIds')) || [];

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const currency = "EUR";

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [propsMessage, setPropsMessage] = React.useState("");
  const [propsSeverityType, setPropsSeverityType] = React.useState("");
  React.useEffect(() => {
    const promise = menuService.getPaymentInfo(restaurantId);
  promise.then((data) => {
    setIsPayInAdvance(data.paymentInAdvanceEnabled);
  });
  }, [openSnackBar, cart]);

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.price * item.quantity;
    });
    return { totalPrice, totalQuantity };
  };

  const [orderCompleted, setOrderCompleted] = React.useState(false);
  const [isPayInAdvance, setIsPayInAdvance] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const placingOrders = () =>{
    if (cart.length === 0) {
      setOpenSnackBar(true);
      setPropsMessage("Please add cart items to confirm order!");
      setPropsSeverityType("error");
      return;
    }
    const cartItems = cart.map((m) => {
      return {
        menuInfoId: m.id,
        qty: m.quantity,
        orderStatus: "Pending",
        comment: m.comment !== undefined ? m.comment : "",
      };
    });

    // if (localStorage.getItem("orderInfo-id") == null) {
    //   console.log("adding orderinfo!");
    //   const result = menuService.addOrderInfo(
    //     tableNumber,
    //     restaurantId,
    //     cartItems
    //   );
    //   result.then((res) => {
    //     if (res) {
    //       // localStorage.setItem("orderInfo-id", res);
    //       menuService.AddPlacedOrder(res, restaurantId);
    //     }
    //   });
    //   const individualOrders = menuService.addIndividualOrders(
    //     tableNumber,
    //     restaurantId,
    //     cartItems
    //   );
    //   individualOrders.then((orders)=>{
    //      console.log("added successfully in addIndivisualOrders collection",orders)
    //      documentIds.push(orders);
    //      const stringifiedIds = JSON.stringify(documentIds);
    //      localStorage.setItem('orderIds', stringifiedIds);
    //   })
    // } 
    // else {
      const individualOrders = menuService.addIndividualOrders(
        tableNumber,
        restaurantId,
        cartItems
      );
      individualOrders.then((orders)=>{
         console.log("added again in addIndivisualOrders collection",orders)
         documentIds.push(orders);
         localStorage.setItem("orderInfo-id", orders);
         const stringifiedIds = JSON.stringify(documentIds);
         localStorage.setItem('orderIds', stringifiedIds);
      })
      ///to call new collection to store data
      // menuService.updateOrderInfo(
      //   localStorage.getItem("orderInfo-id"),
      //   localStorage.getItem("restaurantId"),
      //   cart
      // );
    // }

    // Reset cart
    setOrderCompleted(true);

    setTimeout(() => {
      dispatch(resetCart());
      navigate(`/dashboard/view-order`);
    }, 1000);
  }

  function handleOrderConfirmation() {
    if (isPayInAdvance) {
      setShowPopup(true);
    }
    else{
      placingOrders();
    }
  }
   
  // methods are not used 

  // const confirmButton = () => {
  //   let cartitems = [];
  //   if (cart.length > 0) {
  //     cart.map((m) => {
  //       cartitems.push({
  //         menuInfoId: m.id,
  //         qty: m.quantity,
  //         orderStatus: "Pending",
  //       });
  //     });
  //     console.log(localStorage.getItem("orderInfo-id"));
  //     if (localStorage.getItem("orderInfo-id") == null) {
  //       console.log("adding orderinfo!");
  //       const result = menuService.addOrderInfo(
  //         tableNumber,
  //         restaurantId,
  //         cartitems
  //       );
  //       result.then((res) => {
  //         if (res) {
  //           localStorage.setItem("orderInfo-id", res);
  //           NotificationManager.success(
  //             `Order Details Added Successfully`,
  //             "",
  //             5000,
  //             () => {
  //               alert("callback");
  //             }
  //           );
  //           menuService.AddPlacedOrder(res, restaurantId);
  //         }
  //       });
  //     } else {
  //       menuService.updateOrderInfo(
  //         localStorage.getItem("orderInfo-id"),
  //         localStorage.getItem("restaurantId"),
  //         cart
  //       );
  //     }
  //   } else {
  //     setOpenSnackBar(true);
  //     setPropsMessage("Please add cart items to confirm order!");
  //     setPropsSeverityType("error");
  //     NotificationManager.error(`Please add cart items to confirm order!`);
  //   }
  //   // reset cart
  //   setOrderCompleted(true);
  //   dispatch(resetCart());
  //   setTimeout(() => {
  //     navigate(`/dashboard/view-order`);
  //   }, 3000);
  // };

  // const handlePayCash = () => {
  //   console.log("hi");
  //   setOrderCompleted(true);
  //   dispatch(resetCart());
  //   setTimeout(() => {
  //     navigate(
  //       `/dashboard/foodmenu/${restaurantId}/${tableNumber}`
  //     );
  //   }, 3000);
  // };

  // const handleOrderStatus = () => {
  //   navigate("/dashboard/view-order");
  // };

  const handleOkClick = () => {
    placingOrders();  
  };
  const handleClose = () => {
    setShowPopup(false);
  };
  return (
    <>
     <Dialog
        open={showPopup}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title" style={{  padding: "1rem" }} >
          <h2>Payment In Advance</h2>
        </DialogTitle>
        <DialogContent style={{borderTop:"1px solid #fc8019",marginTop:"-1rem"}}>
          <p style={{ color: "gray" }}>Payment should be made in Advance. Once you have made the payment, kindly notify the porter. Upon confirmation, the porter will serve you the food</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} startIcon={<CloseIcon/>}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleOkClick}
            autoFocus
            startIcon={<DoneIcon />}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <List sx={{width: "100%"}}>
        <ListSubheader>
          <Box sx={{ mt: 1, p: 2, bgcolor: theme.palette.grey[100] }}>
            <Typography variant="h3" sx={{ mb: 1 }}>
              <strong> Cart Summary</strong>
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">
                Total (<strong>{getTotal().totalQuantity}</strong> items) :{" "}
              </Typography>
              <Typography variant="h5">
                <strong>€ {getTotal().totalPrice.toFixed(2)}</strong>
              </Typography>
            </Box>
          </Box>
        </ListSubheader>
        <Divider sx={{ mt: 2, mb: 1 }} orientation="horizontal" />
        <ListItem>
          <Button
            variant="outlined"
            onClick={handleOrderConfirmation}
            disableElevation
            fullWidth
            disabled={cart.length <= 0}
            startIcon ={<ShoppingCartCheckoutIcon/>}
          >
            Confirm Order
          </Button>
        </ListItem>
      </List>
      <Box className="total">
        {openSnackBar && (
          <ShowSnackbar
            message={propsMessage}
            severityType={propsSeverityType}
          />
        )}
        <Box style={{ display: "flex" }}>
          <Box>
            {orderCompleted && (
              <Alert severity="success">Your order is confirmed</Alert>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Total;
