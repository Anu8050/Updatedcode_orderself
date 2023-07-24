import React, { useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "../CheckIn/checkInpage.css";
import {
  addCustomerInfo,
  checkExistingGuest,
  addcheckInInfo,
  checkExistingGuestName,
  updateTableStatus,
} from "../../services/menuService";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import orderselfLogo from "../../assets/images/success.png";//orderself-logo.png";
import Box from "@mui/material/Box";
import * as menuService from "../../services/menuService";
import { Card, CardActions, CardContent, Paper } from "@material-ui/core";
import * as payPalService from "../../services/paypalPaymentService";
import { resetCart } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";
// import LoginIcon from '@mui/icons-material/Login';
import PlaceIcon from '@mui/icons-material/Place';
import Error from './ErrorPage';

export default function RestaurantOrders(props) {
  const [restaurantInfo, setRestaurantInfo] = React.useState([]);
  const [assignedThemeColors, setAssignedThemeColors] = React.useState();
  const dispatch = useDispatch();
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (!params.restaurantId || !params.tableNumber) 
    {
      setError(true);
    } 
    else
    {
      localStorage.setItem("restaurant_id", params.restaurantId);
      const result = menuService.getRestaurantInfo(params.restaurantId);
      result.then((restInfo) => {
        setRestaurantInfo(restInfo);
        const theme = menuService.getconfigThemeById(restInfo.themeId);
        theme.then((df) => {
          df.setDefault = true;
          setAssignedThemeColors(df);
        });
      });
    }
    
  }, []);

  const params = useParams();
  const navigate = useNavigate();
  const [tableNumber, setTableNumber] = React.useState(params.tableNumber);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [currentDate, setCurrentDate] = React.useState(
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [customerName, setCustomerName] = React.useState("");
  const [isValidcustomerName, setIsValidCustomerName] = React.useState(true);
  const handleCustomerName = (event) => {
    const customerName = event.target.value;
    setCustomerName(customerName);
    const regex = /^\s*[A-Za-zäöüÄÖÜß]+(?:\s+[A-Za-zäöüÄÖÜß]+)*\s*$/;
    setIsValidCustomerName(regex.test(customerName));

    // if (!e.target.value) {
    //     setCustomerNameErrorMessage("Required");
    //     setCustomerName(e.target.value);
    // } else {
    //   const regexExpr = /^[A-Za-zäöüÄÖÜß]+(?:\s+[A-Za-zäöüÄÖÜß]+)*$/;
    //   if (regexExpr.test(e.target.value)) {
    //     setCustomerName(e.target.value);
    //     setCustomerNameErrorMessage("");
    //   } else {
    //     setCustomerNameErrorMessage("Invalid customer name");
    //   }
    // }
  };

  const [readOnly, setReadOnly] = React.useState(false);
  const [customerContactNo, setCustomerContactNo] = React.useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = React.useState(true);

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value;
    setCustomerContactNo(newPhoneNumber.trim());
    const emailRegex = /^\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*$/;
    const phoneRegex = /^\s*(?:\+49|0)[\s-]?[1-9]\d{1,4}[\s-]?\d{4,8}\s*$/;
    const emailOrPhoneRegex = new RegExp(
      `^(${emailRegex.source}|${phoneRegex.source})$`
    );

    setIsValidPhoneNumber(emailOrPhoneRegex.test(newPhoneNumber));
    if (emailOrPhoneRegex.test(newPhoneNumber)) {
      const result = checkExistingGuestName(
        event.target.value.toLowerCase().trim()
      );
      result
        .then((data) => {
          if (data) {
            setCustomerName(data);
            setIsValidCustomerName(true)
            setReadOnly(true);
          } else {
            setCustomerName("");
            setReadOnly(false);
          }
        })
        .catch((error) => {
          console.log("Error checking guest existence:", error);
          setCustomerName("");
          setReadOnly(false);
        });
    } else {
      setCustomerName("");
      setReadOnly(false);
    }
  };

  const [NumberOfGuest, setNumberOfGuest] = React.useState(0);
  const [isValidGuestError, setIsValidGuestError] = React.useState(true);
  const handleGuestNo = (event) => {
    const guestNumber = event.target.value;
    setNumberOfGuest(guestNumber);
    // const regex = /^[0-9]+$/;
    const regex = /^(?:[1-9]|[1-4][0-9]|50)$/;
    setIsValidGuestError(regex.test(guestNumber));

    // if (!e.target.value) {
    //     setNumberOfGuestError("Required");
    //     setNumberOfGuest(e.target.value);
    // } else {
    //   const regexExpr = ;
    //   if (regexExpr.test(e.target.value)) {
    //     setNumberOfGuest(e.target.value);
    //     setNumberOfGuestError("");
    //   } else {
    //     setNumberOfGuestError("Invalid");
    //   }
    // }
  };

  const isEmpty =
    isValidcustomerName &&
    isValidPhoneNumber &&
    // isValidGuestError &&
    customerName?.length &&
    customerContactNo?.length &&
    // NumberOfGuest?.length &&
    tableNumber.length;

  const saveCustomerInfo = () => {
    dispatch(resetCart());
    // console.log(customerName, customerContactNo, NumberOfGuest, "time",currentTime.toLocaleTimeString(),"date", currentDate.toString() )
    localStorage.clear();
    const result = checkExistingGuest(customerContactNo);
    result.then((data) => {
      if (data.size <= 0) {
        const data = {
          name: customerName.trim(),
          emailOrPhone: customerContactNo,
        };
        const custid = addCustomerInfo(data);
        custid.then((id) => {
          localStorage.setItem("customer-id", id);
          const checkInInfo = addcheckInInfo(
            id,
            NumberOfGuest,
            currentTime,
            currentDate
          );
          checkInInfo.then((id) => {
            localStorage.setItem("checkInInfo-id", id);
            onSuccessfulCheckin();
          });
        });
      } else {
        data.forEach((docId) => {
          const checkInInfo = addcheckInInfo(
            docId.id,
            NumberOfGuest,
            currentTime,
            currentDate
          );
          localStorage.setItem("customer-id", docId.id);
          checkInInfo.then((id) => {
            localStorage.setItem("checkInInfo-id", id);
            onSuccessfulCheckin();
          });
        });
      }
    });
  };

  const onSuccessfulCheckin = () => {
    localStorage.setItem("defaultTheme", JSON.stringify(assignedThemeColors));
    updateTableStatus(tableNumber, params.restaurantId, "occupied").then(
      (status) => {
        console.log("table status updated", status);
      }
    );
    navigate(`/check-in-completed/${params.restaurantId}/${tableNumber}`);
  };

  // React.useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  useEffect(() => {
    if (queryParams.size > 0) {
      verifySellerOnboardStatus();
    }
  }, [queryParams.get('merchantId')]);

  const verifySellerOnboardStatus = async () => {
    const merchantData = {
      merchantId: queryParams.get("merchantId"), // firebase restaurant info doc id or tracking id
      merchantIdInPayPal: queryParams.get("merchantIdInPayPal"), // merchant id from paypal end
      permissionsGranted: queryParams.get("permissionsGranted"),
      consentStatus: queryParams.get("consentStatus"),
      productIntentId: queryParams.get("productIntentId"),
      productIntentID: queryParams.get("productIntentID"),
      isEmailConfirmed: queryParams.get("isEmailConfirmed"),
      accountStatus: queryParams.get("accountStatus"),
    };
    if (merchantData && merchantData.permissionsGranted === "false") {
      alert("Permission denied. Please contact paypal support");
    } else {
      const newObj = {
        merchantIdInPayPal: queryParams.get("merchantIdInPayPal"),
      };
      await menuService.updateRestaurantInfo(params.restaurantId, newObj);
      await payPalService
        .verifySellerOnboardStatus(merchantData)
        .then((response) => {
          const paymentReceivable = {
            paypalEnabled: response.payments_receivable,
          };
          menuService.updatePaymentInfo(params.restaurantId, paymentReceivable);
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
    const trackingId = params.restaurantId;
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
      await menuService.updateRestaurantInfo(params.restaurantId, newObj);
    }
    if (actionUrl) {
      window.location.href = actionUrl;
    }
  };

  const handleGuestNoKeyPress = (event) => {
    console.log('hi1');
    const allowedCharacters = /[^0-9]/;
    if (event.key.match(allowedCharacters)) {
      event.preventDefault();
    }
  };

  return (
    <React.Fragment>
    {error ? ( 
      <Error message={error} /> 
    ):(
        <Paper>
          <Box
            sx={{
              height: "30vh",
              backgroundColor: "black",
              display: "grid",
              placeItems: "center",
            }}
          >
            <center>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  component="img"
                  sx={{ height: 64 }}
                  alt="OrderSelf"
                  src={orderselfLogo}
                />
                {/* <Button variant="text" onClick={handleMerchantSignUp}>
                  Sign up
                </Button> */}
              </Box>
            </center>
          </Box>
          <Box
            sx={{
              height: "70vh",
              position: "relative",
              backgroundColor: "#eef2f6",
            }}
          >
            <Card
              style={{
                width: "100%",
                maxWidth: "360px",
                margin: "20px auto",
                maringTop: "-200px",
                position: "absolute",
                top: "-80px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <CardContent>
                <center>
                  {restaurantInfo.restaurantLogoUrl && (
                    <Box
                      component="img"
                      style={{
                        border: "6px solid #ccc",
                        borderWidth: 4,
                        borderRadius: 6,
                        boxShadow: "2px 2px 10px 2px #ccc",
                      }}
                      sx={{ height: 64, m: 2 }}
                      alt="OrderSelf"
                      src={restaurantInfo.restaurantLogoUrl}
                    />
                  )}
                  {restaurantInfo.restaurantName && (
                    <Typography variant="h4">
                      {restaurantInfo.restaurantName}
                    </Typography>
                  )}

                  <Typography variant="h2" sx={{ m: 1 }}>
                    Check-In
                  </Typography>
                </center>

                <TextField
                  required
                  id="contactnumber"
                  label="Email or Phone"
                  value={customerContactNo}
                  onBlur={handlePhoneNumberChange}
                  onChange={handlePhoneNumberChange}
                  error={!isValidPhoneNumber}
                  helperText={
                    !isValidPhoneNumber
                      ? "Please enter a valid phone or email"
                      : ""
                  }
                  sx={{ width: "100%", mb: 2 }}
                />
                <TextField
                  required
                  id="customername"
                  label="Name"
                  //   inputRef={customerName}
                  value={customerName}
                  // onBlur={handleCustomerName}
                  onChange={handleCustomerName}
                  error={!isValidcustomerName}
                  helperText={
                    !isValidcustomerName ? "Please enter the name correctly" : ""
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: readOnly }}
                  sx={{ width: "100%", mb: 0 }}
                />
                {/* {customerNameErrorMessage && (<span style={{ fontSize: "12px", color: "red" }}>{customerNameErrorMessage}</span>)} */}

                <Box
                  sx={{
                    width: "100%",
                    // display: "flex",
                    display:"none",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    mb: 2,
                  }}
                >
                  <TextField
                    id="numberofguest"
                    label="Number of guests"
                    type="number"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      min: 0,
                      max: 50,
                    }}
                    onChange={handleGuestNo}
                    onKeyPress={handleGuestNoKeyPress}
                    error={!isValidGuestError}
                    helperText={
                      !isValidGuestError
                        ? "Please enter the digits between [0-50]"
                        : ""
                    }
                    sx={{ width: "100%", mr: 1 }}
                  />
                  {/* {NumberOfGuestError && (<span style={{ fontSize: "12px", color: "red" }}>{NumberOfGuestError}</span>)} */}
                  <TextField
                    label="Table number"
                    // defaultValue={params.tableNumber}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    inputProps={{ readOnly: true }}
                    sx={{ width: "100%" }}
                  />
                </Box>
                <Box sx={{display:"none"}}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  style={{
                    display: "flex",

                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextField
                    label="Date"
                    value={currentDate}
                    readOnly
                    sx={{ width: "49%", mr: 1 }}
                  />
                  <TimePicker
                    label="Time"
                    value={currentTime}
                    readOnly
                    sx={{ width: "48%" }}
                  />
                </LocalizationProvider>
                </Box>

              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={{ width: "100%", mb: 2, mx: 0 }}
                  onClick={saveCustomerInfo}
                  disabled={!isEmpty}
                  startIcon={<PlaceIcon/>}
                >
                  Check-In
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Paper>
    )}
    </React.Fragment>
  );
}
