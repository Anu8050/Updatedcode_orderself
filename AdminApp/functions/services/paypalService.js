/* eslint-disable */

const axios = require("axios");
const paypalConfig = require("../config/paypal-config.json");
const admin = require("firebase-admin");
const db = admin.firestore();
const fetch = require("node-fetch");

const getPaypalAccessToken = async () => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const requestBody = "grant_type=client_credentials";
  const authString = Buffer.from(
    `${paypalConfig.clientId}:${paypalConfig.clientSecret}`
  ).toString("base64");

  try {
    const response = await axios.post(
      `${paypalConfig.api_baseURL}/v1/oauth2/token`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`,
          "Access-Control-Allow-Origin": "*",
          "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
        },
      }
    );

    if (response.status === 200) {
      const accessToken = response.data.access_token;
      console.log(`Bearer ${accessToken}`);
      return `Bearer ${accessToken}`;
    } else {
      throw new Error(response.data.error_description);
    }
  } catch (error) {
    throw error;
  }
};

const createPaypalOrder = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const url = `${paypalConfig.api_baseURL}/v2/checkout/orders`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  const requestBody = data;
  try {
    const response = await axios.post(url, requestBody, { headers });
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const capturePayment = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const orderID = data.orderID;
  const url = `${paypalConfig.api_baseURL}/v2/checkout/orders/${orderID}/capture`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  const requestBody = null;
  try {
    const response = await axios.post(url, requestBody, { headers });
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalService.js:76 ~ capturePayment ~ error:",
      error
    );
    throw error;
  }
};

const isPaypalVerified = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const url = `${paypalConfig.api_baseURL}/v1/customer/partners/${paypalConfig.partnerId}/merchant-integrations?tracking_id=${data.trackingId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  try {
    const response = await axios.post(url, {}, { headers });
    if (response?.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log("🚀 ~ file: paypalService.js:36 ~ createOrder ~ err:", err);
  }
};

const createPartnerReferral = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const url = `${paypalConfig.api_baseURL}/v2/customer/partner-referrals`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  const requestBody = data;
  try {
    const response = await axios.post(url, requestBody, { headers });
    if (response?.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log(
      "🚀 ~ file: paypalService.js:96 ~ createPartnerReferral ~ err:",
      err
    );
  }
};

async function updateDocument(collectionName, documentId, newData) {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const res = await docRef.update(newData);
    // console.log("Document updated successfully.", res);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

async function confirmSellerVerification(
  sellerData,
  merchantId,
  merchantIdInPayPal
) {
  if (sellerData.payments_receivable) {
    const newObj = { paypalPaymentsReceivable: sellerData.payments_receivable };
    await updateDocument("restaurantInfo", merchantId, newObj);
  }
  if (sellerData.primary_email_confirmed) {
    const newObj = {
      paypalPrimaryEmailConfirmed: sellerData.primary_email_confirmed,
    };
    await updateDocument("restaurantInfo", merchantId, newObj);
  }
  if (sellerData.oauth_third_party) {
    const newObj = { paypalOauthThirdParty: sellerData.oauth_third_party };
    await updateDocument("restaurantInfo", merchantId, newObj);
  }
  if (merchantIdInPayPal) {
    const newObj = { merchantIdInPayPal };
    await updateDocument("restaurantInfo", merchantId, newObj);
  }
}

const sellerOnBoardStatus = async (data) => {
  console.log("🚀 ~ file: paypalService.js:172 ~ sellerOnBoardStatus ~ data:", data)
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const partnerId = paypalConfig.partnerId;
  const sellerMerchantId = data.merchantIdInPayPal;
  console.log("🚀 ~ file: paypalService.js:178 ~ sellerOnBoardStatus ~ sellerMerchantId:", sellerMerchantId)
  const trackingId = data.trackingId;
  console.log("🚀 ~ file: paypalService.js:180 ~ sellerOnBoardStatus ~ trackingId:", trackingId)
  const apiUrl = `${paypalConfig.api_baseURL}/v1/customer/partners/${partnerId}/merchant-integrations/${data.merchantIdInPayPal}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  const requestBody = null;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    });    
    if (response.ok) {
      const sellerData = await response.json();
      console.log

      confirmSellerVerification(
        sellerData,
        trackingId,
        sellerMerchantId
      );
      return sellerData;
    } else {
      console.log("Request failed with status:", response.status);
      return null;
    }
  } catch (err) {
    console.log(
      "🚀 ~ file: paypalService.js:117 ~ sellerOnboardingStatus ~ err:",
      err
    );
  }
  // try {
  //   const response = await axios.get(apiUrl, requestBody, { headers });
  //   console.log("🚀 ~ file: paypalService.js:215 ~ sellerOnBoardStatus ~ response:", response)
  //   if (response?.data) {
  //     confirmSellerVerification(
  //       response.data,
  //       trackingId,
  //       sellerMerchantId
  //     );
  //     return response.data;
  //   }
  //   return null;
  // } catch (err) {
  //   console.log(
  //     "🚀 ~ file: paypalService.js:117 ~ sellerOnboardingStatus ~ err:",
  //     err
  //   );
  // }
};

module.exports = {
  getPaypalAccessToken,
  createPaypalOrder,
  capturePayment,
  isPaypalVerified,
  createPartnerReferral,
  sellerOnBoardStatus,
};
