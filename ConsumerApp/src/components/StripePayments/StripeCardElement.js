import { Box, Button } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";

function StripeCardElement() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Create payment method using Stripe API
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.log(
      "🚀 ~ file: StripePaymentElement.js:21 ~ handleSubmit ~ result:",
      result
    );

    if (result.error) {
      // Handle error
      console.error(result.error);
    } else {
      // Handle successful payment method creation
      console.log(result.paymentMethod);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button
          type="submit"
          disabled={!stripe}
          disableElevation
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Pay with Card
        </Button>
      </form>
    </Box>
  );
}

export default StripeCardElement;
