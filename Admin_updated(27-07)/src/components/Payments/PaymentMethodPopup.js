import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Grid,
    Switch,
    CircularProgress,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ShowSnackbar from "../../utils/ShowSnackbar";
import * as paymentService from "../../services/paymentServices";

import {updatePaymentInfo, updatePayPalMerchantInfo, getRestaurantInfo}  from "../../services/menuService";
import * as payPalService from "../../services/paypalPaymentService";

import { LoadingButton } from "@mui/lab";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { getRestaurantId } from "../../services/authService";
import VerifiedIcon from '@mui/icons-material/Verified';
import Tooltip from "@mui/material/Tooltip";


const PaymentMethodPopup = (props) => {
    const location = useLocation();
    const params = useParams();
    const queryParams = new URLSearchParams(location.search);
    const [accNumberErrorMessage,setAccNumberErrorMessage] =useState("");    
    const [allPayments,setAllPayments] =useState();
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [propsMessage, setPropsMessage] = React.useState("");
    const [propsSeverityType, setPropsSeverityType] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [holderName, setHolderName] = useState(allPayments?.accountHolderName);
    const [accNumber, setAccNumber] = useState(allPayments?.accountNumber);

    const [isPayByCash, setIsPayByCash] = React.useState(allPayments?.payByCashEnabled); 
    const [isPaypal, setIsPaypal] = useState(allPayments?.paypalEnabled);
    const [isGooglePay, setIsGooglePay] = React.useState(allPayments?.gPayApplePayEnabled); 
    const [isPaymentAdvance, setIsPaymentAdvance] = React.useState(allPayments?.paymentInAdvanceEnabled);
    const [circularLoading, setCircularLoading] = React.useState(false);  

    

    const label = { inputProps: { "aria-label": "Size switch demo" } };
    const handleClose = () => {
        props.handleCloseDialog(false);
    };

    const handlePayCash = (event) => {
        setIsPayByCash(event.target.checked);
    };

    const handlePaypal = (event) => {         
        setIsPaypal(event.target.checked);
    };

    const handleGooglePay = (event) => {
        setIsGooglePay(event.target.checked);
    };

    const handlePaymentAdvance = (event) => {
        setIsPaymentAdvance(event.target.checked);
    };

    const [paypalUrl , setPaypalUrl] = React.useState();

    useEffect(() => {  
        if(props.isDialogOpened){            
            const result = paymentService.getPaymentDetails()
            result.then((payment)=>{                
                setAllPayments(payment);
                // setIsPayByCash(payment?.payByCashEnabled ?? false);
                setIsPayByCash(payment?.payByCashEnabled ?? false);
                setIsPaypal(payment?.paypalEnabled ?? false);
                setIsGooglePay(payment?.gPayApplePayEnabled ?? false);
                setIsPaymentAdvance(payment?.paymentInAdvanceEnabled ?? false);
                setCircularLoading(true);
            });
        }   
        else{
            setCircularLoading(false);
        }     
    }, [props.isDialogOpened]);
    
    
//********************PayPal related changes.******************************************/

const [restaurantInfo, setRestaurantInfo] = React.useState([]);
const [isPaypalAccount, setIsPaypalAccount] = React.useState(false);

useEffect(() => {
  const restaurantId = localStorage.getItem("restaurant-id");
  const result = getRestaurantInfo(restaurantId);
  result.then((restInfo) => {
    setRestaurantInfo(restInfo);
  });

  const result1 = paymentService.isMerchantIdExist();
  result1.then((restInfo) => {
    // if(restInfo){
        setIsPaypalAccount(restInfo);
    // }
    // else{
        // setIsPaypalAccount(false);
    // }   
  });
}, [props.isDialogOpened]);

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const hasQueryParams = queryParams.has("merchantId");
  if (hasQueryParams) {
    verifySellerOnboarding();
  }
}, [location.search]);

