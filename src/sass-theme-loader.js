// from https://github.com/jlpospisil/vue-components/blob/2c599a049365de41457c3dc119fd7ddb18244d28/src/theme-sass-loader.js

const sass = require('node-sass');
const sassUtils = require('node-sass-utils')(sass);
const theme = require("./user/settings");

const hexToRGBA = (hex) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return null;
  }

  let hexColor = hex.substring(1).split('');

  if (hexColor.length === 3) {
    hexColor = [hexColor[0], hexColor[0], hexColor[1], hexColor[1], hexColor[2], hexColor[2]];
  }

  return Number(`0xff${hexColor.join('')}`);
};

const convertStringToSassDimension = (result) => {
  // Only attempt to convert strings
  if (typeof result !== 'string') {
    return result;
  }

  const cssUnits = ['rem', 'em', 'vh', 'vw', 'vmin', 'vmax', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch'];
  const parts = result.match(/[a-zA-Z]+|[0-9]+/g);
  const value = parts[0];
  const unit = parts[parts.length - 1];

  // If the string has a unit
  if (cssUnits.indexOf(unit) !== -1) {
    return new sassUtils.SassDimension(parseInt(value, 10), unit);
  }

  // Else if the string is a hex color string, make sure we return a sass color
  //    to avoid errors when using darken, lighten, etc.
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(result)) {
    const rgba = hexToRGBA(result);
    return sass.types.Color(rgba);
  }

  return result;
};

// sass-loader function to return specific theme item
const getThemeItem = (keys) => {
  const themeItemValue = keys
    ? keys.getValue().split('.').reduce((object, item) => object[item] || {}, theme)
    : theme;
  let returnValue;

  if (themeItemValue) {
    if (typeof themeItemValue === 'string') {
      returnValue = convertStringToSassDimension(themeItemValue);
    } else if (typeof themeItemValue === 'object') {
      returnValue = Object.keys(themeItemValue).reduce((object, item) => {
        let itemKeys = `${keys ? `${sassUtils.castToJs(keys)}.` : ''}${item}`;
        itemKeys = sassUtils.castToSass(itemKeys);
        return {
          ...object,
          [item]: getThemeItem(itemKeys),
        };
      }, {});
    }
  }

  return sassUtils.castToSass(returnValue);
};

module.exports = {
  getThemeItem,
};