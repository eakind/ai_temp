<template>
  <div class="setTarget">
    <target-chart></target-chart>
    <selected-chart></selected-chart>
  </div>
</template>
<script>
import TargetChart from './setTarget/targetChart.vue';
import SelectedChart from './setTarget/selectedChart.vue';
export default {
  data () {
    return {
    };
  },
  computed: {
  },
  components: {
    TargetChart,
    SelectedChart
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.setTarget {
  padding: 8px;
  font-size: 14px;
  color: #fff;
}
</style>
