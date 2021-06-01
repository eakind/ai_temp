<template>
  <div class="operate-box">
    <tip-panel class="delete-box" :style="{'top': mTop}" v-if="currentIndex === 2">
      <div>确定移除此箱体？</div>
      <div>
        <span @click="confirmClick">确定</span>
        <span @click="cancelClick">取消</span>
      </div>
    </tip-panel>
    <tip-panel v-if="currentIndex === 1 || currentIndex === 0">
      <div class="search-box" v-if="currentIndex === 1 || currentIndex === 0">
        <div v-if="currentIndex === 1">删除的数据将自动归入others箱体。</div>
        <div v-if="currentIndex === 0">选择数据值加入箱体。</div>
        <search-input @change="changekeyWord" :inputValue='keyWord' class="search-input"></search-input>
      </div>
      <div class="content" v-if="currentIndex === 1">
        <div @click="deleteSelected">删除此页全部</div>
        <div class="table-box">
          <div v-for="(item, index) in cutList" :key="index">
          <span class="iconfont icon-db_plus" @click="deleteItem(item, index)"></span>
            {{ item }}
          </div>
        </div>
      </div>
      <div class="content" v-if="currentIndex === 0">
        <el-checkbox class="all-checkbox" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选当前页</el-checkbox>
        <el-checkbox-group v-model="checkedValues" @change="handleCheckedValuesChange">
          <el-checkbox v-for="item in valuesList" :label="item.label" :key="item.label">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <table-pagination class="pagination-box"
        v-if="currentIndex === 1 || currentIndex === 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :param="param"
        :totalCount="totalCount"
      >
      </table-pagination>
    </tip-panel>
  </div>
</template>
<script>
import TipPanel from '@/components/tipPanel/index.vue';
import SearchInput from '@/components/searchInput/index.vue';
import TablePagination from '@/components/tablePagination/index.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      keyWord: '',
      param: {
        page: 1, // 当前页码
        per_page: 10 // 默认每页的数据量
      },
      totalCount: 1000,
      cutList: [],
      checkAll: false,
      checkedValues: [],
      valuesList: [],
      isIndeterminate: true,
      disabledList: [],
      tempArr: [],
      pageArr: []
    };
  },
  components: {
    TipPanel,
    SearchInput,
    TablePagination
  },
  props: {
    currentIndex: {
      type: Number,
      default: 3
    },
    currentItem: {
      type: Array
    },
    activeIdx: {
      type: Number
    },
    list: {
      type: Array
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature']),
    mTop () {
      // let dom = document.querySelectorAll('.el-collapse-item')[this.activeIdx];
      return `${this.activeIdx * 38}px`;
    }
  },
  watch: {
    currentIndex: {
      handler (val) {
        if (val === 0) {
          this.param.page = 1;
          this.binningStrValues();
        } else if (val === 1) {
          this.tempArr = [];
          this.binningValues();
        }
      },
      deep: true,
      immediate: true
    },
    activeIdx (val) {
      this.disabledList = [];
      if (val !== null) {
        for (let i in this.list) {
          if (Number(i) !== val) {
            this.disabledList.push(...this.list[i]);
          }
        }
      }
    }
  },
  methods: {
    async binningStrValues () {
      this.valuesList = [];
      let params = {
        keyword: this.keyword,
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx,
        limit: this.param.per_page,
        offset: this.param.per_page * (this.param.page - 1)
      };
      let res = await get('binningStrValues', params);
      if (res.code === 0) {
        this.pageArr = res.data;
        for (let i in res.data) {
          this.valuesList.push({
            label: res.data[i],
            disabled: false
          });
        }
        // this.valuesList = res.data;
        this.valuesList.forEach(item => {
          if (this.disabledList.find(_item => item.label === _item)) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
        this.checkedValues = this.currentItem;
        this.totalCount = res.total_num;
      }
    },
    binningValues (keyword) {
      this.cutList = [];
      let allData = JSON.parse(JSON.stringify(this.currentItem));
      if (keyword) {
        allData.forEach(item => {
          if (item === keyword) {
            this.cutList.push(item);
          }
        });
      } else {
        this.cutList = allData.splice(this.param.per_page * (this.param.page - 1), this.param.per_page);
      }
      // this.cutList = JSON.parse(JSON.stringify(this.currentItem));
      this.totalCount = this.cutList.length;
    },
    // 删除箱体里某页的数据
    deleteSelected () {
      this.$emit('on-delete', this.cutList);
      this.cutList = [];
    },
    // 删除箱体里单个数据
    deleteItem (item, index) {
      this.tempArr.push(item);
      this.$emit('on-delete', this.tempArr, index);
      this.cutList.splice(index, 1);
    },
    confirmClick () {
      this.$emit('on-confirm');
    },
    cancelClick () {
      this.$emit('on-cancel');
    },
    changekeyWord (val) {
      this.keyword = val;
      if (this.currentIndex === 0) {
        this.param.page = 1;
        this.binningStrValues();
      } else if (this.currentIndex === 1) {
        this.binningValues(val);
      }
    },
    handleSizeChange (val) {
      this.param.per_page = val;
      this.binningStrValues();
    },
    handleCurrentChange (val) {
      this.param.page = val;
      this.binningStrValues();
    },
    handleCheckAllChange (val) {
      this.checkedValues = val ? this.currentItem.concat(this.pageArr) : this.currentItem;
      this.isIndeterminate = false;
      let arr = [];
      arr = Array.from(new Set(this.checkedValues));
      this.$emit('checkValues', arr);
    },
    handleCheckedValuesChange (value) {
      this.$emit('checkValues', value, this.activeIdx);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.valuesList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.valuesList.length;
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-box {
  .delete-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    >div:nth-child(1) {
      padding-left: 8px;
    }
    >div:nth-child(2) {
      >span {
        display: inline-block;
        width: 80px;
        color: #A4A4A4;
        text-align: center;
        cursor: pointer;
      }
      >span:nth-child(1) {
        color: #F6B421;
      }
    }
  }
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div:nth-child(1) {
      color: #A4A4A4;
      font-size: 12px;
    }
    .search-input {
      width: 240px;
      border-bottom: 1px solid #424242;
      background: none;
      border-radius: 0px;
    }
  }
  .content {
    height: 320px;
    overflow-y: auto;
    overflow-x: hidden;
    @include scrollBar(#a4a4a4, 5px);
    >div:nth-child(1) {
      text-decoration: underline;
      color: #F6B421;
      cursor: pointer;
    }
    .table-box {
      margin: 8px 0px;
      width: 100%;
      height: calc(100% - 200px);
      // overflow-y: auto;
      // overflow-x: hidden;
      font-size: 12px;
      >div {
        height: 28px;
        line-height: 28px;
        width: 100%;
        border-radius: 4px;
        background: #222222;
        margin-bottom: 4px;
        >span:nth-child(1) {
          color: #F6B421;
          display: inline-block;
          font-size: 12px;
          padding: 0px 8px;
          transform: rotate(45deg);
          cursor: pointer;
        }
      }
    }
  }
  .pagination-box {
    border-top: 1px solid #424242;
  }
}
</style>
<style lang='scss'>
.content {
  .el-checkbox {
    width: 100%;
    line-height: 32px;
    background: #333333;
    border-radius: 4px;
    margin-top: 4px;
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
