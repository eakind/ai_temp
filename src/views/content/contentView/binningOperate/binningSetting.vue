<template>
  <div class="binning-setting">
    <div class="tips">请设置边界和执行分箱的方式。上一步选择的特征将统一按设定进行分箱。</div>
    <div class="setting-panel">
      <div class="top-panel">
        <div class="bottom-line">分箱算法</div>
        <el-radio class="radio-box" v-model="checkValue" label="no">无监督分箱</el-radio>
        <div class="setting-box">
          <drop-list :list="strategyList" :select="strategyName" class="drop-list" @on-change="changeStrategy"></drop-list>
          分箱数
          <input type="number" class="input" v-model="binsNum" @input="inputHandler">
          <span>分箱数可设为2-30的整数</span>
        </div>
        <el-radio class="radio-box" v-model="checkValue" label="yes" v-if="modelType !== 'CLUSTERING'">有监督分箱</el-radio>
        <div class="setting-box" v-if="modelType !== 'CLUSTERING'">
          <drop-list :list="typeList" :select="typeName" class="drop-list" @on-change="changeType"></drop-list>
          <el-checkbox v-model="checked" class="check-box">自动单调性合并</el-checkbox>
        </div>
      </div>
      <div class="bottom-panel">
        <div v-for="(item, index) in tipsList" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="btns">
      <span class="next-btn" @click="pre()">上一步</span>
      <span class="next-btn" @click="next()">下一步</span>
      <span class="cancel-btn" @click="cancel()">取消</span>
    </div>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      checkValue: 'no',
      strategyList: [{
        name: '等频',
        value: 'quantile'
      }, {
        name: '等宽',
        value: 'uniform'
      }, {
        name: '聚类',
        value: 'kmeans'
      }],
      typeList: [{
        name: '决策树',
        value: 'decision_tree'
      }, {
        name: '卡方',
        value: 'chimerge'
      }],
      checked: true,
      tipsList: ['请注意：', '1.字符型特征', '无监督分箱：按照频数排序后分成指定箱数。',
        '有监督分箱：按照出现频率大于6%的字符单独一箱，其余合并为一箱的方式进行分箱。',
        '2.时间型特征（批量分箱时，不进行处理）',
        '不支持分箱，请先用“特征修改”转换类型。时间型支持转换为字符、时间戳（可以先转换为字符后再转换为数值型）。'
      ],
      binsNum: 2,
      strategy: 'quantile',
      binningType: 'decision_tree',
      strategyName: '等频',
      typeName: '决策树'
    };
  },
  computed: {
    ...mapState(['modelType']),
    ...mapState('content', ['binningAutoParams'])
  },
  components: {
    DropList
  },
  mounted () {
    if (this.modelType === 'REGRESSION') {
      let list = JSON.parse(JSON.stringify(this.typeList));
      this.typeList = list.splice(0, 1);
    }
    if (this.binningAutoParams.binning_type === 'unsuperviser') {
      // 无监督分箱
      this.checkValue = 'no';
      let key = this.binningAutoParams.strategy;
      for (let i in this.typeList) {
        if (this.strategyList[i].value === key) {
          this.strategyName = this.strategyList[i].name;
        }
      }
      this.binsNum = Number(this.binningAutoParams.n_bins);
      // this.typeName = this.settingList[key];
    } else {
      this.checkValue = 'yes';
      let key = this.binningAutoParams.binning_type;
      for (let i in this.typeList) {
        if (this.typeList[i].value === key) {
          this.typeName = this.typeList[i].name;
        }
      }
      this.checked = this.binningAutoParams.sort_flag;
    }
  },
  methods: {
    changeType (item) {
      this.binningType = item.value;
    },
    changeStrategy (item) {
      this.strategy = item.value;
    },
    next () {
      if (this.checkValue === 'no') {
        // 无监督分箱
        // this.binningAutoParams.binning_type = this.binningType;
        this.binningAutoParams.binning_type = 'unsuperviser';
        this.binningAutoParams.n_bins = Number(this.binsNum);
        this.binningAutoParams.strategy = this.strategy;
        delete this.binningAutoParams.sort_flag;
        if (Number(this.binsNum) < 2 || Number(this.binsNum) > 30) {
          this.$message({
            message: '分箱数为2-30的整数',
            type: 'warning'
          });
          return;
        }
      } else if (this.checkValue === 'yes') {
        // 有监督分箱
        this.binningAutoParams.binning_type = this.binningType;
        this.binningAutoParams.n_bins = null;
        this.binningAutoParams.strategy = null;
        this.binningAutoParams.sort_flag = this.checked;
      }
      this.$emit('on-next', 2);
    },
    pre () {
      this.$emit('on-pre', 0);
    },
    cancel () {
      this.$emit('on-cancel');
    },
    inputHandler () {
      let str = '' + this.binsNum;
      if (str.indexOf('.') !== -1) {
        let arr = str.split('');
        arr.splice(arr.length - 1);
        let str2 = arr.join('');
        this.binsNum = +str2;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.binning-setting {
  color: #ffffff;
  font-size: 14px;
  .tips {
    padding: 8px 0px;
    color: #A4A4A4;
    font-size: 12px;
  }
  .setting-panel {
    background: #444444;
    padding: 16px;
    border-radius: 4px;
    .top-panel {
      padding-bottom: 18px;
      border-bottom: 1px solid #666666;
    }
  }
  .bottom-line {
    position: relative;
    &::after {
      content: '';
      height: 1px;
      width: 26px;
      background: #F6B421;
      left: 0px;
      bottom: -5px;
      position: absolute;
    }
    > span {
      color: #A4A4A4;
      font-size: 12px;
      margin-left: 18px;
    }
  }
  .radio-box {
    margin: 18px 0px 12px 0px;
  }
  .setting-box {
    margin-left: 24px;
    .drop-list {
      width: 120px;
      height: 32px;
      line-height: 32px;
      margin-right: 12px;
    }
    .check-box {
      background: none;
      width: 200px;
    }
    .input {
      margin: 0px 8px;
      display: inline-block;
      width: 64px;
      height: 32px;
      line-height: 32px;
      padding: 0px 8px;
      background: #333333;
      border-radius: 4px;
      text-align: left;
      box-sizing: border-box;
      outline: none;
      border: none;
      font-size: 14px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    >span:last-child {
      font-size: 12px;
    }
  }
  .bottom-panel {
    color: #A4A4A4;
    font-size: 12px;
    padding-top: 8px;
  }
  .btns {
    margin-top: 14px;
    line-height: 46px;
    display: flex;
    justify-content: center;
    >span {
      display: inline-block;
      width: 80px;
      margin: 0px 20px;
      cursor: pointer;
    }
    .next-btn {
      color: #F6B421;
    }
    .cancel-btn {
      color: #A4A4A4;
    }
  }
}
</style>
<style lang='scss'>
.binning-setting {
  .el-checkbox:hover {
    border: none;
  }
}
</style>
