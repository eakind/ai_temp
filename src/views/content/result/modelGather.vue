<template>
  <div class="model-gather">
    <div class="title">分析汇总</div>
    <div class="item" v-if="verifyResult">
      <span>Chi2 : <span>{{verifyResult.Chi2}}</span></span>
      <span>P : <span>{{verifyResult.P}}</span></span>
    </div>
    <div class="item" v-if="verifyResult">
      <span>AIC值 : <span>{{verifyResult.AIC}}</span></span>
      <span>BIC值 : <span>{{verifyResult.BIC}}</span></span>
    </div>
    <!-- <div class="item">因变量Y： featureName</div>
    <div class="item">***p&lt;0.01, **p&lt;0.05, *p&lt;0.1</div> -->
    <div class="tips" @click="isShow = !isShow" v-click-out="hide">指标解析</div>
    <div class="panel-box" v-if="isShow">
      <span class="icon"></span>
      <div class="panel">
        <div>
          <span>P值：判断X对Y是否呈现出显著性的影响，P&lt;0.05说明X会对Y产生影响关系。</span>
          <span>回归系数：回归系数值，当P小于0.05时有意义。</span>
          <span>OR值：优势比，值与1作比较，越接近1影响程度越小，反之影响程度越大。</span>
          <span>Pseudo R²：用于说明模型整体情况。</span>
          <span>拟合公式如：log(Y)= B+A*X</span>
        </div>
      </div>
    </div>
    <div class="table" v-if="list.length !== 0">
      <div class="table-header list">
        <span class="item" v-for="(item, hIdx) in headerList" :key="hIdx">{{item}}</span>
      </div>
      <scroll-list class="table-body" @loadMore="loadMore">
        <div class="body-list list" v-for="(item, tIdx) in list" :key="tIdx">
          <span class="item" v-for="(childItem, cIdx) in headerArr" :key="cIdx">{{item[childItem]}}</span>
        </div>
      </scroll-list>
    </div>
  </div>
</template>
<script>
import ScrollList from '@/components/scrollList/index.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      isShow: false,
      headerList: ['项', '回归系数', '标准误差', 'Z值', 'P值', 'OR值', 'OR值 95%CI (下限)', 'OR值 95%CI (上限)'],
      headerArr: ['项', '回归系数', '标准误差', 'Z值', 'P值', 'OR值', 'OR值95%CI下限', 'OR值95%CI上限'],
      list: [],
      verifyResult: null,
      timer: null
    };
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem'])
  },
  props: {
    isDownload: {
      type: String
    }
  },
  watch: {
    outputItem: {
      handler () {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.getModelSummary();
          this.getVerifyResult();
        }, 500);
      },
      deep: true,
      immediate: true
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData('liftChart');
          break;
        case 'image':
          size = {
            with: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#accuracyId');
          break;
      }
    }
  },
  components: {
    ScrollList
  },
  mounted () {},
  methods: {
    async getModelSummary () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      this.list = [];
      let res = await get('modelSummary', params);
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      this.list = data;
    },
    async getVerifyResult () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      this.verifyResult = null;
      let res = await get('verifyResult', params);
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      if (data && data.length) {
        this.verifyResult = data[0];
      }
    },
    hide () {
      this.isShow = false;
    },
    loadMore () {}
  }
};
</script>
<style lang='scss' scoped>
.model-gather {
  height: 100%;
  width: 100%;
  position: relative;
  .title {
    line-height: 32px;
    font-size: 16px;
    color: #F6B421;
    font-weight: bold;
  }
  .item {
    line-height: 32px;
    @include ellipsis;
    >span{
      display: inline-block;
      margin-right: 100px;
      >span{
        color: #F6B421;
      };
    }
  }
  .tips {
    position: absolute;
    right: 0px;
    top: 64px;
    color: #F6B421;
    cursor: pointer;
    text-decoration: underline;
  }
  .panel-box {
    position: absolute;
    right: 0px;
    top: 94px;
    z-index: 1;
  }
  .panel {
    width: 470px;
    height: 130px;
    padding: 8px;
    border-radius: 4px;
    background: #333;
    position: relative;
    >div {
      height: calc(100% - 16px);
      width: calc(100% - 16px);
      border-radius: 4px;
      padding: 8px;
      font-size: 12px;
      border: 1px solid #424242;
      >span {
        display: block;
        line-height: 24px;
      }
    }
  }
  .icon {
    display: inline-block;
    position: absolute;
    z-index: 1;
    right: 22px;
    top: -8px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid #333;
  }
  .table {
    height: calc(100% - 88px);
    width: 100%;
    margin-top: 12px;
    .list {
      height: 36px;
      >span {
        display: inline-block;
        font-size: 12px;
        height: 36px;
        width: calc(100% / 8);
        padding: 0px 4px;
        line-height: 36px;
        text-align: center;
        box-sizing: border-box;
        border-right: 1px solid #2B2B2B;
        border-bottom: 1px solid #2B2B2B;
        &:last-child {
          border-right: none;
        }
      }
    }
    .table-header {
      background: #333;
      >span {
        color: #FCF8DF;
        font-weight: 600;
      }
    }
    .body-list {
      background: #444444;
      >span {
        &:first-child {
          text-align: left;
        }
      }
    }
  }
}
</style>
