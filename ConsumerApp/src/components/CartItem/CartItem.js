import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addComment, removeItem } from "../../redux/cartSlice";
import QuantityModifierButton from "../QuantityModifierButton";
import "./CartItem.css";
import AddCommentIcon from "@mui/icons-material/AddComment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import NoFoodImage from "../../assets/images/no-food-image.png";

function FoodCardImageContainer({ backgroundImageUrl }) {
  return (
    <CardMedia
      component="img"
      image={backgroundImageUrl}
      sx={{ maxWidth: 128 }}
    />
  );
}

function CartItem({ id, image, title, price, quantity = 0 }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const cart = useSelector((state) => state.cart);

  const addCommentClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const saveCommentToStore = () => {
    dispatch(
      addComment({
        id: id,
        comment: commentText,
      })
    );
    handleClose();
  };

  const handleClose = () => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      setCommentText(item.comment || "");
    } else {
      setCommentText("");
    }
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const item = cart.find((item) => item.id === id)?.comment;
    if (item) {
      setCommentText(item);
    }
  }, [cart, id]);
  const open = Boolean(anchorEl);
  const id1 = open ? "simple-popover" : undefined;

  return (
    <>
      <Popover
        id={id1}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: { borderRadius: "15px" },
        }}
      >
        <Box sx={{ margin: "10px" }}>
          <TextField
            id="outlined-basic"
            label="Add Comment for porter"
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </Box>
        <Box sx={{ margin: "10px", textAlign: "right" }}>
          <Button
            variant="outlined"
            onClick={saveCommentToStore}
            disabled={commentText.trim() === ""}
          >
            Add
          </Button>
        </Box>
      </Popover>
      <Card sx={{ display: "flex", my: "6px" }} variant="outlined">
        <FoodCardImageContainer
          backgroundImageUrl={image ? image : NoFoodImage}
        />

        {/* <CardMedia
          component="img"
          className="item-card-media"
          image={image}
          alt={title}
          sx={{ width: "150px" }}
        /> */}
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
          </CardContent>
          <CardActions
            sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          >
            <Box sx={{ mr: 1, ml: 0, my: 1 }}>
              <QuantityModifierButton id={id} />
            </Box>
            {/* <Button
              disableElevation
              variant="outlined"
              size="small"
              color="error"
              onClick={() => {
                dispatch(removeItem(id));
              }}
              sx={{ mr: 1, ml: 0, my: 1 }}
            >
              Remove
            </Button> */}

            <Tooltip title="Remove" arrow>
              <div style={{ display: "inline-block" }}>
                <DeleteOutlineIcon
                  fontSize="medium"
                  color="error"
                  onClick={() => {
                    dispatch(removeItem(id));
                  }}
                />
              </div>
            </Tooltip>

            <Tooltip title="Add Comment for porter" arrow>
              <div style={{ display: "inline-block" }}>
                <AddCommentIcon fontSize="medium" onClick={addCommentClick} />
              </div>
            </Tooltip>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}

export default CartItem;
