/* eslint-disable */

const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const createPaypalOrder = async (reqBody, response) => {
  const createOrderResponse = await paypalService.createPaypalOrder(reqBody);
  console.log("🚀 ~ file: createPaypalOrder.js:6 ~ createPaypalOrder ~ createOrderResponse:", createOrderResponse)
  if (createOrderResponse) {
    response.status(200).json({
      orderId: createOrderResponse?.id,
      status: createOrderResponse?.status,
    });
  }
};

exports.createPaypalOrder = onRequest(
  {
    cors: [
      "http://localhost:3000",
      "https://orderselfdb.web.app",
      "https://orderself-guest.web.app",
    ],
  },
  async (req, res) => {
    const body = JSON.stringify(req.body);
    await createPaypalOrder(JSON.parse(body), res);
  }
);
