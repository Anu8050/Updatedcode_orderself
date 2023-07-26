import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import * as constants from "../constants";
import config from "../services/firebaseConfig";

export const startListeningToCollection = async ( restaurantId, setOrders, handleNewOrder, setIsLoading) => {
  const collectionRef = collection(config.db, constants.INDIVIDUAL_ORDERS);
  const querySnapshot = onSnapshot( query(collectionRef, where("restaurantId", "==", restaurantId)),
    async (snapshot) => {
      try {
        const orderDetails = await getOrderDetails(snapshot, handleNewOrder);
        await updateOrderDetailsWithMenuNames(orderDetails);
        await updateOrderDetailsWithPorterDetails(restaurantId, orderDetails);
        setIsLoading(false);
        setOrders(orderDetails);
      } catch (error) {
        console.log("Error retrieving order details:", error);
      }
    },
    (error) => {
      console.log("Error retrieving documents:", error);
    }
  );
  return () => querySnapshot();
};

const getOrderDetails = async (snapshot, handleNewOrder) => {
  const orderDetails = [];
  snapshot.forEach((doc) => {
    const newOrder = {
      ...doc.data(),
      id: doc.id,
    };
    if (!orderDetails.some((order) => order.id !== newOrder.id)) {
      handleNewOrder(newOrder);
    }
    orderDetails.push(newOrder);
    console.log(
      "🚀 ~ file: orderService.js:52 ~ snapshot.forEach ~ orderDetails:",
      orderDetails
    );
  });
  return orderDetails;
};

const updateOrderDetailsWithMenuNames = async (orderDetails) => {
  const menuIds = orderDetails.flatMap((item) =>
    item.menuItems.map((op) => op.menuInfoId)
  );
  menuIds.map((mid) => {
    const menuNames = getMenuItemsById(mid);
    menuNames.then((mname) => {
      orderDetails.forEach((ele) => {
        ele.menuItems.map((obj) => {
          if (obj.menuInfoId === mid) {
            obj.foodName = mname.foodName;
          }
        });
      });
    });
  });
};

const updateOrderDetailsWithPorterDetails = async ( restaurantId,orderDetails) => {
  const tableNumbers = orderDetails.flatMap((item) => item.tableId);
  const porterIds = await Promise.all(
    tableNumbers.map(
      async (tId) => await getAssignedPorter(restaurantId, parseInt(tId))
    )
  );
  const porterNames = await Promise.all(porterIds.map(getPorterNameById));
  orderDetails.forEach((order) => {
    const porterId = porterIds.find(
      (p, i) => tableNumbers[i] === order.tableId
    );
    order.porterId = porterId || "";
    order.porterName =
      porterNames.find((n, i) => porterIds[i] === porterId) || "";
  });
};

export const getMenuItemsById = async (id) => {
  try {
    if (!id) {
      return null;
    }
    const snap = await getDoc(doc(config.db, constants.MENU_INFO, id));
    if (snap.exists()) {
      const data = snap.data();
      if (data) {
        return data;
      }
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("No such document")) {
      console.log(`Menu item with ID ${id} does not exist`);
      return null;
    } else {
      console.log(`Error retrieving menu item with ID ${id}:`, error);
      throw error;
    }
  }
};

export const getPorterNameById = async (id) => {
  try {
    if (!id) {
      return null;
    }
    const snap = await getDoc(doc(config.db, constants.PORTER_INFO, id));
    if (snap.exists()) {
      return Promise.resolve(snap.data().firstName);
    } else {
      throw new Error("No such document");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("No such document")) {
      console.log(`Porter name with ID ${id} does not exist`);
      return null;
    } else {
      console.log(`Error retrieving porter name with ID ${id}:`, error);
      throw error;
    }
  }
};

export const getAssignedPorter = async (restaurantId, tableId) => {
  try {
    const q = query(
      collection(config.db, constants.TABLE_INFO),
      where("restaurantId", "==", restaurantId),
      where("tableNumber", "==", tableId)
    );
    const querySnapshot = await getDocs(q);
    const porterdetails = querySnapshot.docs.map((doc) => doc.data().porterId);
    if (porterdetails.length > 0) {
      return Promise.resolve(porterdetails[0]);
    } else {
      throw new Error("No assigned porter found");
    }
  } catch (e) {
    throw new Error(`Error retrieving assigned porter: ${e.message}`);
  }
};

