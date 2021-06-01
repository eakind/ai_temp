<template>
  <Dialog title="文件格式设置" :isShow='settingFlag' :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">请确认项目文件格式。使用多个文件，也将统一按此格式进行配置。</div>
    <div class="content-box">
      <div class="content file-type">
        <span class="label">指定文件类型</span>
        <el-radio v-model="fileType" label="csv">csv</el-radio>
        <el-radio v-model="fileType" label="excel">excel (beta)</el-radio>
      </div>
      <div class="content">
        <span class="label">1.文件编码</span>
        <drop-list :list="codingList" :select="setSelectName(this.codingList, formatSettingList.encoding, '自动')" class="drop-list" @on-change="codingChange"></drop-list>
      </div>
      <div class="content">
        <span class="label">2.分隔符选项</span>
        <drop-list :list="sepList" :select="setSelectName(this.sepList, formatSettingList.sep, '逗号（ ，）')" class="drop-list" @on-change="sepChange"></drop-list>
        <span class="other-label">字符串分隔符</span>
        <drop-list :list="quotecharList" :select="setSelectName(this.quotecharList, formatSettingList.quotechar, '双引号（ ” ）')" class="drop-list" @on-change="quotecharChange"></drop-list>
      </div>
      <div class="content">
        <span class="label">3.字符是否有换行</span>
        <drop-list :list="flagList" :select="setSelectName(this.flagList, formatSettingList.wrap, '否')" class="drop-list" @on-change="wrapChange"></drop-list>
      </div>
      <div class="content">
        <span class="label">4.数值是否使用千分位符</span>
        <drop-list :list="flagList" :select="setSelectName(this.flagList, formatSettingList.thousands, '否')" class="drop-list" @on-change="numChange"></drop-list>
      </div>
      <div class="content">
        <span class="label">5.开始的行</span>
        第<input type="number" v-model="startRows" class="input">行
      </div>
      <div class="content">
        <span class="label">6.是否有标题行</span>
        <drop-list :list="flagList" :select="setSelectName(this.flagList, formatSettingList.header, '是')" class="drop-list" @on-change="titleLineChange"></drop-list>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import DropList from '@/components/dropList/index.vue';
import { mapState } from 'vuex';
import { post } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      codingList: [{
        name: '自动',
        value: 'auto'
      }, {
        name: 'UTF-8',
        value: 'UTF-8'
      }, {
        name: 'UTF-16',
        value: 'UTF-16'
      }, {
        name: 'ASCII',
        value: 'ASCII'
      }, {
        name: 'ios8859-1',
        value: 'ios8859-1'
      }, {
        name: 'BIG5',
        value: 'BIG5'
      }, {
        name: 'GB18030',
        value: 'GB18030'
      }],
      sepList: [{
        name: '逗号（ ，）',
        value: 'COMMA'
      }, {
        name: '竖线 ( | )',
        value: 'PIPE'
      }, {
        name: '制表符（Tab）',
        value: 'TAB'
      }, {
        name: '空格（ ）',
        value: 'SPACE'
      }, {
        name: '分号（‘）',
        value: 'SEMICOLON'
      }, {
        name: '冒号 （：）',
        value: 'COLON'
      }, {
        name: '双引号 ( “ )',
        value: 'DOUBLE'
      }, {
        name: '单引号 ( ’ )',
        value: 'SINGLE'
      }],
      quotecharList: [{
        name: '双引号（ ” ）',
        value: 'DOUBLE'
      }, {
        name: '单引号 ( ‘ )',
        value: 'SINGLE'
      }],
      flagList: [{
        name: '是',
        value: true
      }, {
        name: '否',
        value: false
      }],
      fileType: 'csv',
      encoding: 'auto',
      sep: 'COMMA',
      quotechar: 'DOUBLE',
      isWrap: false,
      isThousands: false,
      startRows: 1,
      isHeader: true
    };
  },
  mixins: [createWs],
  props: {
    settingFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['projectId', 'formatSettingList'])
  },
  components: {
    Dialog,
    DropList
  },
  mounted () {
    this.initWs();
    this.init();
  },
  methods: {
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
      };
    },
    init () {
      this.startRows = this.formatSettingList.startrows;
    },
    setSelectName (list, value, name) {
      var str = '';
      if (value) {
        list.forEach(item => {
          if (value === item.value) {
            str = item.name;
          }
        });
      } else {
        str = name;
      }
      return str;
    },
    cancelHandler () {
      this.$emit('on-cancel');
    },
    async confirmHandler () {
      let params = {
        project_id: this.projectId,
        file_type: this.fileType,
        encoding: this.encoding,
        sep: this.sep,
        quotechar: this.quotechar,
        wrap: this.isWrap,
        thousands: this.isThousands,
        startrows: Number(this.startRows),
        header: this.isHeader
      };
      this.createWs();
      let res = await post('setFormatSetting', params);
      if (res.code === 0) {
        this.createWs();
        this.$emit('on-confirm');
      }
    },
    codingChange (item) {
      this.encoding = item.value;
    },
    sepChange (item) {
      this.sep = item.value;
    },
    wrapChange (item) {
      this.isWrap = item.value;
    },
    numChange (item) {
      this.isThousands = item.value;
    },
    titleLineChange (item) {
      this.isHeader = item.value;
    },
    quotecharChange (item) {
      this.quotechar = item.value;
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  margin: 8px 0px;
  line-height: 24px;
  font-size: 12px;
  color: #A4A4A4;
}
.content-box {
  padding: 8px;
  background: #2b2b2b;
  border-radius: 4px;
  .content {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .label {
      display: inline-block;
      width: 200px;
    }
    .other-label {
      margin: 0 12px;
    }
    .input {
        display: inline-block;
        height: 36px;
        width: 44px;
        padding: 0px 10px;
        border: none;
        outline:none;
        border-radius: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: none;
        font-size: 14px;
        color: #fff;
        background: #333333;
        margin: 0px 8px;
      }
      &:focus {
        border: none;
        border-radius: 4px;
        border: none;
        padding: 0px 10px;
        outline:none;
      }
  }
  .file-type {
    line-height: 36px;
    border-bottom: 1px solid #424242;
  }
  .drop-list {
    width: 192px;
    height: 36px;
  }
}
</style>
<style>
.el-radio {
  color: #fff;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #fff;
}
</style>
