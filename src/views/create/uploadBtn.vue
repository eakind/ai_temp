<template>
  <label class="uploader-btn iconfont icon-db__foloder">
    <span class="uploader-tip" :class="btnTxt === '重新上传' ? 'underline' : ''">{{btnTxt}}</span>
    <input type="file" ref="inputFile"  @change="fileHandler" multiple="multiple" />
  </label>
</template>
<script>
export default {
  data () {
    return {
      fileList: []
    };
  },
  props: {
    btnTxt: {
      type: String,
      default: '上传本地文件'
    }
  },
  components: {
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    fileHandler (event) {
      let list = event.target.files;
      this.fileList = [];
      for (let key in list) {
        if (typeof list[key] === 'object') {
          let obj = list[key];
          this.fileList.push(obj);
        }
      }
      if (!this.fileList.length) return;
      this.$emit('change', this.fileList);
      this.$refs.inputFile.value = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.uploader-btn {
  height: 40px;
  line-height: 40px;
  width: 130px;
  font-size: 14px;
  display: inline-block;
  margin: 0 auto;
  cursor: pointer;
  text-align: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid #444444;
  margin-right: 24px;
  &::before{
    color: #F6B421;
    font-size: 18px;
    margin-right: 2px;
  }
  .uploader-tip{
    top: -2px;
    left: 3px;
    position: relative;
  }
  .underline {
    text-decoration: underline;
  }
  > input {
    height: 100%;
    width:100%;
    padding: 0px;
    margin: 0px;
    visibility: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
