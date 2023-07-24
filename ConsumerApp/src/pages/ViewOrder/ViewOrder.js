import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListSubheader,
  Paper,
  TextField,
  Typography,
  Alert,
  Dialog, DialogTitle, DialogContent,DialogActions,DialogContentText,
  Link
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonWrapper from "../../components/PayPalPayments";
import StepperComponent from "../../components/StepperComponent";
import { resetCart } from "../../redux/cartSlice";
import {
  getMenuItemsById,
  getOrderInfo,
  getPaymentInfo,
  updatePayByCash,
} from "../../services/menuService";
import { updateCheckOutTrue,updateTipAmount } from "../../services/orderService";
import "./ViewOrder.scss";
import { TimePickerToolbar } from "@mui/x-date-pickers";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { currencyFormat } from "../../store/constant";
import StripePayments from "../../components/StripePayments";
import { createCheckoutSession } from "../../services/stripePaymentService";
import Payments from "../../components/Payments";
import DoneIcon from '@mui/icons-material/Done';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';

function ViewOrder() {
  const theme = useTheme();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [orderInfo, setOrderInfo] = React.useState();
  const [subtotal, setSubtotal] = React.useState();
  const [vatAmount, setVatAmount] = React.useState();
  const [showTipValue, setShowTipValue] = React.useState(false);
  const [tipValue, setTipValue] = React.useState(0);
  const [grandTotal, setGrandTotal] = React.useState(0);
  const [myData, setMyData] = React.useState([]);

  const [isPayByCash, setIsPayByCash] = React.useState();
  const [isPaypal, setIsPaypal] = React.useState();
  const [isGooglePay, setIsGooglePay] = React.useState();
  const [isPaymentAdvance, setIsPaymentAdvance] = React.useState();
  const [showComponent, setShowComponent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [severity, setSeverity] = React.useState('info');
  const [showPopup, setShowPopup] = React.useState(false);
  
  const tableNumber = localStorage.getItem("tableNumber");
  const restaurantId = localStorage.getItem("restaurantId");
  const orderInfoId  = localStorage.getItem("orderInfo-id");
  const dispatch = useDispatch();

  const promise = getPaymentInfo(restaurantId);
  promise.then((data) => {
    setIsPayByCash(data.payByCashEnabled);
    setIsPaypal(data.paypalEnabled);
    setIsGooglePay(data.gPayApplePayEnabled);
    setIsPaymentAdvance(data.paymentInAdvanceEnabled);
  });

  React.useEffect(() => {
    // getPaymentInfo();
    let result = getOrderInfo(localStorage.getItem("restaurantId"));
    result.then((data) => {
      setOrderInfo(data);
      const currentOrder = data.filter(data=> data.id == orderInfoId);      
      console.log(currentOrder)      
      if(currentOrder.length > 0){
        if(currentOrder[0].tipAdded != undefined){
          if(currentOrder[0].tipAdded > 0){
            setShowTipValue(true)
          }
          setTipValue(currentOrder[0].tipAdded);
      }
      }                  
      setShowComponent(true);
      setMyData(Object.values(orderedItems));
      calculateSubTotalAndVat(Object.values(orderedItems));
      setLoading(true);
    });
 
    // setTimeout(() => {
      // Update state with the object data
      
      // setLoading(true);
    // }, 1000);

    // setTimeout(() => {
    //   setLoading(true);
    // }, 2000);
    // return () => {
    //   clearTimeout(timeoutId);
    // }
  }, [showComponent]);

  let orderedItems = [];
  if (orderInfo) {
    // console.log("🚀 ~ file: ViewOrder.js:79 ~ ViewOrder ~ orderInfo:", orderInfo)
    orderInfo.map((info) => {      
      info.menuItems.map((item) => {
        let promise = getMenuItemsById(item.menuInfoId);
        promise.then((data) => {
          orderedItems = [
            ...orderedItems,
            { ...data, orderStatus: info.status, quantity: item.qty },
          ];
        });
      });
    });
  }

  const calculateSubTotalAndVat = (menuItems) => {
    let sum = 0;
    let vat = 0;
    for (const item of menuItems) {
      if (item.foodPrice) {
        const foodPrice = parseFloat(item.foodPrice.replace(" €", ""));
        sum += foodPrice * item.quantity;
        vat = (sum * item.vatPercent.replace('%',''))/100;
      }
    }
    
    vat = vat.toFixed(2);
    sum = sum.toFixed(2)-vat;

    setSubtotal(sum);
    setVatAmount(vat);
    return sum;
  };

  const handleTipChange = (event) => {
    let tip = parseFloat(event.target.value);
    setTipValue(tip);
    // setMessage(`Are you sure you want to add a tip amount of ${tip} € ?`)
    //existing code
    setShowTipValue(false);
  };

  React.useEffect(() => {
    updateGrandTotal();
  }, [subtotal]);

  const updateGrandTotal = () => {
    let total = parseFloat(subtotal) + parseFloat(vatAmount) + (tipValue || 0);
    total = total.toFixed(2);
    setGrandTotal(total);
  };

  const handlePayCash = () => {
    setShowMessage(true);
    updatePayByCash(restaurantId,tableNumber,"initiated");
    // updateCheckOutTrue(orderInfoId);
    dispatch(resetCart());
    setTimeout(() => {
      navigate(
        `/check-in/${restaurantId}/${tableNumber}`
      );
    }, 6000);
  };

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    let grandTotal = 0;
    let sum = 0;
    for (const item of myData) {
      if (item.foodPrice) {
        const foodPrice = parseFloat(item.foodPrice.replace(" €", ""));
        sum += foodPrice * item.quantity;
      }
      sum = sum.toFixed(2);
    }
    grandTotal =
      parseFloat(sum) + parseFloat(vatAmount) + (tipValue || 0);
    grandTotal = grandTotal.toFixed(2);
    return { totalPrice, totalQuantity, grandTotal };
  };
  
  const handleKeyPress = (event) => {
    if (isNaN(Number(tipValue))) {
      setShowTipValue(false);
    }
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Check if key pressed is a number
    if (!/^\d+$/.test(keyValue)) {
      event.preventDefault();
      return;
    }

    // Check if input value is negative
    if (event.target.value.startsWith("-")) {
      event.preventDefault();
      return;
    }

    // Check if input value contains special characters
    if (!/^[0-9]*$/.test(event.target.value + keyValue)) {
      event.preventDefault();
      return;
    }
  };

  const handleAddMore = () => {
    navigate(
      `/dashboard/foodmenu/${restaurantId}/${tableNumber}`
    );
  };

  const onRemoveTip = () => {
    updateTipAmount(0, orderInfoId);
    setTipValue(0);
    setShowTipValue(false);
    let total = parseFloat(subtotal) + parseFloat(vatAmount);
    total = total.toFixed(2);
    setGrandTotal(total);
  };
  const [showMessage, setShowMessage] = React.useState(false);
  const handleClose = () => {
    setShowPopup(false);
  };

  const { v4: uuidv4 } = require("uuid");
  function generateUUID() {
    const uuid = uuidv4();
    return uuid;
  }
  const generatedUUID = generateUUID();

  const handleAddTip = () => {
    if(tipValue > 0){
      setShowPopup(true);
      // existing code
      // setShowTipValue(true);
      // updateGrandTotal();
    }
  };

  const handleOkClick = () =>{
   const promise = updateTipAmount(tipValue, orderInfoId);
   promise.then(data =>{
    // console.log(data);
    if(data){
     setShowTipValue(true);
     updateGrandTotal();
     handleClose();
    }
   })  
  }
  return (
    <>    
      <Dialog
        open={showPopup}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title" style={{  padding: "1rem" }} >
          <h2>Add Tip Confirmation</h2>
        </DialogTitle>
        <DialogContent style={{borderTop:"1px solid #fc8019",marginTop:"-1rem"}}>
          <p style={{ color: "gray" }}>Are you sure you want to add a tip amount of <strong>{tipValue} €</strong>?</p>
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3} sx={{ marginTop: 8, paddingBottom: 8 }}>
        <Grid item xs={12} sm={6}>
          {loading ? (
            myData.map((item) => (
              <>
                <Card sx={{ my: "6px" }} variant="outlined" >
                  <CardContent>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Box>
                        <Typography variant="h4" component="div">
                          {item.foodName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                        >
                          {item.foodCategoryName}
                        </Typography>
                      </Box>
                      <Chip
                        label={`Table No: ${tableNumber}`}
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    {/* {item.orderStatus === "Pending" && (
                      <StepperComponent x={0} />
                    )}
                    {item.orderStatus === "Completed" && (
                      <StepperComponent x={3} />
                    )}
                    {item.orderStatus === "Processing" && (
                      <StepperComponent x={2} />
                    )} */}                    

                  <StepperComponent x={item.orderStatus === "In Progress" ? 0 : 2} />
                  </CardActions>
                </Card>
              </>
            ))
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
          <Paper sx={{ position: "sticky", top: "92px" }}>
            <List>
              <ListSubheader>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{  p: 2, bgcolor: theme.palette.grey[100] }}
                >
                  <Typography variant="h3">
                    <strong>Order Summary</strong>
                  </Typography>
                </Box>
              </ListSubheader>
              <Divider sx={{ mt: .5 }} orientation="horizontal" />
              {myData && (
                <ListItem>
                  <Box
                    sx={{
                      height: "100%",
                      maxHeight: "400px",
                      overflowY: "auto",
                      overflowX: "hidden",
                      width: "100%",
                    }}
                  >
                    <Box>
                      <table
                        style={{
                          border: "2px dashed #ccc",
                          margin: "8px 1px",
                          padding: "8px",
                          width: "100%",
                        }}
                      >
                        <thead>
                          <tr >
                            <th style={{ width: "150px"}}>Food Name</th>
                            <th style={{textAlign:"right"}}>Qty</th>
                            <th style={{textAlign:"right"}}>Price €</th>
                            <th style={{textAlign:"right"}}>Tax</th>
                            <th style={{textAlign:"right"}}>Amount €</th> 
                          </tr>
                        </thead>
                        {myData?.map((item, index) => {
                          if (item.foodPrice) {
                            let foodPrice = parseFloat(
                              item.foodPrice.replace(" €", "")
                            );
                            return (
                              <tbody key={{ generatedUUID }}>
                                <tr>
                                  <td>{item.foodName}</td>
                                  <td style={{textAlign:"right"}}>{item.quantity}</td>
                                  <td style={{textAlign:"right"}}>{(foodPrice-(((foodPrice*item.vatPercent.replace('%',''))/100))).toFixed(2)}</td>
                                  <td style={{textAlign:"right"}}>{(((foodPrice*item.vatPercent.replace('%',''))/100).toFixed(2)*item.quantity).toFixed(2)}</td>                  
                                  <td style={{textAlign:"right"}}>
                                    {(foodPrice * item.quantity).toFixed(2)}
                                  </td>                                 
                                </tr>
                              </tbody>
                            );
                          } else return null;
                        })}
                      </table>
                    </Box>
                    <Box style={{ textAlign: "right" }}>
                      <Button variant="text" onClick={handleAddMore}>
                        Add More
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              )}
              <Divider />
              <Box sx={{ bgcolor: theme.palette.grey[50], p: 1 }}>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ py: 1, pl: 1, justifyContent: "flex-start" }}
                >
                  Would you like to add some tip to porter?
                </Typography>
                <ListItem sx={{ px: 1 }}>
                  <Box
                    style={{
                      width: "100%",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TextField
                      id="number-input"
                      label="Enter tip amount"
                      type="tel"
                      value={tipValue || ""}
                      onChange={handleTipChange}
                      sx={{ width: "100%" }}
                    />
                    <Button
                      type="submit"
                      disableElevation
                      variant="contained"
                      color="primary"
                      onClick={handleAddTip}
                      sx={{
                        ml: 1,
                        width: "100%",
                        maxWidth: "130px",
                        minHeight: "50px",
                      }}
                      startIcon={<AddBoxIcon/>}
                    >
                      Add Tip
                    </Button>
                  </Box>
                </ListItem>
              </Box>
              <Divider />
              <ListItem sx={{ py: 2 }}>
                <Typography variant="h4" color="secondary">
                  To Pay
                </Typography>
              </ListItem>

              <ListItem
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0,
                  pr: 3,
                }}
              >
                <Typography variant="h5">Sub Total</Typography>
                <Typography variant="h5">
                  <strong>€ {subtotal?.toFixed(2)}</strong>
                </Typography>
              </ListItem>
              <ListItem
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1,
                  pr: 3,
                }}
              >
                <Typography variant="h5">Tax</Typography>
                <Typography variant="h5">
                  <strong>€ {vatAmount}</strong>
                </Typography>
              </ListItem>
              {showTipValue && (
                <ListItem
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0,
                    pr: 3,
                  }}
                >
                  <Typography variant="h5">Tips</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={onRemoveTip} size="small" sx={{ mr: 2 }}>
                      Remove
                    </Button>
                    <Typography variant="h5">
                      <strong>€ {tipValue}</strong>
                    </Typography>
                  </Box>
                </ListItem>
              )}
              <ListItem sx={{ mt: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    width: "100%",
                    py: 2,
                    px: 1,
                    bgcolor: theme.palette.grey[100],
                  }}
                >
                  <Typography variant="h5">Total</Typography>
                  <Typography variant="h5">
                    <strong>€ {(parseFloat(grandTotal) || 0.0).toFixed(2)}</strong>
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Payments grandTotal={grandTotal} orderInfo={orderInfo} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default ViewOrder;
