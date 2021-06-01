<template>
  <div class="preview-table">
    <div class="table-header" ref="headRef">
      <div class="header-item"></div>
      <div class="header-item" v-for="(item, index) in headerList" :key="index" :title="item">
          <span :title="item">{{item}}</span>
       </div>
    </div>
    <div class="table-body">
      <div class="table-num" ref="numRef">
        <div v-for="(item, index) in tableData" :key="index">
          {{index + 1 }}
        </div>
      </div>
      <div class="table-content" @scroll="scrollHandler">
         <div class="content-row" v-for="(item, index) in tableData" :key="index">
           <div class="content-item" v-for="(childItem, childIndex) in item" :key="childIndex"
                :title="childItem">
             {{ childItem === '' ? 'null' : childItem }}
           </div>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    headerList: {
      type: Array
    },
    tableData: {
      type: Array
    }
  },
  methods: {
    scrollHandler (event) {
      this.$refs.headRef.scrollLeft = event.target.scrollLeft;
      this.$refs.numRef.scrollTop = event.target.scrollTop;
    }
  }
};
</script>
<style lang='scss' scoped>
.preview-table {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .table-header {
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    .header-item {
      width: 94px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: inline-block;
      position: relative;
      >span {
        font-size: 16px;
        line-height: 40px;
        display: block;
        color: #FCF8DF;
        @include ellipsis;
      }
      &:nth-child(1) {
        position: absolute;
        width: 56px;
        height: 40px;
        z-index: 2;
      }
      &:nth-child(2) {
        margin-left: 56px;
      }
    }
  }
  .table-body {
    display: flex;
    position: relative;
    height: calc(100% - 240px);
    .table-num {
      height: 100%;
      width: 56px;
      overflow: hidden;
      >div {
        font-size: 16px;
        font-weight: bold;
        width: 56px;
        height: 40px;
        line-height: 40px;
        color: #FCF8DF;
        text-align: center;
        display: inline-block;
      }
    }
  }
  .table-content {
    width: calc(100% - 56px);
    height: calc(100% + 15px);
    overflow: auto;
    @include scrollBar(#a4a4a4, 5px);
    .content-row {
      height: 40px;
      white-space: nowrap;
      &:nth-child(odd) {
        .content-item {
          background: #333333;
        }
      }
      &:nth-child(even) {
        .content-item {
          background: #444444;
        }
      }
      .content-item {
        height: 40px;
        width: 94px;
        text-align: center;
        line-height: 40px;
        display: inline-block;
        box-sizing: border-box;
        border-right: 1px solid #A0A0A0;
        color: #FCF8DF;
        @include ellipsis;
        &:last-child {
          border: none;
        }
      }
    }
  }
}
</style>
