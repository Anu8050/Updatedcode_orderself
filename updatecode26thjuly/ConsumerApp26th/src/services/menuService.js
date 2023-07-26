import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  setDoc,
  Timestamp
} from "firebase/firestore";
import * as constants from "../constants";
import config from "../services/firebaseConfig";
// import menuInfo from './Models/index'
export const getMenuItems = async (restaurantId, searchText = "") => {  
  try {
    /*-------------------------------------------------------------------------------------------- */
    const q = query(collection(config.db, constants.MENU_INFO),where("restaurantId", "==", restaurantId));
    const querySnapshot = await getDocs(q);

    let menuItems = [];
    querySnapshot.forEach((menuItemDoc) => {
      menuItems = [
        ...menuItems,
        {
          ...menuItemDoc.data(),
          id: menuItemDoc.id,
        },
      ];
    });
    /*-------------------------------------------------------------------------------------------- */

    const q1 = query(
      collection(config.db, "foodCategory"),
      where("restaurantId", "==", restaurantId)
    );
    const querySnapshot1 = await getDocs(q1);

    let menuCategory = [];
    querySnapshot1.forEach((menuCategoryDoc) => {
      menuCategory = [
        ...menuCategory,
        {
          ...menuCategoryDoc.data(),
          id: menuCategoryDoc.id,
        },
      ];
    });

    menuItems.forEach((itm) => {
      itm.foodCategoryName = menuCategory.find(
        (x) => x.id === itm.foodCategory
      )?.foodCategory;
      itm.foodPrice = itm.foodPrice.replace(" ", "").replace("€", "");
    });

    if (searchText.trim() !== "") {
      menuItems = menuItems.filter(
        (word) =>
          word.foodName.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      );
    }

    var groupedFoodItems = menuItems.reduce((groups, item) => {
      const group = groups[item.foodCategoryName] || [];
      group.push(item);
      groups[item.foodCategoryName] = group;
      return groups;
    }, {});
    return groupedFoodItems; // Promise.resolve(finalData);
  } catch (e) {
    //This needs to be more elaborated.
    return e; //return an error object
  }
};

//   getFoodCategory based on restaurantId
export const getFoodCategory = async (restaurantId) => {
  try {
    const q = query(
      collection(config.db, constants.MENUCATEGORY_INFO),
      where("restaurantId", "==", restaurantId)
    );
    const querySnapshot = await getDocs(q);

    let menuCategory = [];
    querySnapshot.forEach((menuCategoryDoc) => {
      menuCategory = [
        ...menuCategory,
        {
          ...menuCategoryDoc.data(),
          id: menuCategoryDoc.id,
        },
      ];
    });

    return Promise.resolve(menuCategory);
  } catch (e) {
    console.error("Error occurred while fetching food category from getFoodCategory", e);
    //This needs to be more elaborated.
    return e; //return an error object
  }
};

// export const addOrderInfo = async (tableId, restaurantId, cart) => {
//   try {
//     let date = new Date();
//     const data = {
//       customerId: localStorage.getItem("customer-id"), //hardcoded
//       tableId: tableId,
//       restaurantId: restaurantId,
//       orderDate: Timestamp.fromDate(date),
//       checkedOut: "false", //hardcoded
//       menuItems: cart,
//       status: "In Progress",
//       checkinInfoId: localStorage.getItem("checkInInfo-id"),
//     };
//     const docRef = await addDoc(collection(config.db, "orderInfo"), data);
//     console.log("Document written with ID: ", docRef.id);
//     return docRef.id;
//   } catch (e) {
//     console.error("Error adding document: ", e);
//     return "error";
//   }
// };

