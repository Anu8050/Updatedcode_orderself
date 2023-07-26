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
                              "https://media.istockphoto.com/id/1170315961/photo/white-plate-wooden-table-tablecloth-rustic-wooden-clean-copy-freepik-table-top-view-wallpaper.jpg?s=612x612&w=0&k=20&c=DHB3nUXj-OpIzWIN__QfyK--thApc9UIH-tDSzEGLWA="
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
                          {/*viewData?.ingredients?.join(", ")*/}
                          {viewData?.ingredients?.length > 0 ? (
                            viewData?.ingredients.join(", ")
                          ) : (
                            <p>Ingredients are empty.</p>
                          )}
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
