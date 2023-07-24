import axios from "axios";
import * as menuService from "./menuService";

export const encodeCredentials = (clientId, clientSecret) => {
  const credentials = `${clientId}:${clientSecret}`;
  const encoded = window.btoa(credentials);
  return encoded;
};

export const generatePaypalAccessToken = async (clientId, clientSecret) => {
  const PAYPAL_BASE_URL = process.env.REACT_APP_PAYPAL_BASE_URL;
  const credentials = encodeCredentials(clientId, clientSecret);
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error("Failed to generate PayPal access token");
  }
  const data = await response.json();
  localStorage.setItem("paypalAccessToken", data.access_token);
  return data.access_token;
};

export const createPaypalOrder = async (currency, amount) => {
  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantInfo = await menuService
    .getRestaurantInfo(restaurantId)
    .then((restaurant) => {
      return restaurant;
    });
  const BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${BASE_URL}/createPaypalOrder`;
  const orderData = JSON.stringify({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
        payee: {
          merchantId: restaurantInfo.merchantIdInPayPal
        },
        payment_instruction: {
          disbursement_mode: "INSTANT",
          platform_fees: [
            {
              amount: {
                currency_code: currency,
                value: "0.12",
              },              
            },
          ],
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          payment_method_selected: "PAYPAL",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${window.location.origin}/dashboard/success`,
          cancel_url: `${window.location.origin}/dashboard/cancel`,
        },
      },
    },
  });
  try {
    const response = await axios.post(apiUrl, orderData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalPaymentService.js:66 ~ createPaypalOrder ~ error:",
      error
    );
  }
};

export const capturePayPalPayment = async (data) => {
  const BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${BASE_URL}/capturePaypalPayment`;
  const orderData = JSON.stringify({ orderID: data.orderID });
  try {
    const response = await axios.post(apiUrl, orderData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(
      "🚀 ~ file: paypalPaymentService.js:102 ~ capturePayPalPayment ~ response:",
      response
    );
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalPaymentService.js:66 ~ createPaypalOrder ~ error:",
      error
    );
  }
};

export async function verifySellerOnboardStatus(merchantData) {
  console.log(
    "🚀 ~ file: paypalPaymentService.js:174 ~ verifySellerOnboardStatus ~ merchantData:",
    merchantData
  );
  const PAYPAL_BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/sellerOnBoardStatus`;
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        trackingId: merchantData.merchantId,
        merchantIdInPayPal: merchantData.merchantIdInPayPal,
      }),
      mode: "no-cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function isVerified(trackingId) {
  const PAYPAL_BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/sellerVerification`;
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        trackingId,
      }),
      mode: "no-cors",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "🚀 ~ file: paypalPaymentService.js:281 ~ isVerified ~ data:",
      data
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalPaymentService.js:283 ~ isVerified ~ error:",
      error
    );
  }
}

export async function createReferral(trackingId, restaurantInfo, tableNumber) {
  const partnerReferralData = {
    email: restaurantInfo.emailId,
    preferred_language_code: "en-US",
    tracking_id: trackingId,
    partner_config_override: {
      return_url: `${window.location.origin}/configure`,
    },
    operations: [
      {
        operation: "API_INTEGRATION",
        api_integration_preference: {
          rest_api_integration: {
            integration_method: "PAYPAL",
            integration_type: "THIRD_PARTY",
            third_party_details: {
              features: ["PAYMENT", "PARTNER_FEE"],
            },
          },
        },
      },
    ],
    legal_consents: [
      {
        type: "SHARE_DATA_CONSENT",
        granted: true,
      },
    ],
    products: ["EXPRESS_CHECKOUT"],
  };

  const PAYPAL_BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/createPartnerReferral`;

  try {
    const response = await axios.post(apiUrl, partnerReferralData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error:", error);
  }
}