const verifySellerOnboarding = async () => {
  const merchantData = {
    merchantId: queryParams.get("merchantId"), // firebase restaurant info doc id or tracking id
    merchantIdInPayPal: queryParams.get("merchantIdInPayPal"), // merchant id from paypal end
    permissionsGranted: queryParams.get("permissionsGranted"),
    consentStatus: queryParams.get("consentStatus"),
    productIntentId: queryParams.get("productIntentId"),
    productIntentID: queryParams.get("productIntentID"),
    isEmailConfirmed: queryParams.get("isEmailConfirmed"),
    accountStatus: queryParams.get("accountStatus"),
    riskStatus: queryParams.get("riskStatus"),
  };
  if (merchantData.isEmailConfirmed === "true") {
    setOpenSnackBar(true);
    setPropsMessage(`PayPal Signup is successful. Now you will receive payments on this account.`);
    setPropsSeverityType("success");
  }
  else{
    setOpenSnackBar(true);
    setPropsMessage(`Please complete the email verification process. An email is already sent to your registered email.`);
    setPropsSeverityType("error");
  }
  if (merchantData && merchantData.permissionsGranted === "false") {
    alert("Permission denied. Please contact PayPal support");
  } else {
    const newObj = {
      merchantIdInPayPal: queryParams.get("merchantIdInPayPal"),
    };
    await updatePayPalMerchantInfo(params.restaurantId, newObj);
    await payPalService
      .verifySellerOnboardStatus(merchantData)
      .then((response) => {               
        const paymentReceivable = {
          paypalEnabled: response.payments_receivable,
        };
        updatePaymentInfo(params.restaurantId, paymentReceivable);
        const paypalEmailConfirmed = {
          paypalEmailConfirmed: response.primary_email_confirmed,
        };
        updatePayPalMerchantInfo(
          params.restaurantId,
          paypalEmailConfirmed
        );
      });
  }
};

function extractParamsFromURL(url) {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  const params = {};

  for (let param of searchParams.entries()) {
    params[param[0]] = param[1];
  }

  return params.referralToken;
}

const extractActionUrl = async (jsonObject) => {
  let actionUrl = null;
  let partnerReferralId = null;

  jsonObject.links.forEach((link) => {
    if (link.rel === "action_url") {
      actionUrl = link.href;
      partnerReferralId = extractParamsFromURL(link.href);
    }
  });

  return { actionUrl, partnerReferralId };
};

const handleMerchantSignUp = async () => {

  const trackingId = localStorage.getItem("restaurant-id");
  const tableNumber = params.tableNumber;
  const response = await payPalService.createReferral(
    trackingId,
    restaurantInfo,
    tableNumber
  );
  const jsonObject = response;
  const { actionUrl, partnerReferralId } = await extractActionUrl(jsonObject);

  if (partnerReferralId) {
    const newObj = { partnerReferralId: partnerReferralId.toString() };
    await updatePayPalMerchantInfo(localStorage.getItem("restaurant-id"), newObj);
  }
  if (actionUrl) {
    window.location.href = actionUrl;
  }
};

