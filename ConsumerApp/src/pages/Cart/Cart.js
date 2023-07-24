import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import NoFoodImage from "../../assets/images/no-food-image.png";
import CartItem from "../../components/CartItem/CartItem";
import Total from "../../components/Total/Total";
import "../Cart/Cart.css";
import EmptyCart from "../../components/EmptyCart"
const Cart = (props) => {
  const cart = useSelector((state) => state.cart);
  // useEffect(() => {
  //   console.log("Cart", cart);
  // }, [cart]);

  return (
    <>
      <Grid container spacing={3} sx={{ marginTop: 8, paddingBottom: 8 }}>
        <Grid item xs={12} sm={6}>
          {cart?.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              image={(item.image == "" || item.image ==undefined || item.image == null)? NoFoodImage : item.image}
              title={item.title}
              price={item.price}
              quantity={item.quantity}
            />
          ))}
        </Grid>
        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
          <Paper sx={{ position: "sticky", top: "92px" }}>
            <Total />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Cart;
