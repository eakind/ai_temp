<template>
  <div>
    <div class="tips">请选择进行分箱的特征。已经执行过分箱的特征无法再次分箱。<span @click="isShow = !isShow" v-click-out="hide">具体方式</span></div>
    <search-input class="search-input" @change="changekeyWord" :inputValue='keyWord'></search-input>
    <div class="select-box">
      <el-checkbox class="all-checkbox" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedFea" @change="handleCheckedFeaChange">
        <el-checkbox v-for="item in feaList" :label="item.feature_idx" :key="item.feature_idx">{{item.feature_name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btns">
      <span class="next-btn" @click="next()">下一步</span>
      <span class="cancel-btn" @click="cancel()">取消</span>
    </div>
    <div class="panel-box" v-if="isShow">
      <span class="icon"></span>
      <div class="panel">
        <div class="title">字符型数据</div>
        <div class="info">默认不分箱。同时频数比例统计，高于6%的字符，一个字符为一个分箱。</div>
        <div class="info">低于6%的，按照均合并为其他。列出所有取值并按照target均值排序。</div>
        <div class="title">数值型数据</div>
        <div class="info">进行分箱。缺失值作为单独箱体。分箱后可通过“特征修改”中的“缺失填充”处理确实值。</div>
        <div class="title">批量分箱后，单个特征可通过“分箱调整”修改分箱设置。</div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/searchInput/index.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      keyWord: '',
      checkAll: false,
      checkedFea: [],
      feaList: [],
      isIndeterminate: true,
      originData: [],
      isShow: false
    };
  },
  components: {
    SearchInput
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['binningAutoParams'])
  },
  props: {
    binningFlag: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.getBinningFeatures();
  },
  methods: {
    // 分箱特征列表
    async getBinningFeatures () {
      this.feaList = [];
      this.originData = [];
      let params = {
        project_id: this.projectId,
        feature_name: this.keyWord
      };
      let res = await get('binningFeatures', params);
      if (res.code === 0) {
        this.feaList = res.feature_list;
        let tempArr = [];
        if (res.feature_list.length) {
          res.feature_list.forEach(item => {
            tempArr.push(item.feature_idx);
          });
        }
        this.originData = JSON.parse(JSON.stringify(tempArr));
      };
      this.checkedFea = this.binningAutoParams.feature_idxs;
    },
    changekeyWord (val) {
      this.keyWord = val;
      this.getBinningFeatures();
    },
    handleCheckAllChange (val) {
      this.checkedFea = val ? this.originData : [];
      this.isIndeterminate = false;
      this.binningAutoParams.feature_idxs = val ? this.originData : [];
    },
    handleCheckedFeaChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.originData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.originData.length;
      this.binningAutoParams.feature_idxs = value;
    },
    next () {
      if (this.binningAutoParams.feature_idxs.length === 0) {
        this.$message({
          message: '请选择进行分箱操作的特征!',
          type: 'warning'
        });
        return;
      }
      this.$emit('on-next', 1);
    },
    cancel () {
      this.$emit('on-cancel');
    },
    hide () {
      this.isShow = false;
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
    cursor: pointer;
  }
}
.search-input {
  width: 100%;
}
.select-box {
  max-height: 306px;
  overflow-y: auto;
  overflow-x: hidden;
  @include scrollBar(#666666, 5px);
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
.panel-box {
    position: absolute;
    right: 16px;
    top: 66px;
    box-shadow: 0px 2px 10px 0px #000000;
    z-index: 1;
  }
  .panel {
    width: 470px;
    height: 160px;
    padding: 8px;
    border-radius: 4px;
    background: #333;
    position: relative;
    .title {
      color: #FCF8DF;
      line-height: 24px;
    }
  }
  .icon {
    display: inline-block;
    position: absolute;
    z-index: 1;
    left: 100px;
    top: -8px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid #333;
  }
</style>
<style lang='scss'>
.select-box {
  .el-checkbox {
    width: 100%;
    line-height: 32px;
    background: #333333;
    border-radius: 4px;
    margin-top: 8px;
    padding: 0px 8px;
    box-sizing: border-box;
    &:hover {
      border: 1px solid #026BDB;
    }
  }
  .all-checkbox {
    background: none;
    &:hover {
      border: none;
    }
  }
}
</style>
