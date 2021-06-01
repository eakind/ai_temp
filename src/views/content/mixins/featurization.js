import { getFeatureList } from './getFeatureList.js';
import { mapState, mapMutations } from 'vuex';
export const featurization = {
  data: () => {
    return {
      totalNum: 0,
      offset: 0,
      limit: 100,
      targetName: ''
    };
  },
  computed: {
    ...mapState('content', ['selectedBinning'])
  },
  beforeDestroy () {
    this.bus.$off('refreshTargetChart');
    this.bus.$off('refresh');
  },
  mixins: [getFeatureList],
  mounted () {
    this.offset = 0;
    this.type = 'ALL';
    this.direction = 'asc';
    this.setSelectedBinning(null);
    this.getFeatureList();
    this.bus.$on('refreshFeatureList', () => {
      this.list = [];
      this.offset = 0;
      this.type = 'ALL';
      this.direction = 'asc';
      this.setSelectedBinning(null);
      this.getFeatureList();
    });
    this.bus.$on('refresh', (idx, target) => {
      this.targetName = '';
      this.offset = 0;
      this.list = [];
      this.getFeatureList(idx, false, true, target);
    });
  },
  methods: {
    ...mapMutations('content', ['setSelectedBinning', 'setSelectedFeature']),
    selectData (item) {
      if (item.status === 'BINNING') {
        this.setSelectedBinning(item);
      } else {
        this.setSelectedBinning(null);
      }
      this.setSelectedFeature(item);
    },
    sortChangeHandler (item) {
      this.direction = item.value;
      this.offset = 0;
      this.list = [];
      this.getFeatureList();
    },
    orderChangeHandler (item) {
      this.orderBy = item.value;
      this.offset = 0;
      this.list = [];
      this.getFeatureList();
    }
  }
};
