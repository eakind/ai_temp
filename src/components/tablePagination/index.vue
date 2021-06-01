<template>
  <el-pagination
      v-on="$listeners"
      :current-page="param.page"
      :page-sizes="pageSize"
      :page-size="param.per_page"
      :layout="layout"
      :total="totalCount"
    >
  </el-pagination>
</template>
<script>
export default {
  name: 'dcPagination',
  props: {
    param: {
      type: Object,
      defualt: (_) => {}
    },
    pageSize: {
      type: Array,
      default: (_) => [10, 20, 50, 100]
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    layout () {
      return this.totalCount > 0 ? 'prev, pager, next, sizes' : '';
    }
  }
};
</script>