//**************************************************************/



    const AddPaymentMethod = () => {    
        setLoading(true)   
        if(allPayments !== undefined)
                {              
                const updateStatus = paymentService.updatePaymentDetails(isPayByCash,isPaypal,isGooglePay,isPaymentAdvance,allPayments.id);
                updateStatus.then((update)=>{
                   if(update)
                   {
                     setLoading(false) 
                     setOpenSnackBar(true);
                     setPropsMessage(`Payment details Updated successfully.`);
                     setPropsSeverityType("success");
                     handleClose();
                   }
                })  
                }
                else{
                    const accountNumUniqueness =paymentService.checkpaymentDetailsIsExists();
                    accountNumUniqueness.then((unique) => {
                        if (!unique) {
                                const result = paymentService.paymentDetails(isPayByCash,isPaypal,isGooglePay,isPaymentAdvance);
                                result.then((success)=>{
                                    if(success)
                                    {
                                        setLoading(false) 
                                        setOpenSnackBar(true);
                                        setPropsMessage(`Payment details added successfully.`);
                                        setPropsSeverityType("success");
                                        handleClose();
                                    } 
                                    else{
                                        setOpenSnackBar(true);
                                        setPropsMessage(`Error occured while adding Payment details.`);
                                        setPropsSeverityType("error");
                                    }                                       
                                })                 
                                                          
                        }
                        else{
                            setLoading(false) 
                        }
                    });
                }        
        setOpenSnackBar(false);        
    };
    const [paypalAccountDetail, setPaypalAccountDetail] = useState("PayPal account details");

    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const handleDeletePaypalAccount = () => {
        setConfirmationPopup(true);
      };
      
    const handleConfirmationResponse = (confirmed) => {
        if (confirmed) {
            const result = paymentService.removePaypalAccount();
            result.then((update)=>{
                if(update) {
                handleClose();
                setOpenSnackBar(true);
                setPropsMessage(`Paypal account removed successfully`);
                setPropsSeverityType("success"); 
                }
            })
        }
        setConfirmationPopup(false);
    };

      
    return (
        <div style={{ margin: "0px" }}>
            {openSnackBar && (
                <ShowSnackbar message={propsMessage} severityType={propsSeverityType} />
            )}
            <React.Fragment>
                <Dialog
                    open={props.isDialogOpened}
                    onClose={handleClose}
                    aria-labelledby="max-width-dialog-title"
                    maxWidth="false"
                    PaperProps={{ sx: {minHeight: "22rem" } }}
                >
                    <DialogTitle id="max-width-dialog-title">
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                        >
                            <Grid item xs={11}>
                                <strong>Payment Configuration</strong>
                            </Grid>
                            <Grid item xs={1} style={{ alignContent: "flex-start" }}>
                                <CancelRoundedIcon
                                    onClick={handleClose}
                                    className="closeIcon"
                                    {...label}
                                />                            
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent style={{ borderTop: "0.15em solid #FC8019" }}>
                    {circularLoading ? (
                        <Stack spacing={2} padding={1}>
                            <Grid item xs={6}>
                                <Switch
                                    checked={isPayByCash}
                                    onChange={handlePayCash}
                                    disabled={true}
                                />
                                    <label>Enable Pay By Cash</label>
                            </Grid>
                            <Grid item xs={6}>
                                <Switch
                                    checked={isPaypal}
                                    onChange={handlePaypal}
                                />
                                 <label>Enable PayPal</label>
                            </Grid>
                            {isPaypal && (
                                <>
                                <div style={{display:"flex" , alignItems:"center"}}>
                                    <div>
                                    <Button variant="outlined" onClick={handleMerchantSignUp} disabled={isPaypalAccount}> 
                                        Link PayPal Account
                                    </Button>
                                    </div>
                                    {isPaypalAccount && (
                                    <>
                                    <Tooltip title="PayPal Account is Active" >
                                        <VerifiedIcon  fontSize ="medium" style={{marginLeft:"10px",color:"green" ,cursor:"pointer"}}/>
                                    </Tooltip>
                                    <Tooltip title="Remove PayPal Account" >
                                    {/* <IconButton  > */}
                                        <ClearIcon fontSize ="medium" onClick={handleDeletePaypalAccount} edge="end"  sx={{ marginLeft:"10px", color: "red", cursor:"pointer"}}/> 
                                    {/* </IconButton> */}
                                    </Tooltip>
                                    </>
                                    )}  
                                </div>
                                </>
                            )}
                            <Grid item xs={6}> 
                                <Switch
                                    checked={isGooglePay}
                                    onChange={handleGooglePay}
                                />
                                <label>Enable Google Pay / Apple Pay</label>
                            </Grid>
                            <Grid item xs={6}>
                                <Switch
                                    checked={isPaymentAdvance}
                                    onChange={handlePaymentAdvance}
                                />
                                  <label>Payment should be made in Advance</label>
                            </Grid>

                            <div style={{ display: "flex", justifyContent:"space-evenly"}}>
                                <LoadingButton
                                    variant="contained"
                                    loading={loading}
                                    style={{ width: "100px", marginTop: "10px" }}
                                    onClick={AddPaymentMethod}
                                    // disabled={!empty}
                                >
                                   Save
                                </LoadingButton>
                                <Button
                                    variant="outlined"
                                    style={{ width: "100px", marginTop: "10px" }}
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Stack>
                         ) : (
                            <Stack spacing={2} padding={1}>
                                <div 
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: "40vh",
                                }}>
                                <CircularProgress />
                            </div>
                            </Stack>
                          
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={confirmationPopup}
                    onClose={() => handleConfirmationResponse(false)}
                >
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        Are you sure you want to remove PayPal account?
                    </DialogContent>
                    <DialogActions>
                        <Button  variant="contained" onClick={() => handleConfirmationResponse(true)}>Yes</Button>
                        <Button  variant="contained" onClick={() => handleConfirmationResponse(false)}>No</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

PaymentMethodPopup.propTypes = {};

PaymentMethodPopup.defaultProps = {};

export default PaymentMethodPopup;
