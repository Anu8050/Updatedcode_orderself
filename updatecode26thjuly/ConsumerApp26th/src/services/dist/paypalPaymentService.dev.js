"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifySellerOnboardStatus = verifySellerOnboardStatus;
exports.isVerified = isVerified;
exports.createReferral = createReferral;
exports.capturePayPalPayment = exports.createPaypalOrder = exports.generatePaypalAccessToken = exports.encodeCredentials = void 0;

var _axios = _interopRequireDefault(require("axios"));

var menuService = _interopRequireWildcard(require("./menuService"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var encodeCredentials = function encodeCredentials(clientId, clientSecret) {
  var credentials = "".concat(clientId, ":").concat(clientSecret);
  var encoded = window.btoa(credentials);
  return encoded;
};

exports.encodeCredentials = encodeCredentials;

var generatePaypalAccessToken = function generatePaypalAccessToken(clientId, clientSecret) {
  var PAYPAL_BASE_URL, credentials, response, data;
  return regeneratorRuntime.async(function generatePaypalAccessToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          PAYPAL_BASE_URL = process.env.REACT_APP_PAYPAL_BASE_URL;
          credentials = encodeCredentials(clientId, clientSecret);
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("".concat(PAYPAL_BASE_URL, "/v1/oauth2/token"), {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic ".concat(credentials)
            },
            body: "grant_type=client_credentials"
          }));

        case 4:
          response = _context.sent;

          if (response.ok) {
            _context.next = 7;
            break;
          }

          throw new Error("Failed to generate PayPal access token");

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          data = _context.sent;
          localStorage.setItem("paypalAccessToken", data.access_token);
          return _context.abrupt("return", data.access_token);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.generatePaypalAccessToken = generatePaypalAccessToken;

var createPaypalOrder = function createPaypalOrder(currency, amount) {
  var restaurantId, restaurantInfo, BASE_URL, accessToken, apiUrl, orderData, response;
  return regeneratorRuntime.async(function createPaypalOrder$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          restaurantId = localStorage.getItem("restaurantId");
          _context2.next = 3;
          return regeneratorRuntime.awrap(menuService.getRestaurantInfo(restaurantId).then(function (restaurant) {
            return restaurant;
          }));

        case 3:
          restaurantInfo = _context2.sent;
          BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
          accessToken = localStorage.getItem("paypalAccessToken");
          apiUrl = "".concat(BASE_URL, "/createPaypalOrder");
          orderData = JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
              amount: {
                currency_code: currency,
                value: amount
              },
              payee: {
                merchantId: restaurantInfo.merchantIdInPayPal
              },
              payment_instruction: {
                disbursement_mode: "INSTANT",
                platform_fees: [{
                  amount: {
                    currency_code: currency,
                    value: "2.00"
                  }
                }]
              }
            }],
            payment_source: {
              paypal: {
                experience_context: {
                  payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                  payment_method_selected: "PAYPAL",
                  shipping_preference: "NO_SHIPPING",
                  user_action: "PAY_NOW",
                  return_url: "".concat(window.location.origin, "/dashboard/success"),
                  cancel_url: "".concat(window.location.origin, "/dashboard/cancel")
                }
              }
            }
          });
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(_axios["default"].post(apiUrl, orderData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken),
              "Access-Control-Allow-Origin": "*"
            }
          }));

        case 11:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](8);
          console.log("🚀 ~ file: paypalPaymentService.js:66 ~ createPaypalOrder ~ error:", _context2.t0);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 15]]);
};

exports.createPaypalOrder = createPaypalOrder;

var capturePayPalPayment = function capturePayPalPayment(data) {
  var BASE_URL, accessToken, apiUrl, orderData, response;
  return regeneratorRuntime.async(function capturePayPalPayment$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
          accessToken = localStorage.getItem("paypalAccessToken");
          apiUrl = "".concat(BASE_URL, "/capturePaypalPayment");
          orderData = JSON.stringify({
            orderID: data.orderID
          });
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(_axios["default"].post(apiUrl, orderData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken),
              "Access-Control-Allow-Origin": "*"
            }
          }));

        case 7:
          response = _context3.sent;
          console.log("🚀 ~ file: paypalPaymentService.js:102 ~ capturePayPalPayment ~ response:", response);
          return _context3.abrupt("return", response.data);

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](4);
          console.log("🚀 ~ file: paypalPaymentService.js:66 ~ createPaypalOrder ~ error:", _context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 12]]);
};

