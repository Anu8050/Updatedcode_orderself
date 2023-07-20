import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button, ButtonGroup, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  addToCart,
  decrementQuantity,
  incrementQuantity,
  addToCartWithTimeout,
} from "../../redux/cartSlice";
import NoFoodImage from "../../assets/images/no-food-image.png";

function QuantityModifierButton({ id, cartItem = {} }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = React.useState(0);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (cart && id) {
      const cartValue = cart.find((item) => item.id === id);
      if (cartValue) {
        setQuantity(cartValue.quantity);
      }
    }
  }, [cart, id]);

  const handleDecrement = () => {
    // if (quantity <= 1) {
      // dispatch(removeItem(id));
    // } 
    // else 
    dispatch(decrementQuantity(id));
  };

  const handleIncrement = () => {
    if (quantity === 0) {
      dispatch(
        addToCartWithTimeout({
          id: cartItem.id,
          title: cartItem.title,
          price: cartItem.price,
          tableNumber: cartItem.tableNumber,
          restaurantId: cartItem.restaurantId,
          image: cartItem.image ?? NoFoodImage,
          comment: "",
        })
      );
    } else if (quantity < 50)
    {
      dispatch(incrementQuantity(id));
    }
  };

  return (
    <ButtonGroup
      disableElevation
      variant="outlined"
      aria-label="Disabled elevation buttons"
      size="small"
    >
      <Button variant="outlined" size="small" onClick={handleDecrement} disabled={cart.length === 0}>
        <RemoveIcon fontSize="small" />
      </Button>
      <Button variant="outlined" size="small" style={{ pointerEvents: 'none', cursor: 'default', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>
        {quantity}
      </Button>
      <Button variant="outlined" size="small" onClick={handleIncrement}>
        <AddIcon fontSize="small" />
      </Button>
    </ButtonGroup>
  );
}

export default QuantityModifierButton;
