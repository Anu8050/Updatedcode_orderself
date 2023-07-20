import { Box } from "@mui/material";
import {
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { createPaymentIntent } from "../../services/stripePaymentService";
import { currency } from "../../store/constant";

function StripePaymentRequestButton() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState();
  const [clientSecret, setClientSecret] = useState();

  async function getPaymentIntent() {
    try {
      const response = await createPaymentIntent(100, currency);
      setPaymentIntent(response);
      setClientSecret(response.client_secret);
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      throw error;
    }
  }
  useEffect(() => {
    getPaymentIntent();
  }, []);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const pr = stripe.paymentRequest({
      country: "GB",
      currency: "eur",
      total: {
        label: "Demo total",
        amount: 100,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      wallets: ["applePay", "googlePay"],
      payment_method: {
        type: "card",
        card: {
          allowed_countries: ["US", "CA", "GB"],
          allowed_card_networks: ["visa", "mastercard", "amex"],
        },
      },
    });
    console.log(
      "🚀 ~ file: StripePaymentRequestButton.js:55 ~ useEffect ~ pr:",
      pr
    );

    // Show the Payment Request UI and handle payment completion
    pr.on("payment_method", async (ev) => {
      console.log(
        "🚀 ~ file: StripePaymentRequestButton.js:62 ~ pr.on ~ ev:",
        ev
      );
      // Confirm the Payment Intent on the server-side
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: ev.paymentMethod.id,
        }
      );

      if (error) {
        // Handle payment error
      } else {
        // Payment successful
        console.log("Payment successful");
        console.log("Payment Method ID:", paymentIntent.payment_method);
        console.log("Payment Intent ID:", paymentIntent.id);
        // Additional handling or confirmation logic...
      }

      // Complete the Payment Request UI
      ev.complete("success");
    });

    pr.canMakePayment().then((result) => {
      console.log(
        "🚀 ~ file: index.js:49 ~ pr.canMakePayment ~ result:",
        result
      );
      if (result) {
        setPaymentRequest(pr);
      }
    });

    if (paymentRequest) {
      console.log("🚀 ~ file: StripePaymentRequestButton.js:99 ~ useEffect ~ paymentRequest:", paymentRequest)
      return <PaymentRequestButtonElement options={{ paymentRequest }} />;
    }
  }, [stripe]);

  const options = {
    paymentRequest,
    style: {
      paymentRequestButton: {
        type: "default",
        // One of 'default', 'book', 'buy', or 'donate'
        // Defaults to 'default'

        theme: "dark",
        // One of 'dark', 'light', or 'light-outline'
        // Defaults to 'dark'

        height: "64px",
        // Defaults to '40px'. The width is always '100%'.
      },
    },
  };

  return (
    <Box sx={{ my: 2 }}>
      
      {paymentRequest && <PaymentRequestButtonElement options={{ options }} />}
    </Box>
  );
}

export default StripePaymentRequestButton;
