import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent, Stack, Grid
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import "react-toastify/dist/ReactToastify.css";
import { margin, textAlign } from "@mui/system";

const ViewMenuPopUp = ({viewData,...props}) => {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    props.handleCloseDialog(false);
  };
// console.log(viewData);
  return (
    <div style={{ margin: "0px" }}>
      <React.Fragment>
        <Dialog
          open={props.isDialogOpened}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
          // PaperProps={{ sx: { height:"55%" } }}
        >
          <div className="container" style={{ width: "100%", height: "100%" }}>
            <DialogTitle id="max-width-dialog-title">
              <Grid
                container
                rowSpacing={1}
              >
                <Grid item xs={11}>
                  <strong >Menu Item </strong>
                </Grid>
                <Grid item xs={1} style={{ textAlign: "center" }}>
                  <CancelRoundedIcon
                    onClick={handleClose}
                    className="closeIcon"
                  />
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent style={{ borderTop: "0.15em solid #FC8019", height: "calc(100% - 64px)" }}
            >
              <Stack spacing={2} padding={1}>
                {/* {props.viewData.map((doc) => { */}
                  {/* if (doc.id == props.menuId) */}
                    {/* return ( */}
                      <div
                        key={viewData?.id}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        {viewData?.imageUrl !== undefined ? (
                          <img
                            src={viewData?.imageUrl}
                            style={{
                              width: "100%",
                              height: "15rem",
                              margin: "22px 0px",
                              borderRadius:"5px"
                            }}
                          />
                        ) : (
                          <img
                            src={
                              "data:image/jpeg;base64,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"
                            }
                            style={{
                              width: "100%",
                              height: "15rem",
                              margin: "22px 0px",
                            }}
                          />
                        )}
                        {/* {console.log(doc.imageUrl)} */}
                        <strong
                          style={{ alignSelf: "flex-start", fontSize: "1.2rem" }}
                        >
                          {" "}
                          {viewData?.foodName}
                          {" "}
                          ({viewData?.foodCategoryName})
                        </strong>
                        <p
                          style={{ alignSelf: "flex-start", color: "#767C87" }}
                        >
                          {viewData?.foodDescription}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{display:"grid",gridTemplateColumns: "1fr 5fr",gridColumnGap:"10px"}}>
                          <strong style={{fontSize: "1.2rem"}}>Ingredients</strong>
                          <hr
                            style={{
                              width: "100%",
                              height:"0px",
                              margin:"auto",
                              textAlign:"right"
                              // alignSelf: "flex-end",
                            }}
                          />
                          </div>
                          
                        </div>
                        <div style={{ display: "flex", color: "#767C87" }}>
                          {/* {viewData?.ingredients?.map((item) => {
                            return <div>{item},&nbsp;</div>;
                          }) }   */}
                          {viewData?.ingredients?.join(", ")}
                        </div>
                      </div>
                    {/* ); */}
                {/* })} */}
              </Stack>
            </DialogContent>
          </div>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

ViewMenuPopUp.propTypes = {};

ViewMenuPopUp.defaultProps = {};

export default ViewMenuPopUp;
