import { CardActions, Button, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import ShowMoreText from "react-show-more-text";
import NoFoodImage from "../../assets/images/no-food-image.png";
import "./FoodItemCard.css";
import React, { useEffect, useState } from "react";
import {  addToCartWithTimeout } from "../../redux/cartSlice";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function FoodCardImageContainer({ backgroundImageUrl }) {
  return <CardMedia component="img" image={backgroundImageUrl} sx={{maxWidth: 128}} />;
}

const FoodItemCard = ({
  id,
  title,
  image,
  price,
  description,
  tableNumber,
  restaurantId,
  comment,
}) => {
  const dispatch = useDispatch();
  // const cart = useSelector((state) => state.cart);
  const [cartItem, setCartItem] = useState({
    id: id,
    title: title,
    image: image,
    price: price,
    description: description,
    tableNumber: tableNumber,
    restaurantId: restaurantId,
  });

  useEffect(() => {
    if (
      id &&
      title &&
      image &&
      price &&
      description &&
      tableNumber &&
      restaurantId
    ) {
      setCartItem({
        id: id,
        title: title,
        image: image,
        price: price,
        description: description,
        tableNumber: tableNumber,
        restaurantId: restaurantId,
      });
    }
  }, [id, title, image, price, description, tableNumber, restaurantId]);

 

  return (
    <>
      <Card sx={{ display: "flex", my: "6px" , borderRadius: '5px'}} variant="outlined">    
<       FoodCardImageContainer backgroundImageUrl={image ? image : NoFoodImage} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            verticalAlign: "top",
            pl: 2,
          }}
        >
          <CardContent sx={{ flex: "1 0 auto", py: 0, px: 1 }}>
            <Typography
              component={"div"}
              variant="h4"
              sx={{
                textTransform: "capitalize",
                pt: 1,
              }}
            >
              {title}
            </Typography>
            <Typography component={"div"} variant="h5">
              € {price}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component={"div"}
              sx={{lineHeight: 'normal', mt: 1}}
            >
              <ShowMoreText
                lines={2}
                more="Show more"
                less="Show less"
                className="content-css"
                anchorClass="show-more-less-clickable"
                // onClick={this.executeOnClick}
                expanded={false}
                // width={280}
                truncatedEndingComponent={"... "}
              >
                {description}
              </ShowMoreText>
            </Typography>
          </CardContent>
          <CardActions>
            {/* <Box sx={{ mr: 2 }}>
              <QuantityModifierButton id={id} cartItem={cartItem} />
            </Box> */}
            <Button
              disableElevation
              variant="contained"
              size="small"
              startIcon={<AddShoppingCartIcon/>}
              onClick={() =>
                dispatch(
                  addToCartWithTimeout({
                    id,
                    title,
                    image,
                    price,
                    tableNumber,
                    restaurantId,
                    comment,
                  })
                )
              }
            >
              Add
            </Button>
            {/* <Button variant="contained" size="small" sx={{backgroundColor: "#FC8019"}} onClick={() =>                           
                          getMenuItems("6Jq7TMELPvMWAPGnfYAu").then((data)=>{                 
                            })}
                      >
              Functions
            </Button> */}
          </CardActions>
        </Box>
      </Card>
    </>
  );
};

export default FoodItemCard;
