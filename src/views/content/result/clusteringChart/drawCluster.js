/* eslint-disable no-undef */
import { scaleLinear, initAxis, createAxis, getDataValue, createCanvas } from './utils';
import { hideTooltip, initTooltip, showTooltip } from './tooltip';
const drawCluster = (id, data, pointData, selectLabel) => {
  let dom = document.querySelector(id);
  dom.innerHTML = '';
  let height = dom.clientHeight;
  let width = dom.clientWidth;
  let conatiner = initContainer(id);
  let leftAxis = conatiner.append('g');
  let bottomAxis = conatiner.append('g');
  let cavnas = conatiner.append('g');
  let { yMax, yMin, xMin, xMax, labelList } = getDataValue(data);

  // 初始化生成
  initTooltip();
  // Y坐标轴相关信息
  let yHeight = height - 40;
  let scaleY = scaleLinear(yMin, yMax, yHeight);
  let axisY = initAxis(scaleY, 'left', yHeight, 10);
  // X坐标轴相关信息
  let xWidth = width - 40;
  let scaleX = scaleLinear(xMin, xMax, xWidth, true);
  let axisX = initAxis(scaleX, 'bottom', xWidth, 10);
  // 生成y轴跟x轴
  createAxis(leftAxis, axisY, scaleX, true);
  createAxis(bottomAxis, axisX, scaleY, false);
  let { list, colorObj } = createLabelColor(labelList);
  createCanvas(cavnas, list, data, scaleX, scaleY, colorObj, selectLabel, pointData);
  // if (posObj && selectLabel.name) {
  //   showTooltip(selectLabel.name, xrayObj, selectLabel.color, posObj);
  // } else {
  //   hideTooltip();
  // }
  return list;
};

const showLabelInfo = (selectLabel, xrayObj, posObj) => {
  d3.selectAll('.line-path')
    .attr('opacity', (d) => {
      if (!selectLabel.name) return 1;
      if (selectLabel.name === d.label) return 1;
      return 0.1;
    });
  if (posObj && selectLabel.name) {
    showTooltip(selectLabel.name, xrayObj, selectLabel.color, posObj);
  } else {
    hideTooltip();
  }
};

const initContainer = (id) => {
  let container = d3.select(id).append('svg')
    .style('width', '100%')
    .style('height', '100%')
    .on('click', function () {
      let className = d3.event.target.className.baseVal;
      if (className !== 'line-path') {
        hideTooltip();
        let event = new CustomEvent('cancelDom');
        window.dispatchEvent(event);
      }
    }, true);
  return container;
};

// 给分组分配颜色
const createLabelColor = (labelList) => {
  let list = [];
  let colorObj = {};
  for (let i = 0, len = labelList.length; i < len; i++) {
    let obj = {
      name: labelList[i],
      color: colorStack(i)
    };
    list.push(obj);
    colorObj[labelList[i]] = obj.color;
  }
  return {
    list,
    colorObj
  };
};

const colorStack = (index) => {
  let colorList = ['#FACC14', '#F5282D', '#8543E0', '#3FAECC', '#3110D0', '#F59E28', '#DE2393',
    '#91BA38', '#99B4BF', '#216A58', '#AB9438', '#F4999B', '#C9BFE1', '#055166', '#1F135A', '#43140A',
    '#96005A', '#8D8D8D'];
  let len = colorList.length;
  if (index < len) {
    return colorList[index];
  };
  let num = index % len;
  return colorList[num];
};

export {
  drawCluster,
  showLabelInfo
};
