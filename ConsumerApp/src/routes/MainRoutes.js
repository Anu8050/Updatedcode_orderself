import { lazy } from "react";

import MainLayout from "../layout/MainLayout";
import Loadable from "../components/Loadable";
import { Navigate } from "react-router-dom";

// utilities routing
const Home = Loadable(lazy(() => import("../pages/Home/Home")));
const Cart = Loadable(lazy(() => import("../pages/Cart/Cart")));
const PaymentSuccess = Loadable(lazy(() => import("../pages/PaymentStatus/PaymentSuccess")));
const PaymentCancelled = Loadable(lazy(() => import("../pages/PaymentStatus/PaymentCancelled")));
const OrderStatus = Loadable(lazy(() => import("../components/OrderStatus")));
const ViewOrder = Loadable(
  lazy(() => import("../pages/ViewOrder/ViewOrder"))
);
const PageNotFound = Loadable(
  lazy(() => import("../pages/PageNotFound")) 
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/dashboard",
  element: <MainLayout />,
  children: [
    {
      path: "foodmenu/:restaurantId/:tableNumber",
      element: <Home />,

    },
    {
      path: "cart",
      element: <Cart />,
    },
    {
      path: "order-status",
      element: <OrderStatus /> ,
    },
    {
      path: "view-order",
      element: <ViewOrder />,
    },
    {
      path: "success",
      element: <PaymentSuccess />,
    },
    {
      path: "cancel",
      element: <PaymentCancelled />,
    },
    {
      path: '*',
      element: <PageNotFound />,
    }
  ],
  // children: [
  //   {
  //     path: "foodmenu/:restaurantId/:tableNumber",
  //     element: localStorage.getItem("checkInInfo-id") ? <Home /> : <PaymentSuccess />,

  //   },
  //   {
  //     path: "cart",
  //     element: localStorage.getItem("checkInInfo-id") ? <Cart /> : <PaymentSuccess />,
  //   },
  //   {
  //     path: "order-status",
  //     element: localStorage.getItem("checkInInfo-id") ? <OrderStatus /> : <PaymentSuccess />,
  //   },
  //   {
  //     path: "view-order",
  //     element: localStorage.getItem("checkInInfo-id") ? <ViewOrder /> : <PaymentSuccess />,
  //   },
  //   {
  //     path: "success",
  //     element: <PaymentSuccess />,
  //   },
  //   {
  //     path: "cancel",
  //     element: <PaymentCancelled />,
  //   },
  //   {
  //     path: '*',
  //     element: <PageNotFound />,
  //   }
  // ],
};

export default MainRoutes;
