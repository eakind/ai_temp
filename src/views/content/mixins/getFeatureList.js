import { get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export const getFeatureList = {
  data: () => {
    return {
      offset: 0,
      limit: 100,
      keyWord: '',
      orderBy: '',
      direction: '',
      type: 'FINAL',
      totalNum: 0,
      firstList: null
    };
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature', 'targetFeature'])
  },
  methods: {
    ...mapMutations('content', ['setTargetData', 'setSelectedFeature']),
    async getFeatureList (idx, flag, setFirst, target) {
      let params = {
        project_id: this.projectId,
        feature_list: this.type,
        feature_name: this.keyWord,
        direction: this.direction,
        order_by: this.orderBy,
        offset: this.offset,
        limit: this.limit
      };
      let res = await get('featureList', params);
      if (res.code === 0) {
        this.totalNum = res.total_num;
        this.list.push(...res.feature_list);
        this.firstList = this.list.length ? this.list[0] : null;
        if (idx) {
          for (let i = 0; i < this.list.length; i++) {
            if (idx === this.list[i].feature_idx) {
              this.setSelectedFeature(this.list[i]);
              if (target) {
                this.setTargetFeature(this.list[i]);
                this.bus.$emit('refreshTargetChart');
              }
            }
          }
        } else {
          if (setFirst) {
            this.setSelectedFeature(this.list[0]);
          }
        }
        if (flag) {
        }
        if (this.selectedFeature && this.targetFeature) {
          if (this.selectedFeature.feature_idx === this.targetFeature.feature_idx) {
            this.list[0].feature_idx !== this.targetFeature.feature_idx ? this.setSelectedFeature(this.list[0]) : this.setSelectedFeature(this.list[1]);
          }
          let flag = this.list.find(item => item.feature_idx === this.selectedFeature.feature_idx);
          if (flag === undefined) {
            this.setSelectedFeature(this.list[0]);
          }
        }
      }
    },
    async legalTargetList (idx, flag, setFirst, target) {
      this.limit = 99999999;
      let params = {
        project_id: this.projectId,
        feature_name: this.keyWord,
        direction: this.direction,
        order_by: this.orderBy,
        offset: this.offset,
        limit: this.limit
      };
      let res = await get('legalTargetList', params);
      if (res.code === 0) {
        this.totalNum = res.total_num;
        this.list.push(...res.legal_target_list);
        this.firstList = this.list.length ? this.list[0] : null;
        if (idx) {
          for (let i = 0; i < this.list.length; i++) {
            if (idx === this.list[i].feature_idx) {
              this.setSelectedFeature(this.list[i]);
              if (target) {
                this.setTargetFeature(this.list[i]);
                this.bus.$emit('refreshTargetChart');
              }
            }
          }
        } else {
          if (setFirst) {
            this.setSelectedFeature(this.list[0]);
          }
        }
        if (flag) {
        }
        if (this.selectedFeature && this.targetFeature) {
          if (this.selectedFeature.feature_idx === this.targetFeature.feature_idx) {
            this.list[0].feature_idx !== this.targetFeature.feature_idx ? this.setSelectedFeature(this.list[0]) : this.setSelectedFeature(this.list[1]);
          }
        }
      }
    },
    loadMore () {
      if (this.totalNum === this.list.length) {
        return;
      }
      this.offset = this.offset + this.limit;
      this.getFeatureList();
    },
    targetLoadMore () {
      if (this.totalNum === this.list.length) {
        return;
      }
      this.offset = this.offset + this.limit;
      this.legalTargetList();
    },
    changekeyWord (val) {
      this.keyWord = val;
      this.offset = 0;
      this.list = [];
      this.getFeatureList();
    },
    changeTargetKeyWord (val) {
      this.keyWord = val;
      this.offset = 0;
      this.list = [];
      this.legalTargetList();
    }
  }
};
