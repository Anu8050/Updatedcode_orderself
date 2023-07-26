const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const sellerVerification = async (reqBody, response) => {
  const data = {
    trackingId: reqBody.trackingId,
  };
  const verifySellerResponse = await paypalService.isPaypalVerified(data);

  if (verifySellerResponse) {
    response.status(200).json({ data });
  }
};

exports.sellerVerification = onRequest({ cors: ["http://localhost:3000", "https://orderselfdb.web.app", "https://orderself-guest.web.app"] },async (req, res) => {
  const body = JSON.parse(req.body);
  await sellerVerification(body, res);
});
