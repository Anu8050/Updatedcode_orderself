"use strict";

var paypalService = require("../services/paypalService");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var sellerOnBoardStatus = function sellerOnBoardStatus(reqBody, response) {
  var sellerOnBoardStatusResponse;
  return regeneratorRuntime.async(function sellerOnBoardStatus$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(paypalService.sellerOnBoardStatus(reqBody));

        case 2:
          sellerOnBoardStatusResponse = _context.sent;

          if (sellerOnBoardStatusResponse) {
            response.status(200).json(sellerOnBoardStatusResponse);
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sellerOnBoardStatus = onRequest({
  cors: ["http://localhost:3000", "https://orderselfdb.web.app", "https://orderself-guest.web.app/"]
}, function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(sellerOnBoardStatus(JSON.parse(req.body), res));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});