import React, { useState, useEffect } from "react";
import {
  CardElement,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import { Box, Button, Dialog, DialogTitle, Typography } from "@mui/material";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import {
  createCheckoutSession,
  createPaymentIntent,
} from "../../services/stripePaymentService";
import StripeCheckout from "./StripeCheckout";
import StripePaymentRequestButton from "./StripePaymentRequestButton";
import StripeExpressCheckoutElement from "./StripeExpressCheckoutElement";
import StripePaymentElement from "./StripePaymentElement";
import StripeCardElement from "./StripeCardElement";
import { currency } from "../../store/constant";

const StripePayments = ({ amount, orderInfo }) => {
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
      handlePostPaymentIntent(response.client_secret);
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      throw error;
    }
  }

  async function handlePostPaymentIntent(client_secret) {
    if (stripe && client_secret) {
      await stripe
        .retrievePaymentIntent(client_secret)
        .then(({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case "succeeded":
              NotificationManager.success("Payment succeeded!");
              break;
            case "processing":
              NotificationManager.info("Your payment is processing.");
              break;
            case "requires_payment_method":
              NotificationManager.error("Please confirm your payment method");
              break;
            default:
              NotificationManager.error("Something went wrong.");
              break;
          }
        });
    }
  }

  useEffect(() => {
    getPaymentIntent();
  }, [amount]);

  return (
    <>
      <StripeCheckout amount={amount} orderInfo={orderInfo} />
      {/* <StripePaymentRequestButton /> */}
      {/* <StripeExpressCheckoutElement /> */}
      {/* <StripePaymentElement /> */}
      {/* <StripeCardElement /> */}
    </>
  );
};

export default StripePayments;
