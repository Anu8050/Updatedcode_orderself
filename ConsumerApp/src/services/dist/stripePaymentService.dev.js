"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPaymentIntent = createPaymentIntent;
exports.createCheckoutSession = createCheckoutSession;

function createPaymentIntent(amount, currency) {
  var STRIPE_BASE_URL, STRIPE_SECRET_KEY, url, auth, response, data;
  return regeneratorRuntime.async(function createPaymentIntent$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          STRIPE_BASE_URL = process.env.REACT_APP_STRIPE_BASE_URL;
          STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;
          url = "".concat(STRIPE_BASE_URL, "/v1/payment_intents");
          auth = "Bearer ".concat(STRIPE_SECRET_KEY);
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: auth
            },
            body: new URLSearchParams({
              amount: amount,
              currency: currency
            }).toString()
          }));

        case 7:
          response = _context.sent;

          if (response.ok) {
            _context.next = 10;
            break;
          }

          throw new Error("Failed to create PaymentIntent");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          data = _context.sent;
          return _context.abrupt("return", data.client_secret);

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](4);
          // Handle error
          console.error("Error creating PaymentIntent:", _context.t0);
          throw _context.t0;

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 16]]);
}

function createCheckoutSession(amount, priceId, connectedAccountId) {
  var STRIPE_BASE_URL, STRIPE_SECRET_KEY, url, auth, data, response, responseData;
  return regeneratorRuntime.async(function createCheckoutSession$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          STRIPE_BASE_URL = process.env.REACT_APP_STRIPE_BASE_URL;
          STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;
          url = "".concat(STRIPE_BASE_URL, "/v1/checkout/sessions");
          auth = "Bearer ".concat(STRIPE_SECRET_KEY);
          data = new URLSearchParams();
          data.append("mode", "payment");
          data.append("line_items[0][price]", priceId);
          data.append("line_items[0][quantity]", "1");
          data.append("payment_intent_data[application_fee_amount]", amount);
          data.append("payment_intent_data[transfer_data][destination]", connectedAccountId);
          data.append("payment_intent_data[on_behalf_of]", connectedAccountId); // data.append("success_url", "http://localhost:3000/dashboard/success");
          // data.append("cancel_url", "http://localhost:3000/dashboard/cancel");

          data.append("success_url", "".concat(window.location.origin, "/dashboard/success"));
          data.append("cancel_url", "".concat(window.location.origin, "/dashboard/cancel"));
          _context2.prev = 13;
          _context2.next = 16;
          return regeneratorRuntime.awrap(fetch(url, {
            method: "POST",
            headers: {
              Authorization: auth,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: data
          }));

        case 16:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 19;
            break;
          }

          throw new Error("Request failed");

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(response.json());

        case 21:
          responseData = _context2.sent;
          console.log("responseData", responseData);
          return _context2.abrupt("return", responseData);

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](13);
          console.error(_context2.t0);

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[13, 26]]);
}