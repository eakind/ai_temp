<template>
  <Dialog title="分箱调整" :isShow='adjustmentFlag' :width='1278' @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">检查当前特征的分箱结果。支持对单独调整此特征的分箱设置。增加和减少分箱都在当前区间往右操作。</div>
    <div class="btn-box">
      <div class="btn" @click="adjustClick"><span class="iconfont icon-db_edit"></span>调整分箱</div>
      <div class="btn" @click="refreshClick"  v-if="refreshBtnFlag"><span class="iconfont icon-db_undocircle"></span>刷新计算</div>
    </div>
    <div class="table-box">
      <feature-table :headerTitle="headerTitle" :tableData="tableData" :headerArr="headerArr" :refreshFlag="refreshFlag" :refreshCode="refreshCode" type="binning"></feature-table>
      <div class="btns" v-if="operateBtnFlag">
        <span @click="adjustHandler">执行调整</span>
        <span @click="adjustCancel">放弃调整</span>
      </div>
    </div>
    <string-binning v-if="strEditFlag" :strEditFlag="strEditFlag" :cutList="cutList" :leftOpen="leftOpen" :rightOpen="rightOpen"
    @on-cancel="strCancel" @on-confirm="strConfirm"></string-binning>
    <int-binning v-if="intEditFlag" :intEditFlag="intEditFlag" :cutList="cutList" :leftOpen="leftOpen" :rightOpen="rightOpen"
     @on-cancel="cancel" @on-confirm="intConfirmHandler"></int-binning>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import FeatureTable from '../featureTable';
