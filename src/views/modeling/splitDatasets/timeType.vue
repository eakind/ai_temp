<template>
  <div class="time-type">
    <div class="list choose-list">
        <span>选择字段</span>
        <!-- <drop-list :list="list" :select="setSelectName" class="drop-list" @on-change="changeHandler"></drop-list> -->
          <select-input select="请选择" :list="list" @on-change="selectFeature"></select-input>
      </div>
      <div class="list">
        <span>训练集</span>
        <span class="left-interval" v-if="partitionType === 'NUMERICAL'">(-inf</span>
        <span class="left-interval" v-if="partitionType === 'TIME'">(-start</span>
        <input type="number" v-model="firstValue" @blur="blurHandler('firstValue')" @focus="focusHandler('firstValue')" v-if="partitionType === 'NUMERICAL'">
        <el-date-picker class="time-input" v-model="firstValue" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-if="partitionType === 'TIME'" @change="changeFirstTime"></el-date-picker>]
        <!-- <span class="num">42%</span> -->
        <span class="num" v-if="partitionType === 'TIME'">(选择时间点后将自动刷新比例)</span>
      </div>
      <div class="list">
        <span>测试集</span>
        <span class="left-interval" v-if="partitionType === 'NUMERICAL'">({{firstValue}}</span>
        <span class="left-interval" v-if="partitionType === 'TIME'">({{firstValue}}</span>
        <input type="number" v-model="secondValue" @blur="blurHandler('secondValue')" @focus="focusHandler('secondValue')" v-if="partitionType === 'NUMERICAL'">
        <el-date-picker class="time-input" v-model="secondValue" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-if="partitionType === 'TIME'" @change="changeSecondTime"></el-date-picker>]
        <!-- <span  class="num">41%</span> -->
        <span class="num" v-if="partitionType === 'TIME'">(选择时间点后将自动刷新比例)</span>
      </div>
      <div class="list">
        <span>隔离集</span>
        <span class="left-interval" v-if="partitionType === 'NUMERICAL'">({{secondValue}}</span>
        <span class="left-interval" v-if="partitionType === 'TIME'">({{secondValue}}</span>
        <span class="right-interval" v-if="partitionType === 'NUMERICAL'">inf]</span>
        <span class="right-interval time-input" v-if="partitionType === 'TIME'">end]</span>
        <!-- <span  class="num">17%</span> -->
      </div>
      <div class="list blank-list" v-if="currentSelect && currentSelect.missing_num > 0">
        <span>空值</span><span>已归入</span>
        <drop-list :list="typeList" :select="setSelectName" class="bottom-drop-list" @on-change="changeHandler"></drop-list>
      </div>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import SelectInput from '../../content/contentView/featureOperate/selectInput.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      firstValue: '',
      secondValue: '',
      list: [],
      setSelectName: '隔离集',
      currentSelect: null,
      typeList: [{
        name: '隔离集',
        value: 'ISOLATION_SET'
      }, {
        name: '训练集',
        value: 'TRAINING_SET'
      }, {
        name: '测试集',
        value: 'TEST_SET'
      }],
      misingType: 'ISOLATION_SET'
    };
  },
  props: {
    detailData: {
      type: Object
    },
    partitionType: {
      type: String
    }
  },
  components: {
    DropList,
    SelectInput
  },
  computed: {
    ...mapState(['projectId'])
  },
  watch: {
    list (val) {
      console.log(val);
    }
  },
  mounted () {
    this.getFeatureList();
  },
  methods: {
    async getFeatureList () {
      let params = {
        project_id: this.projectId,
        feature_list: 'FINAL',
        offset: 0,
        limit: 999999,
        data_type: this.partitionType === 'NUMERICAL' ? 'INT,FLOAT' : 'DATETIME'
      };
      let res = await get('featureList', params);
      if (res.code === 0) {
        this.list.push(...res.feature_list);
      }
    },
    changeHandler (item) {
      this.misingType = item.value;
      this.$emit('typeChange', this.misingType);
    },
    blurHandler (type) {
      this.$emit('change', Number(this.firstValue), Number(this.secondValue));
    },
    focusHandler (type) {
    },
    selectFeature (item) {
      this.currentSelect = item;
      this.$emit('select', this.currentSelect);
    },
    changeFirstTime (val) {
      this.firstValue = val;
      this.$emit('change', this.firstValue, this.secondValue);
    },
    changeSecondTime (val) {
      this.secondValue = val;
      this.$emit('change', this.firstValue, this.secondValue);
    }
  }
};
</script>
<style lang='scss' scoped>
.time-type {
  .list {
    display: flex;
    align-items: center;
    line-height: 38px;
    margin-bottom: 12px;
    >span:nth-child(1) {
      display: inline-block;
      width: 120px;
    }
    .drop-list {
      width: 160px;
    }
    .num {
      color: #A4A4A4;
      font-size: 12px;
      margin-left: 12px;
    }
    .left-interval {
      display: inline-block;
      width: 100px;
    }
    .right-interval {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 16px;
    }
    > input {
      padding: 0px 8px;
      margin: 0px;
      height: 30px;
      box-sizing: border-box;
      width: 64px;
      // margin-left: 18px;
      outline: none;
      border: none;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background: #333333;
      border: 1px solid #F6B421;
    }
    .time-input {
      width: 135px;
    }
  }
  .choose-list {
    padding-bottom: 16px;
    border-bottom: 1px solid #424242;
  }
  .blank-list {
    padding-top: 8px;
    border-top: 1px solid #424242;
  }
  .bottom-drop-list {
    margin-left: 16px;
  }
  /deep/ .bottom-drop-list {
    .list-panel {
      position: absolute;
      bottom: 36px;
    }
  }
  /deep/ .el-input__inner {
    background: #333333;
    color: #fff;
    border: 1px solid #F6B421;
  }
}
</style>
