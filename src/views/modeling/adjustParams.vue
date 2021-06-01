<template>
  <div class="adjust-params">
    <div class="title">模型调参</div>
    <div class="title-tip">请选择需要使用的模型以及确认模型参数。</div>
    <div class="operate-btn">
      <div class="left">{{ adjustType }}</div>
      <div class="right" v-if="adjustType === '自动调参'" @click="typeClick('manual')">手动调参<span class="iconfont icon-db_arrow"></span></div>
      <div class="auto-btn" v-if="adjustType === '手动调参'" @click="typeClick('auto')">自动调参</div>
    </div>
    <div class="table-box">
      <div class="list-box">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="check-box">全选</el-checkbox>
        <span class="model-name">模型名称</span>
        <span class="type-name">使用参数</span>
      </div>
      <scroll-list class="table-body" @loadMore="loadMore">
        <div class="list-box list" v-for="(item, index) in list" :key="index">
          <el-checkbox v-model="item.selected" class="check-box" @change="selectHandler(item, index)">使用</el-checkbox>
          <span class="model-name">{{item.model_name}}</span>
          <span class="type-name" @click="settingClick(item)" :class="adjustType === '手动调参' ? 'manual-style' : ''">{{adjustType === '手动调参' ? '自定义' : '默认'}}</span>
        </div>
      </scroll-list>
    </div>
    <div class="operate-btn bottom-panel" v-if="modelType ==='SCORECARD'">
      <div class="title">特征选择方式</div>
      <div class="right" @click="modifySetting">更改设置<span class="iconfont icon-db_arrow"></span></div>
    </div>
    <div class="panel" v-if="modelType ==='SCORECARD'">
      <div class="panel-list">
        <span>特征选择方式</span><span>{{selectMethods.forward ? '向前特征选择' : ''}}{{selectMethods.backwards ? '向后特征选择' : ''}}</span>
      </div>
      <div class="panel-list">
        <span>最大允许VIF</span><span>{{selectMethods.max_vif}}</span>
      </div>
      <div class="panel-list">
        <span>最大允许PSI</span><span>{{selectMethods.max_psi}}</span>
      </div>
      <div class="panel-list">
        <span>入模特征数</span><span>{{selectMethods.feature_num}}</span>
      </div>
    </div>
    <params-setting :detailInfor="detailInfor" :modelName="modelName" :modelId="modelId" :dialogFlag="dialogFlag" @confirm="confirmHandler" @cancel="cancelHandler" v-if="dialogFlag"></params-setting>
    <feature-methods :selectMethods="selectMethods" :modelName="modelName" :dialogFlag="featureFlag" @confirm="feaConfirmHandler" @cancel="feaCancelHandler" v-if="featureFlag"></feature-methods>
  </div>
