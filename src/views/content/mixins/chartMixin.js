const chartMixin = {
  data: () => {
    return {
      chartObj: {
        size: {
          width: 1000,
          height: 600
        },
        bindto: '',
        font: {
          size: 14
        },
        rotate: false,
        tooltip: {
          background: 'white',
          color: 'black'
        },
        padding: {
          left: 100,
          right: 100,
          top: 30,
          bottom: 50
        },
        data: [],
        x: {
          name: '',
          grid: {
            show: false,
            color: 'rgba(66,66,66,0.50)',
            width: 2
          },
          axis: {
            line: {
              show: true,
              color: '#F6B421',
              width: 2
            },
            ticks: {
              show: true,
              color: '#FCF8DF'
            },
            title: {
              show: false,
              color: '#FCF8DF'
            }
          }
        },
        y: {
          grid: {
            show: true,
            color: 'rgba(66,66,66,0.50)',
            width: 1
          },
          axis: {
            scale: 1,
            line: {
              show: true,
              color: '#F6B421',
              width: 2
            },
            ticks: {
              show: true,
              color: '#FCF8DF'
            },
            title: {
              show: false,
              color: '#FCF8DF'
            }
          }
        },
        y2: {
          axis: {
            line: {
              show: true,
              color: '#F6B421',
              width: 2
            },
            ticks: {
              show: true,
              color: '#FCF8DF'
            },
            title: {
              show: false,
              color: '#FCF8DF'
            }
          }
        },
        combined: []
      },
      barCombined: {
        type: 'bar',
        name: '',
        axis: 'y',
        style: {
          fill: 'rgba(246,180,33,1)',
          radius: 0,
          band: 20,
          padding: 0
        }
      },
      lineCombined: {
        type: 'line',
        name: '',
        axis: 'y2',
        style: {
          stroke: {
            color: '#2193F6',
            width: 3
          },
          point: {
            type: 'circle',
            size: 50,
            color: 'rgba(33,147,246)'
          },
          interpolate: false
        }
      }
    };
  },
  methods: {
    getPadding (type, list) {
      let max = '';
      for (let i = 0; i < list.length; i++) {
        if (!list[i][type]) continue;
        if (max < list[i][type]) max = list[i][type];
      }
      return String(Math.ceil(max)).length * 15;
    },
    appendChart (dom) {
      dom.innerHTML = '';
      // if (document.body.clientWidth < 1400) {
      //   this.$set(this.chartObj.font, 'size', 12);
      // }
      let div = document.createElement('div');
      div.id = this.chartObj.bindto.slice(1);
      dom.appendChild(div);
      // eslint-disable-next-line no-undef
      if (ai) {
        // eslint-disable-next-line no-undef
        ai.generate(this.chartObj);
      }
    },
    setData (list, index) {
      let data = [];
      let name = '';
      let range = '';
      let value = '';
      let dataObj = list[0];
      // eslint-disable-next-line no-prototype-builtins
      if (dataObj.hasOwnProperty('start')) {
        name = 'start';
        range = 'Range';
        value = 'frequency';
        data = this.setHasStart(index || list.length, list);
      // eslint-disable-next-line no-prototype-builtins
      } else if (dataObj.hasOwnProperty('value')) {
        name = 'value';
        range = 'value';
        value = 'frequency';
        data = this.setHasValue(index || 40, list);
      }
      return [data, name, range, value];
    },
    setHasValue (len, data) {
      let arr = [];
      for (let i = 0; i < len; i++) {
        if (!data[i]) continue;
        if (!data[i].frequency) continue; // 过滤掉frequency无效的值
        if (data[i].value === '') {
          data[i].value = this.$t('missingNum');
        }
        arr.push({
          frequency: +data[i].frequency,
          target: +data[i].target,
          value: data[i].value
        });
      }
      // let last = data.length - 1;
      // if (!data[last].value) { // 判断最后一组数据是否有缺失
      //   if (last === 0) arr = [];
      //   arr.push({
      //     frequency: +data[last].frequency,
      //     target: +data[last].target,
      //     value: this.$t('missingNum')
      //   });
      // }
      return arr;
    },
    setHasStart (len, data) {
      let group = Math.floor(data.length / len); // 分多少组
      let arr = [];
      for (let i = 0; i < len; i++) {
        let obj = {
          start: data[i * group].start // 图表的横坐标
        };
        if (data[i * group].start === '') {
          obj = {
            start: this.$t('missingNum'),
            Range: this.$t('missingNum')
          };
        }
        obj.Range = `[${data[i * group].start}, ${data[i * group + group - 1].end})`; // 为了展示toolTip中range值
        let freGroup = 0; // 一组中frequency的总值
        let tarGroup = 0; // 一组中target*frequency的总值
        for (let j = 0; j < group; j++) {
          let frequency = +data[i * group + j].frequency;
          let target = +data[i * group + j].target;
          freGroup += frequency;
          tarGroup += target * frequency;
        }
        // if (!freGroup) continue; // 过滤掉一组中无效频数的数据
        obj.frequency = freGroup;
        if (freGroup === 0) {
          obj.target = '';
        } else {
          obj.target = +(tarGroup / freGroup).toExponential(3);
        }
        arr.push(obj);
      }
      let last = data.length - 1;
      if (!data[last].end || !data[last].start) { // 判断最后一组数据中是否有缺失
        if (last === 0) arr = [];
        arr.push({
          frequency: +data[last].frequency,
          target: +data[last].target,
          start: this.$t('missingNum'),
          Range: this.$t('missingNum')
        });
      }
      arr = this.setNoTarget(arr);
      return arr;
    },
    setNoTarget (arr) {
      let list = [];
      for (let i = 0; i < arr.length; i++) {
        let obj = JSON.parse(JSON.stringify(arr[i]));
        if (obj.target === '') {
          obj.noTip = 'target';
          let [pre, preNum] = this.setPreNum(arr, i, 'target');
          let [next, nextNum] = this.setNextNum(arr, i, 'target');
          obj.target = pre + ((next - pre) / (preNum + nextNum)) * preNum;
        }
        list.push(obj);
      }
      list = this.setBeginDraw(list, 0);
      list = this.setEndDraw(list, list.length - 1);
      return list;
    },
    setEndDraw (list, index) {
      if (!list[index].noTip) {
        return list;
      } else {
        list[index].noDraw = list[index].noTip;
        return this.setEndDraw(list, --index);
      }
    },
    setBeginDraw (list, index) {
      if (!list[index].noTip) {
        return list;
      } else {
        list[index].noDraw = list[index].noTip;
        return this.setBeginDraw(list, ++index);
      }
    },
    setPreNum (arr, index, type) {
      let num = -1;
      for (let i = index; i >= 0; i--) {
        num++;
        if (arr[i][type] !== '') {
          return [arr[i][type], num];
        }
      }
      return [0, 1];
    },
    setNextNum (arr, index, type) {
      let num = -1;
      for (let i = index; i < arr.length; i++) {
        num++;
        if (arr[i][type] !== '') {
          return [arr[i][type], num];
        }
      }
      return [0, 1];
    }
  }
};

export {
  chartMixin
};
