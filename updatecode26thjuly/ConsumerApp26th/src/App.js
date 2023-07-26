import React, { useState, useEffect } from "react";
import "./App.css";

import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import Routes from "./routes";
import themes from "./themes";
import { NotificationContainer } from "react-notifications";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { currency } from "./store/constant";
import { useNavigate } from "react-router-dom";
import { react } from "@babel/types";
import * as payPalService from "./services/paypalPaymentService";
import Footer from "./components/Footer/Footer";
import DocumentMeta from "react-document-meta";

// function App() {
const App = () => {
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.REACT_APP_PAYPAL_CLIENT_SECRET;
  const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const customization = useSelector((state) => state.customization);
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  const options = {
    mode: "payment",
    amount: 100,
    currency: currency,
    captureMethod: "automatic",
    paymentMethodTypes: ["card"],
  };
  const initialPayPalOptions = {
    "client-id": PAYPAL_CLIENT_ID,
    currency: "EUR",
    intent: "capture",
    debug:"true"
  };

  const navigate = useNavigate();

  useEffect(() => {
    // function validateIds(){
    if (window.location.href.indexOf("check-in") <= -1) {
      //if it is not checkin page
      if (
        localStorage.getItem("customer-id") == null ||
        localStorage.getItem("checkInInfo-id") == null
      ) {
        if (
          localStorage.getItem("restaurantId") != null &&
          localStorage.getItem("tableNumber") != null
        ) {
          navigate(
            `/check-in/${localStorage.getItem(
              "restaurantId"
            )}/${localStorage.getItem("tableNumber")}`
          );
        }
      }
    }
    // }
    // validateIds();
  }, [
    localStorage.getItem("restaurantId"),
    localStorage.getItem("tableNumber"),
    localStorage.getItem("customer-id"),
    localStorage.getItem("checkInInfo-id"),
  ]);

  useEffect(() => {
    if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) generatePaypalAccessToken();
  }, [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET]);

  const generatePaypalAccessToken = () => {
    payPalService.generatePaypalAccessToken(
      PAYPAL_CLIENT_ID,
      PAYPAL_CLIENT_SECRET
    );
  };

  const meta = {
    title: "Orderself",
    meta: {
      charset: "utf-8",
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  };

  return (
    <>
      <React.Fragment>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NotificationContainer />
          <Elements stripe={stripePromise} options={options}>
            <PayPalScriptProvider options={initialPayPalOptions}>
              <DocumentMeta {...meta}>
                <Routes />
                <Footer />
              </DocumentMeta>
            </PayPalScriptProvider>
          </Elements>
        </ThemeProvider>
      </React.Fragment>
    </>
  );
};

export default App;
