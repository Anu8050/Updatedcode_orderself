import { Button } from "@mui/material";
import React from "react";
import { createCheckoutSession } from "../../services/stripePaymentService";
import { getPaymentInfo, updateTableStatusAndPaymentMode ,completeInvizualoOrderStatus} from "../../services/menuService";
import {updateCheckOutTime} from "../../services/orderService";
import { resetCart } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";




function StripeCheckout({ amount, orderInfo }) {
  const dispatch = useDispatch();

  const tableNumber = localStorage.getItem("tableNumber");
  const restaurantId = localStorage.getItem("restaurantId");
  const checkInfoId = localStorage.getItem("checkInInfo-id");

  const [isApplePayGooglePay, setsApplePayGooglePay] = React.useState();
  const promise = getPaymentInfo(restaurantId);
  promise.then((data) => {
    setsApplePayGooglePay(data.gPayApplePayEnabled);
  });
  const handleStripePayment = async () => {
    const priceId = "price_1N8zo1GSsOIqz09KLQTgkjws";
    const connectedAccountId = "acct_1N93cxGa3Eaz0m1M";
    createCheckoutSession(100, priceId, connectedAccountId).then((response) => {
      if (response && response.url) {
          const localStorageIds = JSON.parse(localStorage.getItem('orderIds'));
          localStorageIds.map((id)=>{
            const promise = completeInvizualoOrderStatus(id)
            promise.then((response)=>{
              console.log(response,"order status completed after payment succesfully")
            })
          })
          updateTableStatusAndPaymentMode(restaurantId,tableNumber,"Apple Pay/Google Pay");
          updateCheckOutTime(checkInfoId,new Date().toLocaleTimeString())
          dispatch(resetCart());  
        window.location.href = response.url;
      }
    });
  };

  return (
    <Button
      disableElevation
      fullWidth
      variant="contained"
      onClick={handleStripePayment}
      disabled={!isApplePayGooglePay}
      sx={{ my: 1,height:"2.8rem" }}
    >
      Apple Pay/Google Pay
    </Button>
  );
}

export default StripeCheckout;
