import { Outlet } from "react-router-dom";

// material-ui
import { Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from 'react-router-dom';

// project imports
import ResponsiveAppBar from "../../components/ResponsiveAppBar/ResponsiveAppBar";

const MainLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const shouldHideComponent = location.pathname === '/dashboard/success' || location.pathname === '/dashboard/cancel';

  return (
    <>
      <ResponsiveAppBar hideComponent = {shouldHideComponent}></ResponsiveAppBar>
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
