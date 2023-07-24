import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import * as payPalService from "../../services/paypalPaymentService";
import { currency } from "../../store/constant";
import {
  getPaymentInfo,
  updateTableStatusAndPaymentMode,
  completeInvizualoOrderStatus,
} from "../../services/menuService";
import{ updateCheckOutTime } from '../../services/orderService';
import { resetCart } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const style = { layout: "vertical" };

const PayPalPayments = ({ showSpinner, amount, isPaypal }) => {
  const navigate = useNavigate();
  const tableNumber = localStorage.getItem("tableNumber");
  const restaurantId = localStorage.getItem("restaurantId");
  const checkInfoId  = localStorage.getItem("checkInInfo-id");

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.REACT_APP_PAYPAL_CLIENT_SECRET;

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: "EUR",
      },
    });
  }, [showSpinner]);

  useEffect(() => {
    payPalService
      .generatePaypalAccessToken(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
      .then((response) => {
        console.log(
          "🚀 ~ file: ButtonWrapper.js:36 ~ payPalService.generatePaypalAccessToken ~ response:",
          response
        );
      });
  }, [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET]);

  const handleApprove = (paymentResponse) => {
    console.log("🚀 ~ file: index.js:49 ~ handleApprove ~ paymentResponse:", paymentResponse)
    if (paymentResponse.status === "COMPLETED") {
      NotificationManager.success(`Transaction completed`);
      const localStorageIds = JSON.parse(localStorage.getItem("orderIds"));
      localStorageIds.map((id) => {
        const promise = completeInvizualoOrderStatus(id);
        promise.then((response) => {
          console.log(
            response,
            "order status completed after payment succesfully"
          );
        });
      });
      updateTableStatusAndPaymentMode(
        restaurantId,
        tableNumber,
        "PayPal"
      );
      updateCheckOutTime(checkInfoId,new Date().toLocaleTimeString())
      dispatch(resetCart());
      setTimeout(() => {
        navigate("/dashboard/success");
      }, 4000);
    }
    else {
      NotificationManager.error(`Transaction failed`);
    }
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={!isPaypal}
        forceReRender={[amount, "EUR", style]}
        createOrder={(data, actions) => {
          return payPalService
            .createPaypalOrder("EUR", amount)
            .then((order) => {
              return order.orderId;
            });
        }}
        onApprove={function (data, actions) {
          return payPalService
            .capturePayPalPayment(data)
            .then((captureResponse) => {
              handleApprove(captureResponse);
            })
            .catch((error) => {
              NotificationManager.error(
                `Something went wrong. Error: ${error}`
              );
            });
        }}
        onError={(error) => {
          NotificationManager.error(`Something went wrong. Error: ${error}`);
        }}
        disableFunding={["credit", "debit"]}
      />
    </>
  );
};

PayPalPayments.propTypes = {};

PayPalPayments.defaultProps = {};

export default PayPalPayments;