import StringBinning from './stringBinning.vue';
import IntBinning from './intBinning.vue';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  data () {
    return {
      headerTitle: [],
      headerArr: [],
      tableData: [],
      strEditFlag: false,
      intEditFlag: false,
      refreshFlag: false,
      cutList: [],
      leftOpen: false,
      rightOpen: false,
      refreshBtnFlag: false,
      operateBtnFlag: false,
      refreshCode: 1,
      refreshTime: ''
    };
  },
  components: {
    Dialog,
    FeatureTable,
    StringBinning,
    IntBinning
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['targetFeature', 'selectedFeature'])
  },
  props: {
    adjustmentFlag: {
      type: Boolean,
      default: false
    }
  },
  beforeDestroy () {
    // this.setSelectedBinning(null);
  },
  mounted () {
    // this.binningNumerical();
    if (this.selectedFeature.origin_data_type === 'STRING') {
      this.binningString();
    } else if (this.selectedFeature.origin_data_type === 'NUMBER') {
      this.binningNumerical();
    }
  },
  methods: {
    ...mapMutations('content', ['setSelectedBinning']),
    async binningNumerical (temp) {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx,
        tmp: temp
      };
      let res = await get('binningNumerical', params);
      if (res.code === 0) {
        if (temp) {
          // this.operateBtnFlag = true;
          this.refreshFlag = true;
        }
        this.headerTitle = res.data.columns;
        this.headerArr = res.data.columns;
        this.tableData = res.data.binning_result;
        this.cutList = res.data.cut_list;
        this.leftOpen = res.data.open_left;
        this.rightOpen = res.data.open_right;
        if (!this.refreshTime && temp) {
          this.refreshFlag = true;
          this.refreshTime = res.data.refresh_time;
        }
        if (this.refreshTime && this.refreshTime !== res.data.refresh_time) {
          this.refreshCode = 0;
          this.operateBtnFlag = true;
          this.refreshFlag = false;
        }
        if (this.refreshTime && this.refreshTime === res.data.refresh_time) {
          this.refreshCode = 1;
          this.operateBtnFlag = false;
          this.refreshFlag = true;
          this.refreshTime = res.data.refresh_time;
        }
      }
    },
    async binningString (temp) {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx,
        tmp: temp
      };
      let res = await get('binningString', params);
      if (res.code === 0) {
        this.refreshFlag = false;
        if (temp) {
          this.refreshFlag = true;
        }
        this.headerTitle = res.data.columns;
        this.headerArr = res.data.columns;
        this.tableData = res.data.binning_result;
        this.cutList = res.data.cut_list;
        this.leftOpen = res.data.open_left;
        this.rightOpen = res.data.open_right;
        if (!this.refreshTime && temp) {
          this.refreshFlag = true;
          this.refreshTime = res.data.refresh_time;
        }
        if (this.refreshTime && this.refreshTime !== res.data.refresh_time) {
          this.refreshCode = 0;
          this.operateBtnFlag = true;
          this.refreshFlag = false;
        }
        if (this.refreshTime && this.refreshTime === res.data.refresh_time) {
          this.refreshCode = 1;
          this.operateBtnFlag = false;
          this.refreshFlag = true;
          this.refreshTime = res.data.refresh_time;
        }
      }
    },
    cancelHandler () {
      if (this.operateBtnFlag) {
        this.adjustCancel();
      } else {
        this.$emit('on-cancel');
      }
    },
    confirmHandler () {
      this.$emit('on-confirm');
    },
    adjustClick () {
      this.refreshFlag = false;
      if (this.selectedFeature.origin_data_type === 'NUMBER') {
        this.intEditFlag = true;
      } else {
        this.strEditFlag = true;
      }
    },
    async intConfirmHandler (list, index) {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx,
        cut_list: list,
        tmp: true
      };
      let res = await post('postBinningNumerical', params);
      if (res.code === 0) {
        this.intEditFlag = false;
        this.refreshBtnFlag = true;
        this.refreshFlag = true;
        this.binningNumerical(true);
      }
    },
    refreshClick () {
      if (this.selectedFeature.origin_data_type === 'NUMBER') {
        this.binningNumerical(true);
      } else {
        this.binningString(true);
      }
    },
    cancel () {
      this.intEditFlag = false;
    },
    strCancel () {
      this.strEditFlag = false;
    },
    async strConfirm (list) {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx,
        cut_list: list,
        tmp: true
      };
      let res = await post('postBinningString', params);
      if (res.code === 0) {
        this.strEditFlag = false;
        this.refreshBtnFlag = true;
        this.refreshFlag = true;
        this.binningString(true);
      }
    },
    async adjustHandler () {
      if (this.selectedFeature.origin_data_type === 'NUMBER') {
        let params = {
          project_id: this.projectId,
          feature_idx: this.selectedFeature.feature_idx,
          cut_list: this.cutList
        };
        let res = await post('postBinningNumerical', params);
        if (res.code === 0) {
          this.$emit('on-cancel');
          this.bus.$emit('refreshFeatureList');
        }
      } else {
        let params = {
          project_id: this.projectId,
          feature_idx: this.selectedFeature.feature_idx,
          cut_list: this.cutList
        };
        let res = await post('postBinningString', params);
        if (res.code === 0) {
          this.$emit('on-cancel');
          this.bus.$emit('refreshFeatureList');
        }
      }
    },
    async adjustCancel () {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx
      };
      let res = await post('binningCancel', params);
      if (res.code === 0) {
        this.$emit('on-cancel');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  padding: 8px 0px;
  color: #A4A4A4;
  font-size: 12px;
  >span {
    text-decoration: underline;
    color: #F6B421;
  }
}
.btn-box {
  display: flex;
}
.btn {
  width: 104px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  background: #2B2B2B;
  text-align: center;
  border: 1px solid #444444;
  cursor: pointer;
  .iconfont {
    color: #F6B421;
    margin-right: 8px;
  }
  &:first-child {
    margin-right: 24px;
  }
}
.table-box {
  width: 100%;
  height: 500px;
  margin: 12px 0px;
  margin-bottom: 68px;
  background: #2B2B2B;
  border-radius: 4px;
  position: relative;
  /deep/ {
    .table-header {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
    }
    .body-list {
      background: #444444;
      line-height: 36px;
      height: 36px;
    }
    .item {
      background: none;
      color: #fff;
      font-weight: normal;
      width: 12%;
      position: relative;
      &:nth-child(1) {
        width: 16%;
      }
      &:nth-child(2) {
        width: 12%;
      }
      &:last-child {
        // color: #F6B421;
        &::after {
          background: none;
        }
      }
      &::after {
        content: '';
        height: 26px;
        width: 1px;
        background: #666666;
        position: absolute;
        right: 0px;
        top: 5px;
      }
    }
  }
  .btns {
    position: absolute;
    bottom: -66px;
    left: 324px;
    >span {
      display: inline-block;
      width: 160px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background: #F6B421;
      border-radius: 4px;
      cursor: pointer;
      &:nth-child(2) {
        background: #444444;
        margin-left: 160px;
      }
    }
  }
}
</style>
