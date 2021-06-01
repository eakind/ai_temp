<template>
  <div class="split-datasets">
    <div class="title">切割数据集</div>
    <div class="tips">请确认各项设置</div>
    <div class="step">
      <span>1.选择切割方式</span>
      <drop-list :list="typeList" :select="setSelectName" class="drop-list" @on-change="changeHandler"></drop-list>
    </div>
    <div class="step">
      <div>2.划分数据集</div>
      <div class="tips" v-if="type === 'STRATIFY'">更改训练集或测试集比例后，隔离集比例将自动更新。隔离集比例不高于30%。</div>
      <div class="operate-panel">
        <div class="list" v-if="type === 'NUMERICAL' || type === 'TIME'">
          <span>选择字段</span><span v-if="detailData && detailData.cut_feature_name">{{detailData.cut_feature_name}}</span>
        </div>
        <div class="list">
          <span>训练集</span><span class="left-interval" v-if="type !== 'STRATIFY' && detailData && detailData.first_value">(-inf</span>
          <span class="right-interval" v-if="type !== 'STRATIFY' && detailData && detailData.first_value">{{detailData.first_value.split(' ')[0]}}]</span>
          <span class="num" v-if="detailData.validation_percent && detailData.holdout_percent">{{100 - Number(detailData.validation_percent) - Number(detailData.holdout_percent)}}%</span>
        </div>
        <div class="list">
          <span>测试集</span><span class="left-interval" v-if="type !== 'STRATIFY' && detailData && detailData.first_value">({{detailData.first_value.split(' ')[0]}}</span>
          <span class="right-interval" v-if="type !== 'STRATIFY' && detailData && detailData.second_value">{{detailData.second_value.split(' ')[0]}}]</span>
          <span  class="num" v-if="detailData.validation_percent">{{detailData.validation_percent}}%</span>
        </div>
        <div class="list">
          <span>隔离集</span><span class="left-interval" v-if="type !== 'STRATIFY' && detailData && detailData.second_value">({{detailData.second_value.split(' ')[0]}}</span>
          <span class="right-interval" v-if="type !== 'STRATIFY' && detailData && detailData.second_value">inf]</span>
          <span  class="num" v-if="detailData.holdout_percent">{{detailData.holdout_percent}}%</span>
        </div>
        <div class="list" v-if="detailData.missing_belong_type && type === 'NUMERICAL' || type === 'TIME'">
          <span>空值</span><span>已归入{{setMissingType}}</span>
        </div>
        <div class="update-btn" @click="dialogFlag = true" v-if="!isOperated">
          <span class="iconfont icon-db_edit"></span>
          更新
        </div>
        <div class="calcel-btn" @click="cancelCalculate" v-if="isOperated">
          <span class="iconfont icon-db_plus"></span>
          放弃计算
        </div>
      </div>
    </div>
    <split-Setting :dialogFlag="dialogFlag" v-if="dialogFlag" :partitionType="type" :detailData="detailData" @confirm="confirmHandler" @cancel="cancelHandler"></split-Setting>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import SplitSetting from './splitDatasets/splitSetting.vue';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      typeList: [{
        name: '分层抽样',
        value: 'STRATIFY'
      }, {
        name: '按数值切割',
        value: 'NUMERICAL'
      }, {
        name: '按时间切割',
        value: 'TIME'
      }, {
        name: '随机抽样',
        value: 'RANDOM'
      }],
      type: 'STRATIFY',
      dialogFlag: false,
      detailData: {
        cut_feature_name: null,
        first_value: null,
        second_value: null,
        partition_method: null,
        cut_feature_idx: null,
        validation_percent: null,
        holdout_percent: null,
        missing_belong_type: null
      },
      isOperated: false
    };
  },
  mixins: [createWs],
  components: {
    DropList,
    SplitSetting
  },
  computed: {
    ...mapState(['projectId', 'modelType']),
    setSelectName () {
      let str = '';
      if (this.modelType === 'REGRESSION') {
        str = '按数值切割';
      } else {
        str = '分层抽样';
      }
      return str;
    },
    setMissingType () {
      let str = '';
      if (this.detailData.missing_belong_type === 'ISOLATION_SET') {
        str = '隔离集';
      } else if (this.detailData.missing_belong_type === 'TRAINING_SET') {
        str = '训练集';
      } else if (this.detailData.missing_belong_type === 'TEST_SET') {
        str = '测试集';
      }
      return str;
    }
  },
  activated () {
    this.getModelCutData();
    let list = JSON.parse(JSON.stringify(this.typeList));
    if (this.modelType === 'REGRESSION') {
      this.typeList = list.slice(1);
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations('modeling', ['setPartitionMethod', 'setCutDataType']),
    async getModelCutData () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelCutData', params);
      if (res.code === 0) {
        this.detailData = res;
        if (res.cut_task_status === 'SUCCESS') {
          this.setCutDataType('success');
        } else {
          this.setCutDataType('normal');
        }
      }
    },
    changeHandler (item) {
      this.type = item.value;
      this.setPartitionMethod(this.type);
    },
    async confirmHandler (validation, cvFolds, holdout, selectFeaIdx, firstValue, secondValue, missingType) {
      let params = {};
      if (this.type === 'STRATIFY' || this.type === 'RANDOM') {
        params = {
          project_id: this.projectId,
          partition_method: this.type,
          holdout_percent: holdout,
          validation_percent: cvFolds
        };
      } else {
        params = {
          project_id: this.projectId,
          partition_method: this.type,
          cut_feature_idx: selectFeaIdx,
          missing_belong_type: missingType,
          first_value: firstValue,
          second_value: secondValue
        };
      }
      if (this.type === 'NUMERICAL' || this.type === 'TIME') {
        this.createWs();
      }
      let res = await post('postModelCutData', params);
      if (res.code === 0) {
        if (this.type === 'NUMERICAL' || this.type === 'TIME') {
          this.createWs();
          // this.isOperated = true;
        } else {
          this.getModelCutData();
        }
        this.dialogFlag = false;
      }
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let msgType = data.msg_type;
        let jobType = data.job_type;
        // let errorCode = data.error_code;
        if (msgType === 'active_done' && jobType === 'cut') {
          this.getModelCutData();
          this.isOperated = true;
        }
      };
    },
    cancelHandler () {
      this.dialogFlag = false;
    },
    cancelCalculate () {
      this.isOperated = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/splitDatasets.scss';
</style>