exports.capturePayPalPayment = capturePayPalPayment;

function verifySellerOnboardStatus(merchantData) {
  var PAYPAL_BASE_URL, accessToken, apiUrl, response, data;
  return regeneratorRuntime.async(function verifySellerOnboardStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("🚀 ~ file: paypalPaymentService.js:174 ~ verifySellerOnboardStatus ~ merchantData:", merchantData);
          PAYPAL_BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
          accessToken = localStorage.getItem("paypalAccessToken");
          apiUrl = "".concat(PAYPAL_BASE_URL, "/sellerOnBoardStatus");
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken)
            },
            body: JSON.stringify({
              trackingId: merchantData.merchantId,
              merchantIdInPayPal: merchantData.merchantIdInPayPal
            }),
            mode: "no-cors"
          }));

        case 7:
          response = _context4.sent;

          if (response.ok) {
            _context4.next = 10;
            break;
          }

          throw new Error("HTTP error! Status: ".concat(response.status));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          data = _context4.sent;
          console.log(data);
          _context4.next = 19;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](4);
          console.error("Error:", _context4.t0);

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 16]]);
}

function isVerified(trackingId) {
  var PAYPAL_BASE_URL, accessToken, apiUrl, response, data;
  return regeneratorRuntime.async(function isVerified$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          PAYPAL_BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
          accessToken = localStorage.getItem("paypalAccessToken");
          apiUrl = "".concat(PAYPAL_BASE_URL, "/sellerVerification");
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken)
            },
            body: JSON.stringify({
              trackingId: trackingId
            }),
            mode: "no-cors"
          }));

        case 6:
          response = _context5.sent;

          if (response.ok) {
            _context5.next = 9;
            break;
          }

          throw new Error("HTTP error! Status: ".concat(response.status));

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(response.json());

        case 11:
          data = _context5.sent;
          console.log("🚀 ~ file: paypalPaymentService.js:281 ~ isVerified ~ data:", data);
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](3);
          console.log("🚀 ~ file: paypalPaymentService.js:283 ~ isVerified ~ error:", _context5.t0);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 15]]);
}

function createReferral(trackingId, restaurantInfo, tableNumber) {
  var partnerReferralData, PAYPAL_BASE_URL, accessToken, apiUrl, response;
  return regeneratorRuntime.async(function createReferral$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          partnerReferralData = {
            email: restaurantInfo.emailId,
            preferred_language_code: "en-US",
            tracking_id: trackingId,
            partner_config_override: {
              return_url: "".concat(window.location.origin, "/check-in/").concat(trackingId, "/").concat(tableNumber)
            },
            operations: [{
              operation: "API_INTEGRATION",
              api_integration_preference: {
                rest_api_integration: {
                  integration_method: "PAYPAL",
                  integration_type: "THIRD_PARTY",
                  third_party_details: {
                    features: ["PAYMENT", "PARTNER_FEE"]
                  }
                }
              }
            }],
            legal_consents: [{
              type: "SHARE_DATA_CONSENT",
              granted: true
            }],
            products: ["EXPRESS_CHECKOUT"]
          };
          PAYPAL_BASE_URL = process.env.REACT_APP_CLOUD_FUNCTIONS_URL;
          accessToken = localStorage.getItem("paypalAccessToken");
          apiUrl = "".concat(PAYPAL_BASE_URL, "/createPartnerReferral");
          _context6.prev = 4;
          _context6.next = 7;
          return regeneratorRuntime.awrap(_axios["default"].post(apiUrl, partnerReferralData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken)
            }
          }));

        case 7:
          response = _context6.sent;
          return _context6.abrupt("return", response.data);

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](4);
          console.log("Error:", _context6.t0);

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 11]]);
}