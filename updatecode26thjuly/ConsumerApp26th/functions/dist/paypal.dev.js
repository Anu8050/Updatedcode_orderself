"use strict";

var helperFunctions = require("./helper");

var https = require("https");

var axios = require("axios");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var admin = require("firebase-admin");

var db = admin.firestore();
var partnerMerchantId = "BU9AC7AQ73H9Q"; // obtained from sb-7wipc26503454@business.example.com
// client Id and secret obtained from Platform Partner App - 5344651197937780686

var clientId = "Ac9lZ5VomxhnTrzo7X1SJLw-57KpwPJglOICJMF4a0e9k8-w-3uXSSimJ0bJ79ETUfnVSbkVTwnu8XQs";
var clientSecret = "EBypxvQYk8Z9dFn7_61XioB5oZacdx_XVWbpNxX-BHVCfGU4PfMeInd3ObkU2Zj7t2MgRSMHtWRdvvOi";

function generatePayPalAuthorization() {
  var requestBody, authString, response, accessToken;
  return regeneratorRuntime.async(function generatePayPalAuthorization$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requestBody = "grant_type=client_credentials";
          authString = Buffer.from("".concat(clientId, ":").concat(clientSecret)).toString("base64");
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", requestBody, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic ".concat(authString)
            }
          }));

        case 5:
          response = _context.sent;

          if (!(response.status === 200)) {
            _context.next = 11;
            break;
          }

          accessToken = response.data.access_token;
          return _context.abrupt("return", accessToken);

        case 11:
          throw new Error(response.data.error_description);

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](2);
          throw _context.t0;

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 14]]);
}

function confirmSellerVerification(sellerData) {
  return regeneratorRuntime.async(function confirmSellerVerification$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(sellerData.payments_receivable === true && sellerData.primary_email_confirmed === true && sellerData.oauth_third_party === true)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", "verified");

        case 4:
          return _context2.abrupt("return", "unverified");

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function updateDocument(collectionName, documentId, newData) {
  var docRef, res;
  return regeneratorRuntime.async(function updateDocument$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          docRef = db.collection(collectionName).doc(documentId);
          _context3.next = 4;
          return regeneratorRuntime.awrap(docRef.update(newData));

        case 4:
          res = _context3.sent;
          console.log("Document updated successfully.", res);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error("Error updating document:", _context3.t0);
          throw _context3.t0;

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function getSellerStatus(trackingId, merchantIdInPayPal) {
  var accessToken, options, response, status, newData, _newData;

  return regeneratorRuntime.async(function getSellerStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(generatePayPalAuthorization());

        case 2:
          accessToken = _context4.sent;
          options = {
            url: "https://api-m.sandbox.paypal.com/v1/customer/partners/".concat(partnerMerchantId, "/merchant-integrations/").concat(merchantIdInPayPal),
            method: "GET",
            headers: {
              Authorization: "Bearer ".concat(accessToken),
              "Content-Type": "application/json"
            }
          };
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(axios(options));

        case 7:
          response = _context4.sent;

          if (!(response.status === 200)) {
            _context4.next = 22;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(confirmSellerVerification(response.data));

        case 11:
          status = _context4.sent;

          if (!(status === "verified")) {
            _context4.next = 18;
            break;
          }

          newData = {
            merchantId: response.data.merchant_id,
            isPaypalVerified: true
          };
          _context4.next = 16;
          return regeneratorRuntime.awrap(updateDocument("restaurantInfo", trackingId, newData));

        case 16:
          _context4.next = 21;
          break;

        case 18:
          _newData = {
            merchantId: response.data.merchant_id,
            isPaypalVerified: false
          };
          _context4.next = 21;
          return regeneratorRuntime.awrap(updateDocument("restaurantInfo", trackingId, _newData));

        case 21:
          return _context4.abrupt("return", "status");

        case 22:
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](4);
          console.error(_context4.t0);
          throw _context4.t0;

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 24]]);
}

module.exports = onRequest(function _callee(req, res) {
  var body, resp;
  return regeneratorRuntime.async(function _callee$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          body = JSON.parse(req.body);
          _context5.next = 3;
          return regeneratorRuntime.awrap(getSellerStatus(body.trackingId, body.merchantIdInPayPal));

        case 3:
          resp = _context5.sent;
          res.status(200).json(resp);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
});