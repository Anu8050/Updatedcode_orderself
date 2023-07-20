import { useNavigate } from "react-router-dom";
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from "@mui/material/Link";

export default function EmptyCart() {
    const navigate = useNavigate();
    const goToHomePage = () =>{
       const restaurantId = localStorage.getItem('restaurantId');
       const tableNumber = localStorage.getItem('tableNumber');

       navigate(`/dashboard/foodmenu/${restaurantId}/${tableNumber}`);  
    }
  return (
    <div>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{borderRadius:"10px"}}
      >
        <DialogTitle id="alert-dialog-title" sx={{fontSize:"20px",fontWeight:"bold"}}>
         No food item is selected to proceed with the order.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Please  <Link onClick={goToHomePage} style={{cursor:"pointer"}}>click here</Link> to select food items.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}
