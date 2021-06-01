/* eslint-disable no-undef */
// 返回线性刻度值
const scaleLinear = (minValue, maxValue, height, isBottom) => {
  if (minValue > 0) minValue = 0;
  let scale = d3.scaleLinear()
    .domain([minValue * 1.1, maxValue * 1.1])
    .range(isBottom ? [0, height] : [height, 0])
    .nice();
  return scale;
};

// 初始化轴信息
const initAxis = (scale, position, height, tickNum) => {
  let scaleObj = {
    bottom: d3.axisBottom(scale),
    left: d3.axisLeft(scale)
  };
  let axis = scaleObj[position]
    .tickPadding(6)
    .tickSizeInner(0)
    .tickSizeOuter(0);
  if (position === 'left') {
    let num = tickNum || Math.floor(height / 50);
    if (!num) num = 1;
    let arr = setTickValues(scale.domain(), num);
    axis.tickValues(arr);
  }
  return axis;
};

// 生成刻度值
const setTickValues = (domain, counts) => {
  if (!counts) return null;
  let tickArray = [];
  let gap = Math.ceil((domain[1] - domain[0]) / counts);
  for (let i = 0; i <= counts; i++) {
    tickArray.push(domain[0] + gap * i);
  }
  return tickArray;
};

const createAxis = (axisContainer, axis, scale, isYAxis) => {
  axisContainer.append('g')
    .attr('transform', () => {
      let x = isYAxis ? scale(0) : 0;
      let y = isYAxis ? 0 : scale(0);
      return `translate(${x},${y})`;
    })
    .call(axis);
  // 隐藏轴文字
  axisContainer.selectAll('text')
    .attr('opacity', 0);
  // 隐藏轴线
  axisContainer.selectAll('path')
    .attr('opacity', 0);
};

// 遍历数组，返回y轴最大值最小值、x轴最大值最小值以及分组相关信息
const getDataValue = (data) => {
  let yMin = 0;
  let yMax = 0;
  let xMin = 0;
  let xMax = 0;
  let labelList = [];
  for (let i = 0, len = data.length; i < len; i++) {
    let x = Number(data[i].emb1);
    let y = Number(data[i].emb2);
    if (yMin > y) yMin = y;
    if (yMax < y) yMax = y;
    if (xMin > x) xMin = x;
    if (xMax < x) xMax = x;
    labelList.push(data[i].label);
  }
  labelList = [...new Set(labelList)];
  return {
    yMin,
    yMax,
    xMin,
    xMax,
    labelList
  };
};

const isCenter = (d, pointData) => {
  let point = pointData.filter(item => item.label === d.label)[0];
  if (point.emb1 === d.emb1 && point.emb2 === d.emb2) {
    return true;
  }
  return false;
};

// 生成数据点
const createCanvas = (cavnas, list, data, scaleX, scaleY, colorList, selectLabel, pointData) => {
  let arc = d3.symbol().type(d3.symbolCircle).size(80);
  let circle = cavnas.selectAll('circle').data(data).enter();
  circle.append('path')
    .attr('class', 'line-path')
    .attr('d', arc)
    .attr('transform', function (d) {
      return `translate(${scaleX(d.emb1)}, ${scaleY(d.emb2)})`;
    })
    .attr('fill', function (d) {
      // 判断是否是中心点
      if (isCenter(d, pointData)) {
        let posObj = {
          x: this.getBoundingClientRect().left,
          y: this.getBoundingClientRect().top
        };
        for (let i = 0, len = list.length; i < len; i++) {
          if (list[i].name === d.label) {
            list[i].posObj = JSON.parse(JSON.stringify(posObj));
            break;
          }
        }
      }
      return colorList[d.label];
    })
    .on('click', function (d) {
      let posObj = {
        x: this.getBoundingClientRect().left,
        y: this.getBoundingClientRect().top
      };
      let event = new CustomEvent('selectDom', {
        detail: {
          data: d,
          posObj: posObj
        }
      });
      window.dispatchEvent(event);
    }, false);
};

export {
  scaleLinear,
  initAxis,
  createAxis,
  getDataValue,
  createCanvas
};
