import React from "react";
import Chackin from './CheckInPage'
import { Icon } from "@mui/material";

const Error = () => {
  return (
    <>
      <div style={{ color: "red", textAlign: "center" }}>
       <p>Something went wrong. Please re-scan the QR code on the table to check-in</p>
      </div>
      <div>
      </div>
    </>
  );
};

export default Error;