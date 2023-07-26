import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();

export const getDetailsByEmalId = httpsCallable(functions, 'menuItemCsvUpload');

export const getMenuItemsForRestaurant = httpsCallable(functions, 'getMenuItemsForRestaurant');

export const getAllRestaurants = httpsCallable(functions, 'getAllRestaurants');


getDetailsByEmalId({ })
  .then((result) => {        
    return result;
  });


  getMenuItemsForRestaurant({ })
  .then((result) => {        
    console.log(result, "testfunctions");
    return result;
  });

  getAllRestaurants().then((result) => {
    console.log(result, "getAllRestaurants");
  })
  
  
export const geMenuItemsByRestaurantId = httpsCallable(functions, 'geMenuItemsByRestaurantId');
geMenuItemsByRestaurantId({ })
  .then((result) => {    
    console.log(result, "result is:")
    return result;
  });
