import downloadImage from '@/utils/downloadImage';
import { downloadData } from '@/api/server';
export const resultMixin = {
  data: () => {
    return {
    };
  },
  mounted () {
  },
  methods: {
    async downloadData (url) {
      let param = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
      };
      const name = `${this.projectId}.${this.outputItem.model_id}.${this.outputItem.sampling}`;
      let res = await downloadData(url, param, name);
      // let res = await get(url, param);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
      }
    },
    async saveImage (size, node) {
      await downloadImage({
        node: node,
        name: `${new Date().getTime()}.jpg`,
        size: size,
        backgroundColor: '#2B2B2B',
        errorMsg: ''
      });
    },
    async downloadMatrix (node, chart) {
      let size = {
        width: node.clientWidth,
        height: node.clientHeight
      };
      await downloadImage({
        node: chart,
        name: `${new Date().getTime()}.jpg`,
        size: size,
        backgroundColor: '#2B2B2B',
        errorMsg: ''
      });
    }
  }
};
