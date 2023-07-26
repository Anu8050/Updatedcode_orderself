import { createTheme } from "@mui/material/styles";

// assets
import colors from "../assets/scss/_themes-vars.module.scss";

// project imports
import componentStyleOverrides from "./compStyleOverride";
import themePalette from "./palette";
import themeTypography from "./typography";

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export let theme = (customization) => {
  var defaultTheme = {
    primaryColor: "#fc8019",
    secondaryColor: "#000000",
    setDefault: true,
  };
  if (
    localStorage.getItem("defaultTheme") !== undefined &&
    localStorage.getItem("defaultTheme") != null
  ) {
    if (
      JSON.parse(localStorage.getItem("defaultTheme")).primaryColor !==
      undefined
    ) {
      defaultTheme = JSON.parse(localStorage.getItem("defaultTheme"));
    }
  }

  const color = colors;
  color.primaryMain =
    defaultTheme && defaultTheme.setDefault === true
      ? defaultTheme.primaryColor
      : color.primaryMain;
  color.secondaryMain =
    defaultTheme && defaultTheme.setDefault === true
      ? defaultTheme.secondaryColor
      : color.secondaryMain;

  const themeOption = {
    colors: color,
    heading: color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    backgroundDark: color.secondaryDark,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.secondaryDark,
    menuSelectedBack: color.secondaryLight,
    divider: color.grey200,
    customization,
  };

  const themeOptions = {
    direction: "ltr",
    palette: themePalette(themeOption),
    typography: themeTypography(themeOption),
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);
  return themes;
};

export default theme;
