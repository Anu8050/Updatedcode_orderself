import React from "react";

const Error = () => {
  return (
    <>
      <div style={{color: "red", textAlign: "center", 
                    fontSize: "30px", display:"flex", 
                    justifyContent:"center", alignItems:"center" }}>
       <p>Something went wrong. Please re-scan the QR code on the table to check-in</p>
      </div>
    </>
  );
};

export default Error;