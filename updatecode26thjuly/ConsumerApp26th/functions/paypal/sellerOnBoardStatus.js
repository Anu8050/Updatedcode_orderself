const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const sellerOnBoardStatus = async (reqBody, response) => {
  const sellerOnBoardStatusResponse =
    await paypalService.sellerOnBoardStatus(reqBody);
  if (sellerOnBoardStatusResponse) {
    response.status(200).json(sellerOnBoardStatusResponse);
  }
};

exports.sellerOnBoardStatus = onRequest({ cors: ["http://localhost:3000",  "https://orderselfdb.web.app", "https://orderself-guest.web.app"] },async (req, res) => {
  await sellerOnBoardStatus(JSON.parse(req.body), res);
});