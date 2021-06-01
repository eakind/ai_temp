/* eslint-disable no-undef */
const initTooltip = () => {
  let dom = document.querySelector('#tooltipChart');
  if (!dom) {
    dom = document.createElement('div');
    let styleStr1 = 'position: fixed;min-width: 120px;padding:8px;font-size:14px;color:white;';
    let styleStr2 = 'border-radius:4px;box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 3px;transfrom:translateX(-50%)';
    dom.id = 'tooltipChart';
    dom.style.cssText = styleStr1 + styleStr2;
    document.body.appendChild(dom);
  }
  return dom;
};

const showTooltip = (label, xrayObj, color, posObj) => {
  if (!xrayObj.feature_name) return;
  let d = Object.assign({
    feature_name: xrayObj.feature_name
  }, xrayObj[label]);
  let dom = document.querySelector('#tooltipChart');
  dom.style.background = `linear-gradient(180deg, ${colorRgba(color, 1)} 0%, ${colorRgba(color, 0.4)} 100%)`;
  dom.style.display = 'inline-block';
  dom.innerHTML = setContent(d);
  let domWidth = dom.clientWidth / 2;
  let domHeight = dom.clientHeight + 10;
  dom.style.left = `${posObj.x - domWidth}px`;
  dom.style.top = `${posObj.y - domHeight}px`;
  if (posObj.y < domHeight) {
    dom.style.top = `${posObj.y + 10}px`;
  };
  if (posObj.x < domWidth) {
    dom.style.left = `${posObj.x}px`;
  };
};

const colorRgba = (hex, alpha) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let color = hex.toLowerCase();
  if (color && reg.test(color)) {
    if (color.length === 4) {
      let newColor = '#';
      for (let i = 1; i < 4; i += 1) {
        newColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = newColor;
    }
    var changeColor = [];
    for (let i = 1; i < 7; i += 2) {
      changeColor.push(parseInt('0x' + color.slice(i, i + 2)));
    };
    return 'rgba(' + changeColor.join(',') + ',' + alpha + ')';
  } else {
    return color;
  }
};

const hideTooltip = () => {
  let dom = document.querySelector('#tooltipChart');
  dom.innerHTML = '';
  dom.style.display = 'none';
};

const setContent = (data) => {
  let content = '';
  for (let key in data) {
    content += `<div>
                  <span>${key}：</span><span>${data[key]}</span>
                </div>`;
  }
  let style = 'background: rgba(0,0,0,0.2);padding: 8px;border-radius:4px';
  content = `<div style="${style}">
            ${content}
        </div>`;
  return content;
};

export {
  initTooltip,
  showTooltip,
  hideTooltip
};
