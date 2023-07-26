import React  from 'react'
import LunchDiningIcon from '@mui/icons-material/LunchDining';
export default function PleaseCheckIn() {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height: "100vh",backgroundColor:"#FFF5EE"}}>
      <div style={{display:"flex" ,alignItems:"center"}}>
        <p style={{fontSize:"3rem" ,color:"#FC8019"}}> 4 </p> <LunchDiningIcon style={{fontSize:"3rem",color:"#FC8019"}}/> <p style={{fontSize:"3rem",color:"#FC8019"}}> 4 </p>
      </div>
      <br/>
      <center>
      <p style={{ color: "#FC8019",fontWeight:"bold" }}>
        Something went wrong. <br /> 
        Please re-scan the QR code on the table to check-in
      </p>
      </center>
    </div>
  )
}