</template>
<script>
import ScrollList from '@/components/scrollList/index.vue';
import ParamsSetting from './adjustParams/paramsSetting.vue';
import FeatureMethods from './adjustParams/featureMethods.vue';
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      adjustType: '自动调参',
      default: true,
      checkAll: true,
      selected: true,
      isIndeterminate: false,
      dialogFlag: false,
      featureFlag: false,
      list: [],
      detailInfor: [],
      modelName: '',
      modelId: '',
      selectModelData: {},
      selectMethods: {
        forward: false,
        backwards: false,
        max_vif: null,
        max_psi: null,
        feature_num: null
      }
    };
  },
  components: {
    ScrollList,
    ParamsSetting,
    FeatureMethods
  },
  computed: {
    ...mapState(['projectId', 'modelType']),
    ...mapState('modeling', ['partitionMethod', 'modifyOptionsParam', 'modifyOptionsParam'])
  },
  watch: {
    selectMethods: {
      handler (list) {
        let obj = {};
        // if (this.modelType === 'GLM_BINARY_CLASS' || this.modelType === 'GLM_REGRESSION') {
        //   obj = {
        //     max_vif: this.selectMethods.max_vif ? Number(this.selectMethods.max_vif) : '',
        //     max_psi: this.selectMethods.max_psi ? Number(this.selectMethods.max_psi) : ''
        //   };
        // } else {
        //   obj = {
        //     forward: this.selectMethods.forward ? true : '',
        //     backwards: this.selectMethods.backwards ? true : '',
        //     max_vif: this.selectMethods.max_vif ? Number(this.selectMethods.max_vif) : '',
        //     max_psi: this.selectMethods.max_psi ? Number(this.selectMethods.max_psi) : '',
        //     feature_num: this.selectMethods.feature_num ? Number(this.selectMethods.feature_num) : ''
        //   };
        // }
        obj = {
          forward: this.selectMethods.forward ? this.selectMethods.forward : false,
          backwards: this.selectMethods.backwards ? this.selectMethods.backwards : false,
          max_vif: this.selectMethods.max_vif,
          max_psi: this.selectMethods.max_psi,
          feature_num: this.selectMethods.feature_num
        };
        this.setModifyOptionsParam({ ...this.modifyOptionsParam, feature_select_method: obj });
      },
      deep: true,
      immediate: true
    }
  },
  activated () {
    // this.modelList();
    this.setModifyOptionsParam({});
    this.getModelOptions();
  },
  mounted () {
  },
  methods: {
    ...mapMutations('modeling', ['setPartitionMethod', 'setModifyOptionsParam', 'setModifyOptionsParam']),
    async modelList () {
      this.list = [];
      let params = {
        project_id: this.projectId
      };
      let res = await get('modelList', params);
      if (res.code === 0) {
        this.list = res.model_list;
        if (this.list.length) {
          for (let i in this.list) {
            this.list[i].selected = true;
          }
        }
      }
    },
    async getModelOptions () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelOptions', params);
      if (res.code === 0) {
        this.list = res.model_list;
        this.default = res.default;
        this.selectMethods = res.feature_select_method;
        let tmpObj = {
          project_id: this.projectId,
          default: this.default,
          select_model_data: {}
        };
        this.setModifyOptionsParam(tmpObj);
        if (this.list.length) {
          this.list.forEach(item => {
            if (res.select_model_id_list.find(_item => item.model_id === _item)) {
              item.selected = true;
            } else {
              item.selected = false;
            }
          });
          for (let i in this.list) {
            if (this.list[i].selected) {
              let key = this.list[i].model_id;
              if (this.default) {
                this.selectModelData[key] = {};
              } else {
                // this.selectModelData[key] = this.list[i].model_param;
                let tempObj = JSON.parse(JSON.stringify(this.list[i].model_param));
                for (let j in tempObj) {
                  tempObj[j] = tempObj[j].value;
                }
                this.selectModelData[key] = tempObj;
                if (!this.selectModelData[key]) delete this.selectModelData[key];
              }
            }
          }
        }
        let obj = {
          ...this.modifyOptionsParam,
          select_model_data: this.selectModelData
        };
        obj.default = this.default;
        this.setModifyOptionsParam(obj);
      }
    },
    typeClick (val) {
      this.adjustType = val === 'manual' ? '手动调参' : '自动调参';
      if (val === 'manual') {
        this.default = false;
      } else {
        this.default = true;
      }
      for (let i in this.list) {
        if (this.list[i].selected) {
          let key = this.list[i].model_id;
          if (this.default) {
            this.selectModelData[key] = {};
          } else {
            // this.selectModelData[key] = this.list[i].model_param;
            let tempObj = JSON.parse(JSON.stringify(this.list[i].model_param));
            for (let j in tempObj) {
              tempObj[j] = tempObj[j].value;
            }
            this.selectModelData[key] = tempObj;
          }
        }
      }
      let obj = {
        ...this.modifyOptionsParam,
        select_model_data: this.selectModelData
      };
      obj.default = this.default;
      this.setModifyOptionsParam(obj);
    },
    modifySetting () {
      this.featureFlag = true;
    },
    handleCheckAllChange () {
      for (let i in this.list) {
        this.$set(this.list[i], 'selected', this.checkAll);
      };
      if (this.checkAll) {
        for (let i in this.list) {
          let key = this.list[i].model_id;
          if (this.default) {
            this.selectModelData[key] = {};
          } else {
            this.selectModelData[key] = this.list[i].model_param;
          }
        }
      } else {
        this.selectModelData = {};
      }
      let obj = {
        ...this.modifyOptionsParam,
        select_model_data: this.selectModelData
      };
      this.setModifyOptionsParam(obj);
    },
    selectHandler (item, index) {
      // this.$set(this.list[index], 'selected', true);
      this.list.splice(index, 1, item);
      for (let i in this.list) {
        if (this.list[i].selected) {
          let key = this.list[i].model_id;
          if (this.default) {
            this.selectModelData[key] = {};
          } else {
            // this.selectModelData[key] = this.list[i].model_param;
            let tempObj = JSON.parse(JSON.stringify(this.list[i].model_param));
            for (let j in tempObj) {
              tempObj[j] = tempObj[j].value;
            }
            this.selectModelData[key] = tempObj;
            if (!this.selectModelData[key]) delete this.selectModelData[key];
          }
        }
      }
      let obj = {
        ...this.modifyOptionsParam,
        select_model_data: this.selectModelData
      };
      obj.default = this.default;
      this.setModifyOptionsParam(obj);
    },
    loadMore () {},
    settingClick (item) {
      if (this.adjustType === '自动调参') return;
      this.modelName = item.model_name;
      this.modelId = item.model_id;
      let list = JSON.parse(JSON.stringify(item.model_param));
      let tempArr = Object.keys(list);
      if (tempArr.length) {
        for (let i in tempArr) {
          let obj = {
            param_name: tempArr[i]
          };
          Object.assign(obj, list[tempArr[i]]);
          this.detailInfor[i] = obj;
        }
        for (let i in this.detailInfor) {
          if (this.detailInfor[i].params_type && this.detailInfor[i].params_type.length) {
            let str = '';
            for (let j in this.detailInfor[i].params_type) {
              str += this.detailInfor[i].params_type[j];
            }
            this.detailInfor[i].params_str = str;
          }
        }
      }
      this.dialogFlag = true;
    },
    confirmHandler (item, id) {
      let obj = {};
      for (let i in item) {
        let key = item[i].param_name;
        obj[key] = item[i].value;
      }
      this.dialogFlag = false;
      if (this.modifyOptionsParam.select_model_data) {
        for (let key in this.modifyOptionsParam.select_model_data) {
          if (key === id) {
            this.modifyOptionsParam.select_model_data[key] = obj;
          }
        }
      }
    },
    cancelHandler () {
      this.dialogFlag = false;
    },
    feaConfirmHandler (item) {
      this.selectMethods = item;
      this.featureFlag = false;
    },
    feaCancelHandler () {
      this.selectMethods = {
        forward: false,
        backwards: false,
        max_vif: null,
        max_psi: null,
        feature_num: null
      };
      this.featureFlag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/adjustParams.scss';
</style>
