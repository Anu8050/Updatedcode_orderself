"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.theme = void 0;

var _styles = require("@mui/material/styles");

var _themesVarsModule = _interopRequireDefault(require("../assets/scss/_themes-vars.module.scss"));

var _compStyleOverride = _interopRequireDefault(require("./compStyleOverride"));

var _palette = _interopRequireDefault(require("./palette"));

var _typography = _interopRequireDefault(require("./typography"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// assets
// project imports

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */
var theme = function theme(customization) {
  var defaultTheme = {
    primaryColor: "#fc8019",
    secondaryColor: "#000000",
    setDefault: true
  };

  if (localStorage.getItem("defaultTheme") !== undefined && localStorage.getItem("defaultTheme") != null) {
    if (JSON.parse(localStorage.getItem("defaultTheme")).primaryColor !== undefined) {
      defaultTheme = JSON.parse(localStorage.getItem("defaultTheme"));
    }
  }

  var color = _themesVarsModule["default"];
  color.primaryMain = defaultTheme && defaultTheme.setDefault === true ? defaultTheme.primaryColor : color.primaryMain;
  color.secondaryMain = defaultTheme && defaultTheme.setDefault === true ? defaultTheme.secondaryColor : color.secondaryMain;
  var themeOption = {
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
    customization: customization
  };
  var themeOptions = {
    direction: "ltr",
    palette: (0, _palette["default"])(themeOption),
    typography: (0, _typography["default"])(themeOption)
  };
  var themes = (0, _styles.createTheme)(themeOptions);
  themes.components = (0, _compStyleOverride["default"])(themeOption);
  return themes;
};

exports.theme = theme;
var _default = theme;
exports["default"] = _default;