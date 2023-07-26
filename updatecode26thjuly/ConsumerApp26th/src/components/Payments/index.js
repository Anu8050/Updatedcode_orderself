import { Box, Button ,Alert, Dialog} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetCart } from "../../redux/cartSlice";
import { getPaymentInfo, updateTableStatusAndPaymentMode ,completeInvizualoOrderStatus} from "../../services/menuService";
import { updateCheckOutTime } from "../../services/orderService";
import PayPalPayments from "../PayPalPayments";
import StripePayments from "../StripePayments";
import PaymentsIcon from '@mui/icons-material/Payments';

function Payments({ grandTotal, orderInfo }) {
  const navigate = useNavigate();
  const tableNumber = localStorage.getItem("tableNumber");
  const restaurantId = localStorage.getItem("restaurantId");
  const [isPayByCash, setIsPayByCash] = React.useState();
  const [isPaypal, setIsPaypal] = React.useState();
  const [isGooglePay, setIsGooglePay] = React.useState();
  const [isPaymentAdvance, setIsPaymentAdvance] = React.useState();
  const [showMessage, setShowMessage] = React.useState(false);
  const orderInfoId  = localStorage.getItem("orderInfo-id");
  const checkInfoId  = localStorage.getItem("checkInInfo-id");

  const promise = getPaymentInfo(restaurantId);
  const dispatch = useDispatch();
  promise.then((data) => {
    setIsPayByCash(data.payByCashEnabled);
    setIsPaypal(data.paypalEnabled);
    setIsGooglePay(data.gPayApplePayEnabled);
    setIsPaymentAdvance(data.paymentInAdvanceEnabled);
  });

  const handlePayByCash = () => {
    const localStorageIds = JSON.parse(localStorage.getItem('orderIds'));
    localStorageIds.map((id)=>{
      const promise = completeInvizualoOrderStatus(id)
      promise.then((response)=>{
        console.log(response,"order status completed after payment succesfully")
      })
    })
    setShowMessage(true);
    updateTableStatusAndPaymentMode(restaurantId,tableNumber,"PayByCash-initiated");
    updateCheckOutTime(checkInfoId,new Date().toLocaleTimeString());
    dispatch(resetCart());
    setTimeout(() => {
      navigate(
        '/dashboard/success'
      );
    }, 4000);
  };

  const handleClose = () => {
    setShowMessage(false);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
      <PayPalPayments
          showSpinner={true}
          amount={grandTotal}
          orderInfo={orderInfo}
          isPaypal={isPaypal}
        />       
        {showMessage && (
                <Dialog open={true} onClose={handleClose}>
                  <Alert severity="success">
                    Pay by cash request is sent to the porter.
                    <br />
                    Please pay the bill amount to the porter.
                    <br />
                    Thank you for visiting us.
                  </Alert>
                </Dialog>
              )}
        <StripePayments amount={grandTotal} orderInfo={orderInfo} />
        <Button
          variant="contained"
          onClick={handlePayByCash}
          disableElevation
          disabled={!isPayByCash}
          fullWidth
          sx={{ my: 1, height:"2.8rem" }}
          endIcon={<PaymentsIcon />}
        >
          Pay by Cash
        </Button>
      </Box>
    </>
  );
}

export default Payments;
