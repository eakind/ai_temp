/**
 * 字符串转vm
 * @param {*} source
 * @param {*} viewportWidth
 * @param {*} unitPrecision
 * @param {*} viewportUnit
 * @param {*} minPixelValue
 */
const pxToVm = function (source, viewportWidth, unitPrecision, viewportUnit, minPixelValue) {
  const template = /\{([\s\S]+)\}/gi;
  // |left|right|bottom|top
  const ZPXRegExp = /"(width|height|size)":\s?(\d+)/;
  console.log(source);
  let _source = '';
  // 如果当前的source里面存在template
  if (template.test(source)) {
    // 匹配template部分
    _source = source.match(template)[0];
  }
  // 匹配出template里面的px
  let pxGlobalRegExp = new RegExp(ZPXRegExp.source, 'ig');
  if (pxGlobalRegExp.test(_source)) {
    let $source = _source.replace(pxGlobalRegExp, createPxReplace(viewportWidth, minPixelValue, unitPrecision, viewportUnit));
    return source.replace(template, $source);
  } else {
    return source;
  }
  function createPxReplace (viewportSize, minPixelValue, unitPrecision, viewportUnit) {
    viewportSize = document.documentElement.clientWidth;
    unitPrecision = unitPrecision || 2;
    viewportUnit = viewportUnit || 'vw';
    minPixelValue = minPixelValue || 1;
    return function ($1, $2, $3) {
      console.log($1, $2, $3);
      if (!$1) return;
      if (!$2) return;
      var pixels = parseFloat($3);
      //   if (pixels <= minPixelValue) return;
      return '"' + $2 + '"' + ':"' + toFixed((pixels / viewportSize * 100), unitPrecision) + viewportUnit + '"';
    };
  }
};
/**
 *单个size转vm
 * @param {} pixels
 * @param {*} viewportSize
 * @param {*} minPixelValue
 * @param {*} unitPrecision
 * @param {*} viewportUnit
 */
const sizeToVw = function (pixels, viewportSize, minPixelValue, unitPrecision, viewportUnit) {
  viewportSize = document.documentElement.clientWidth;
  unitPrecision = unitPrecision || 2;
  viewportUnit = viewportUnit || 'vw';
  minPixelValue = minPixelValue || 1;
  return toFixed((pixels / viewportSize * 100), unitPrecision) + viewportUnit;
};
function toFixed (number, precision) {
  var multiplier = Math.pow(10, precision + 1);
  var wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}

const getCurRouter = function (hash) {
  let hashIndex = hash.indexOf('#/');
  let curHash = hash;
  let paramsIndex = hash.indexOf('?');
  if (hashIndex >= 0) {
    curHash = hash.slice(hashIndex + 2);
  }
  if (paramsIndex >= 0) {
    curHash = curHash.slice(0, paramsIndex - 1);
  }
  return curHash;
};

const getQueryVariable = function (variable) {
  var curLocation = window.location.href;
  var queryIndex = curLocation.indexOf('?');
  var query = curLocation.slice(queryIndex + 1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return (false);
};

export {
  pxToVm,
  sizeToVw,
  getCurRouter,
  getQueryVariable
};
