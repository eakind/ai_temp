<template>
  <div class="legend" :class="flag">
    <span class="text">
      {{titleTxt}}
      <span v-if="titleVal">:{{titleVal}}</span>
    </span>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    titleTxt: {
      type: String
    },
    titleVal: {
      type: [String, Number]
    }
  },
  computed: {
    flag () {
      let obj = {};
      obj['实际值'] = '';
      obj['提升曲线'] = '';
      obj['基准曲线'] = 'predict';
      obj['预测值'] = 'predict';
      obj['模型1'] = 'model1';
      obj['模型2'] = 'model2';
      obj.fpr = 'fpr';
      obj.tpr = 'tpr';
      obj.ks = 'ks';
      obj.PSI = 'PSI';
      return obj[this.titleTxt];
    }
  }
};
</script>
<style lang='scss' scoped>
.legend {
  width: 100px;
  height: 30px;
  color: #fff;
  position: relative;
  .text {
    position: absolute;
  }
  &::before{
    content: '';
    height: 4px;
    width: 48px;
    display: inline-block;
    background: #FCF8DF;
    left: -70px;
    top: 11px;
    border-radius: 4px;
    position: absolute;
  }
  &::after{
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50px;
    display: inline-block;
    background: #FCF8DF;
    left: -50px;
    top: 8px;
    position: absolute;
  }
}
.predict{
  &::before{
    background: #F6B421;
  }
  &::after{
    height: 12px;
    width: 5px;
    border-radius: 4px;
    background: #F6B421;
  }
}
.model1 {
  color: #4f89f3;
  &::before {
    background: #4f89f3;
  }
  &::after {
    background: #4f89f3;
  }
}
.model2 {
  color: #ef635c;
  &::before {
    background: #ef635c;
  }
  &::after {
    background: #ef635c;
  }
}
.fpr {
  color: #FCF8DF;
  &::before {
    background: #F5282D;
  }
  &::after {
    background: #F5282D;
  }
}
.tpr {
  color: #FCF8DF;
  &::before {
    background: #8543E0;
  }
  &::after {
    background: #8543E0;
  }
}
.ks {
  color: #FCF8DF;
  &::before {
    background: #FACC14;
  }
  &::after {
    background: #FACC14;
  }
}
.PSI {
  color: #FCF8DF;
  &::before {
    background: #FACC14;
  }
  &::after {
    background: #FACC14;
  }
}
</style>
