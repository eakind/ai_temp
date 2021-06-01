const numFormat = function (text) {
  if (text > 9999 || text < -9999) {
    return parseFloat(text).toExponential(1);
  } else if (text >= 1000) {
    return Number(text).toFixed(0);
  } else if (text >= 100) {
    return Number(text).toFixed(1);
  } else if (text >= 10) {
    return Number(text).toFixed(2);
  } else if (text >= 1) {
    return Number(text).toFixed(3);
  } else if (text >= 0.0001) {
    return Number(text).toFixed(4);
  } else if (text > 0) {
    return parseFloat(text).toExponential(1);
  } else if (text === 0) {
    return 0;
  } else if (text > -0.0001) {
    return parseFloat(text).toExponential(1);
  } else if (text > -1) {
    return Number(text).toFixed(4);
  } else if (text > -10) {
    return Number(text).toFixed(3);
  } else if (text > -100) {
    return Number(text).toFixed(2);
  } else if (text > -1000) {
    return Number(text).toFixed(1);
  } else {
    return Number(text).toFixed(0);
  }
};

export {
  numFormat
};
