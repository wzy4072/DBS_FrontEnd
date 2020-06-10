<template>
  <div class="eddwrap" :title="title">
    <i class="el-icon-plus addicon"></i>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: [String, Number]
    },
  },
  methods: {},
}
</script>

<style scoped lang="scss">
$gray: #909399;
$blue: #409eff;

.eddwrap {
    width:130px;
    height: 130px;
//   display: block;
  border: 1px solid $gray;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
//   &:hover {
//     border-color: $blue;
//     .addicon {
//       font-size: 80px;
//       color: $blue;
//     }
//   }
//   .addicon {
//     font-size: 80px;
//     color: $gray;
//   }
}
</style>
