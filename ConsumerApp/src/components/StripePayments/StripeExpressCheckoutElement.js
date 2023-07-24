import { Box } from "@mui/material";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";
import React from "react";

function StripeExpressCheckoutElement() {
  return (
    <Box sx={{ my: 2 }}>
      <div id="checkout-page">
        <ExpressCheckoutElement />
      </div>
    </Box>
  );
}

export default StripeExpressCheckoutElement;