export const getOrderInfo = async (id) => {
  try {
    const q = query(
      collection(config.db, constants.INDIVIDUAL_ORDERS),
      where("customerId", "==", localStorage.getItem("customer-id")),
      where("checkinInfoId", "==", localStorage.getItem("checkInInfo-id")),
      where("restaurantId", "==", id)
    );
    const querySnapshot = await getDocs(q);

    let menuCategory = [];
    querySnapshot.forEach((menuCategoryDoc) => {
      menuCategory = [
        ...menuCategory,
        {
          ...menuCategoryDoc.data(),
          id: menuCategoryDoc.id,
        },
      ];
    });
    // console.log(JSON.stringify(menuCategory));
    return Promise.resolve(menuCategory);
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const getMenuItemsById = async (id) => {
  try {
    const snap = await getDoc(doc(config.db, constants.MENU_INFO, id));

    if (snap.exists()) {
      // console.log(snap.data(), "vijet");
      return Promise.resolve(snap.data());
    } else {
      console.log("No such document");
      return [];
    }
  } catch (e) {
    //This needs to be more elaborated.
    return e; //return an error object
  }
};

export const AddPlacedOrder = async (orderId, restaurantId) => {
  try {
    const data = {
      orderId: orderId,
      restaurantId: restaurantId,
    };
    const docRef = await addDoc(collection(config.db, "placedOrders"), data);
    console.log("placedOrders Document written with ID: ", docRef.id);
    return docRef.id, true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return "error";
  }
};

export const addCustomerInfo = async (data) => {
  try {
    const docRef = await addDoc(collection(config.db, constants.GUEST_INFO), data);
    console.log("Document written with ID: ", docRef.id);
    // addcheckInInfo(docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return "error";
  }
};

export const addcheckInInfo = async (customerId,NumberOfGuest,currentTime,currentDate) => {
  try {
    let date = new Date();
    const data = {
      numberOfGuests: NumberOfGuest,
      checkInTime: currentTime.toLocaleTimeString(),
      date: Timestamp.fromDate(date),
      checkOutTime: "false",
      customerId: customerId,
    };
    const docRef = await addDoc(collection(config.db, constants.CHECKIN_INFO), data);
    console.log("checkInInfo Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return "error";
  }
};

export const checkExistingGuest = async (emailIdOrPhone) => {
  try {
    const q = query(
      collection(config.db, constants.GUEST_INFO),where("emailOrPhone", "==", emailIdOrPhone));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return Promise.resolve(querySnapshot);
  } catch (error) {}
};

// export const updateOrderInfo = async (orderInfoId, restaurantId, cart) => {
//   try {
//     const data = [];
//     cart.map((m) => {
//       // tblnum = m.tableNumber;
//       // restId = m.restaurantId;
//       data.push({
//         menuInfoId: m.id,
//         qty: m.quantity,
//         orderStatus: "Pending",
//       });
//     });

//     const snap = await getDoc(doc(config.db, "orderInfo", orderInfoId));
//     var testData = snap.data().menuItems;

//     var oldMenuItems = snap.data().menuItems;
//     var newMenuItems = [...oldMenuItems, ...data];

//     const mergedObj = newMenuItems.reduce((acc, item) => {
//       if (acc[item.menuInfoId]) {
//         acc[item.menuInfoId].qty += item.qty;
//       } else {
//         acc[item.menuInfoId] = item;
//       }
//       return acc;
//     }, {});

//     const result = Object.values(mergedObj);
//     console.log(result);
//     const docRef = doc(config.db, "orderInfo", orderInfoId);
//     // console.log(docRef);
//     const updateStatus = await updateDoc(docRef, {
//       menuItems: result,
//     });
//   } catch (e) {
//     console.error("Error adding document: ", e);
//     return "error";
//   }
// };

export const getRestaurantInfo = async (restaurantId) => {
  try {
    const snap = await getDoc(doc(config.db, constants.RESTAURANT_INFO, restaurantId));

    if (snap.exists()) {
      return Promise.resolve(snap.data());
    } else {
      console.log("No such document");
      return false;
    }
  } catch (e) {
    return e;
  }
};

export const checkExistingGuestName = async (emailIdOrPhone) => {
  try {
    const q = query( collection(config.db, constants.GUEST_INFO),where("emailOrPhone", "==", emailIdOrPhone));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    return Promise.resolve(doc.get("name"));
  } catch (error) {}
};

export const getconfigThemeById = async (id) => {
  try {
    const snap = await getDoc(doc(config.db, constants.CONFIG_THEME, id));

    if (snap.exists()) {
      return Promise.resolve(snap.data());
    } else {
      console.log("No such document");
      return [];
    }
  } catch (e) {
    return e;
  }
};
export const updateTableStatus = async ( tableNumber, restaurantId, tableStatus ) => {
  try {
    const tableNo = parseInt(tableNumber);
    console.log(typeof tableNumber);
    const q = query(
      collection(config.db, constants.TABLE_INFO),
      where("tableNumber", "==", tableNo),
      where("restaurantId", "==", restaurantId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docs) => {
      const docRef = doc(config.db, constants.TABLE_INFO, docs.id);
      await updateDoc(docRef, {
        status: tableStatus,
      });
      // console.log("docref", doc.id);
    });

    console.log(
      "updateTableAvailability - updated successfully , updated table info id",
      querySnapshot.docs[0].id
    );
    return true;
  } catch (err) {
    console.log(err);
  }
};

export const getPaymentInfo = async (restaurantId) => {
  try {
    const docRef = query(
      collection(config.db, constants.ACCOUNT_DETAILS),
      where("restaurantId", "==", restaurantId)
    );
    const docSnap = await getDocs(docRef);
    return Promise.resolve(docSnap.docs[0].data());
  } catch (e) {
    return e;
  }
};

export const updatePayByCash = async (restaurantId, tableNumber, payByCashStatus ) => {
  try {
    const tableNo = parseInt(tableNumber);
    console.log(typeof tableNumber);
    const q = query(collection(config.db, constants.TABLE_INFO), where("tableNumber", "==", tableNo), where("restaurantId", "==", restaurantId) );
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot.docs[0]);

    querySnapshot.forEach(async (docs) => {
      const docRef = doc(config.db, constants.TABLE_INFO, docs.id);
      await updateDoc(docRef, {
        isPayByCash: payByCashStatus,
        status: "Available"
      });
      // console.log("docref", doc.id);
    });

    console.log(
      "updatePayByCash - updated successfully , updated table info id",
      querySnapshot.docs[0].id
    );
  } catch (err) {
    console.log(err);
  }
};

export const addIndividualOrders = async (tableId, restaurantId, cart) => {
  try {
    let date = new Date();
    const data = {
      customerId: localStorage.getItem("customer-id"), //hardcoded
      tableId: tableId,
      restaurantId: restaurantId,
      orderDate: Timestamp.fromDate(date),
      menuItems: cart,
      status: "In Progress",
      checkinInfoId: localStorage.getItem("checkInInfo-id"),
    };
    const docRef = await addDoc(collection(config.db, constants.INDIVIDUAL_ORDERS), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return "error";
  }
};

export const getCustomerNameById = async (id) => {
  try {
    const snap = await getDoc(doc(config.db, constants.GUEST_INFO, id));

    if (snap.exists()) {
      return Promise.resolve(snap.data().name);
    } else {
      console.log("No such document");
      return [];
    }
  } catch (e) {
    return e;
  }
};

export const updateTableStatusAndPaymentMode = async (restaurantId, tableNumber, paymentMode) => {
  try {
    const tableNo = parseInt(tableNumber);
    // console.log(typeof tableNumber);
    const q = query(collection(config.db, constants.TABLE_INFO), where("tableNumber", "==", tableNo), where("restaurantId", "==", restaurantId) );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docs) => {
      const docRef = doc(config.db, constants.TABLE_INFO, docs.id);
      await updateDoc(docRef, {
        paymentMode: paymentMode,
        status: "Available"
      });
      // console.log("docref", doc.id);
    });

    console.log(
      "updatePayByCash - updated successfully , updated table info id",
      querySnapshot.docs[0].id
    );
  } catch (err) {
    console.log(err);
  }
}

export const completeInvizualoOrderStatus = async (orderInfoId) => {
  try {
    const docRef = doc(config.db, constants.INDIVIDUAL_ORDERS, orderInfoId);
    const x = await updateDoc(
      docRef, {
        status:"Completed",
      } 
    )
    return (docRef.id);
  } catch (err) {
    console.log(err);
  }
}

export const updateRestaurantInfo = async (
  restaurantId,
  newObj
) => {
  try {
    const docRef = doc(config.db, "restaurantInfo", restaurantId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const updatedData = { ...snap.data(), ...newObj };
      await setDoc(docRef, updatedData);
      console.log("Document updated successfully.");
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const updatePaymentInfo = async (restaurantId, newObj) => {
  try {
    const docRef = query(
      collection(config.db, constants.ACCOUNT_DETAILS),
      where("restaurantId", "==", restaurantId)
    );
    const snap = await getDocs(docRef);
    if (snap.exists()) {
      const updatedData = { ...snap.data(), ...newObj };
      await setDoc(docRef, updatedData);
      console.log("Document updated successfully.");
    } else {
      console.log("Document does not exist.");
    }
  } catch (e) {
    return e;
  }
};
