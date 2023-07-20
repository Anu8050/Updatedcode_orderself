// material-ui
import { CircularProgress } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

// styles
const LoaderWrapper = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 1301,
  width: "100vw",
  height: "100vh",
  transform: "translate(-50%, -50%)",
  display:"flex",
  alignItems:"center",
  justifyContent:"center"
});

// ==============================|| LOADER ||============================== //
const Loader = () => (
  <LoaderWrapper>
    <CircularProgress color="primary" />
  </LoaderWrapper>
);

export default Loader;
