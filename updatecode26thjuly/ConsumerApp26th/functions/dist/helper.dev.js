"use strict";

var _require = require("firebase-admin/firestore"),
    getFirestore = _require.getFirestore;

function fetchRestaurantInfo(restaurantId) {
  var doc;
  return regeneratorRuntime.async(function fetchRestaurantInfo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getFirestore().collection("restaurantInfo").doc(restaurantId).get());

        case 2:
          doc = _context.sent;
          return _context.abrupt("return", doc.data());

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  fetchRestaurantInfo: fetchRestaurantInfo
};