//export const getOrderInfo = async (restaurantId) => {
// let tableNumber = [];
// try {
//   const q = query(
//     collection(config.db, constants.ORDER_INFO),
//     where("restaurantId", "==", restaurantId)
//   );
//   const querySnapshot = await getDocs(q);
//   let orderdetails = [];
//   let menuNames = [];
//   let menuIds = [];
//   querySnapshot.forEach((ordersDoc) => {
//     orderdetails = [
//       ...orderdetails,
//       {
//         ...ordersDoc.data(),
//         id: ordersDoc.id,
//       },
//     ];
//   });
//   orderdetails.map((itm) => {
//     itm.menuItems.map((op) => {
//       menuIds.push(op.menuInfoId);
//     });
//     tableNumber.push(itm.tableId);
//   });
//   tableNumber.map((tId) => {
//     const porter = getAssignedPorter(restaurantId, parseInt(tId));
//     porter.then((pId) => {
//       orderdetails.forEach((ele) => {
//         if (ele.tableId === tId) {
//           ele.porterId = pId;
//           if (pId === "") {
//             ele.porterName = "";
//           } else {
//             let v = getPorterNameById(pId);
//             v.then((d) => {
//               ele.porterName = d;
//             });
//           }
//           ele.menuItems.forEach((ele) => {
//             let x = getMenuItemsById(ele.menuInfoId);
//             x.then((x1) => {
//               menuNames.push(x1.foodName);
//             });
//           });
//         }
//       });
//     });
//   });
//   menuIds.map((mid) => {
//     const menuNames = getMenuItemsById(mid);
//     menuNames.then((mname) => {
//       orderdetails.forEach((ele) => {
//         ele.menuItems.map((obj) => {
//           if (obj.menuInfoId === mid) {
//             obj.foodName = mname.foodName;
//           }
//         });
//       });
//     });
//   });
//   console.log(
//     "🚀 ~ file: orderService.js:81 ~ getOrderInfo ~ orderdetails:",
//     orderdetails
//   );
//   return Promise.resolve(orderdetails);
// } catch (e) {
//   return e;
// }
//};

// export const getAssignedPorter = async (restaurantId, tableId) => {
//   try {
//     const q = query(
//       collection(config.db, constants.TABLE_INFO),
//       where("restaurantId", "==", restaurantId),
//       where("tableNumber", "==", tableId)
//     );
//     const querySnapshot = await getDocs(q);
//     let porterdetails = [];
//     querySnapshot.forEach((porterDoc) => {
//       porterdetails.push(porterDoc.data().porterId);
//     });
//     return Promise.resolve(porterdetails[0]);
//   } catch (e) {
//     return e;
//   }
// };

// export const getMenuItemsById = async (id) => {
//   try {
//     const snap = await getDoc(doc(config.db, "menuInfo", id));
//     if (snap.exists()) {
//       return Promise.resolve(snap.data());
//     } else {
//       console.log("No such document");
//       return [];
//     }
//   } catch (e) {
//     return e;
//   }
// };

// export const getPorterNameById = async (id) => {
//   try {
//     const snap = await getDoc(doc(config.db, "porterInfo", id));
//     if (snap.exists()) {
//       return Promise.resolve(snap.data().firstName);
//     } else {
//       console.log("No such document");
//       return [];
//     }
//   } catch (e) {
//     return e;
//   }
// };

export const fetchMultipleDocsData = async (docArray) => {
  const q = query(collection(config.db, constants.MENU_INFO),where("__name__", "in", docArray));
  const querySnapshot = await getDocs(q);
  const docsArray = querySnapshot.docs.map((doc) => ({
    data: doc.data().foodName,
  }));
  return docsArray;
};

export const fetchMultiplePorterName = async (docIdsArray) => {
  const q = query( collection(config.db, constants.PORTER_INFO),where("__name__", "in", docIdsArray));
  const querySnapshot = await getDocs(q);
  const docsArray = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
  return docsArray;
};

export const updateOrderStatus = async (orderInfoId, status) => {
  try {
    const docRef = doc(config.db, constants.INDIVIDUAL_ORDERS, orderInfoId);
    const updateStatus = await updateDoc(docRef, {
      status: status,
    });
    console.log("update order successful", updateStatus);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getPlacedOrders = async () => {
  try {
    const q = query(collection(config.db, "placedOrders"));
    const querySnapshot = await getDocs(q);

    let PlacedOrders = [];
    querySnapshot.forEach((PlacedOrdersDoc) => {
      PlacedOrders = [
        ...PlacedOrders,
        {
          ...PlacedOrdersDoc.data(),
          id: PlacedOrdersDoc.id,
        },
      ];
    });

    return Promise.resolve(PlacedOrders);
  } catch (e) {
    //This needs to be more elaborated.
    return e; //return an error object
  }
};

export const updateCheckOutTime = async (checkInfoId, checkoutTime) => {
  try {
    const docRef = doc(config.db, constants.CHECKIN_INFO, checkInfoId);
    const updateStatus = await updateDoc(docRef, {
      checkOutTime: checkoutTime,
    });
    console.log("checkout time updated", true);
  } catch (e) {
    alert(e);
    console.error("Error update failed: ", e);
  }
};

export const updateTipAmount = async (tipAmount,orderInfoId) => {
  try {
    const docRef = doc(config.db, constants.INDIVIDUAL_ORDERS , orderInfoId);
    const updateStatus = await updateDoc(docRef, {
      tipAdded: tipAmount,
    });
    // console.log("Tip amount updated", docRef.id);
    return(true);
  } catch (err) {
    console.error("Error adding document: ", err);
    return(err);
  }
};

export const checkTableActiveStatus = async (restaurantId,tableNumber) => {
  try {     
      const q = query(collection(config.db, constants.TABLE_INFO),
      where("restaurantId", "==", restaurantId), 
      where("tableNumber", "==", parseInt(tableNumber)),
      where("active", "==", true));       
      const querySnapshot = await getDocs(q);      
      return Promise.resolve((querySnapshot.size > 0) ? true: false);
  }catch(error){}
}