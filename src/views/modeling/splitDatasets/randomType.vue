<template>
  <div class="random-type">
    <div class="list">
        <span>训练集</span>
        <input type="number" v-model="validation" @blur="blurHandler('validation')">
        <span>%</span>
        <span>可调区间40%-80%</span>
      </div>
      <div class="list">
        <span>测试集</span>
        <input type="number" v-model="cvFolds" @blur="blurHandler('cvFolds')">
        <span>%</span>
        <span>可调区间10%-40%</span>
      </div>
      <div class="list">
        <span>隔离集</span>
        <span class="no-input">{{holdout}}</span>
        <span>%</span>
        <span>可调区间10%-30%</span>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      validation: '',
      cvFolds: '',
      holdout: ''
    };
  },
  props: {
    detailData: {
      type: Object
    }
  },
  // props: {
  //   validation: {
  //     type: String
  //   },
  //   cvFolds: {
  //     type: String
  //   },
  //   holdout: {
  //     type: String
  //   }
  // },
  watch: {
    detailData: {
      handler (list) {
        if (list) {
          this.cvFolds = list.validation_percent;
          this.holdout = list.holdout_percent;
          this.validation = 100 - (Number(this.holdout) + Number(this.cvFolds));
        }
      },
      deep: true,
      immediate: true
    },
    validation (val) {
      if (isNaN(val)) {
        this.validation = '';
        return '';
      }
    },
    cvFolds (val) {
      if (isNaN(val)) {
        this.cvFolds = '';
        return '';
      }
    }
  },
  methods: {
    blurHandler (type) {
      let total = 100;
      this.holdout = total - (Number(this.validation) + Number(this.cvFolds));
      this.$emit('change', Number(this.validation), Number(this.cvFolds), Number(this.holdout));
    }
  }
};
</script>
<style lang='scss' scoped>
.list {
  display: flex;
  align-items: center;
  line-height: 38px;
  margin-bottom: 12px;
  >span:nth-child(1) {
    display: inline-block;
    width: 120px;
  }
  >span:nth-child(3) {
    margin: 0px 16px;
  }
  >span:nth-child(4) {
    color: #A4A4A4;
    font-size: 12px;
  }
  .no-input {
    padding: 0px 8px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    width: 64px;
    margin-left: 18px;
    color: #fff;
    border-radius: 4px;
    background: #8C8C8C;
  }
  > input {
    padding: 0px 8px;
    margin: 0px;
    height: 30px;
    box-sizing: border-box;
    width: 64px;
    margin-left: 18px;
    outline: none;
    border: none;
    font-size: 14px;
    color: #fff;
    border-radius: 4px;
    background: #333333;
    border: 1px solid #F6B421;
  }
}
</style>
