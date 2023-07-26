import { lazy } from "react";

// project imports
import Loadable from "../components/Loadable";
import MinimalLayout from "../layout/MinimalLayout";
import RestaurantOrders from "../OrderStatus/RestaurantOrders";

const CheckInPage = Loadable(
  lazy(() => import("../components/CheckIn/CheckInPage"))
);
const CheckInCompleted = Loadable(
  lazy(() => import("../components/CheckIn/CheckInCompleted"))
);
const PleaseCheckIn = Loadable(
  lazy(() => import("../pages/PleaseCheckIn"))
);
const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/",
      element: <CheckInPage />,
    },
    {
      path: "/check-in/:restaurantId/:tableNumber",
      element: <CheckInPage />,
    },
    {
      path: "check-in-completed/:restaurantId/:tableNumber",
      element: <CheckInCompleted/>,
    },
    {
      path:'error',
      element: <PleaseCheckIn/>,
    }
    // {
    //   path: "/allorders/:restaurantId/:tableNumber/:restaurantName",
    //   element: <RestaurantOrders />,
    // },

  ],
};

export default AuthenticationRoutes;
