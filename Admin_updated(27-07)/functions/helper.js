/* eslint-disable */
const { getFirestore } = require("firebase-admin/firestore");
async function fetchRestaurantInfo(restaurantId) {
  const doc = await getFirestore()
    .collection("restaurantInfo")
    .doc(restaurantId)
    .get();
  return doc.data();
}
module.exports = { fetchRestaurantInfo };
