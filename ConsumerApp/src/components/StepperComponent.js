import React, { useState } from "react";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";

function StepperComponent(props) {
  const [activeStep, setActiveStep] = useState(props.x);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <Stepper activeStep={activeStep}>
      <Step style={{ marginBottom: "5px", marginTop: "0px" }}>
        <StepLabel>Order received</StepLabel>
      </Step>
      {/* <Step style={{ marginTop: "5px", marginBottom: "5px" }}>
        <StepLabel StepIconProps={{ style: { color: "green" } }}>Order prepared</StepLabel>
      </Step> */}
      <Step style={{ marginTop: "5px", marginBottom: "5px" }}>
    <StepLabel
      StepIconProps={{
        style: {color: activeStep >= 1 ? "green" : "grey",},
      }}>
      Order Prepared
    </StepLabel>
    </Step>      
      {/* <Step style={{ marginTop: "5px" }}>
        <StepLabel>Completed</StepLabel>
      </Step> */}
    </Stepper>
  );
}
export default StepperComponent;
