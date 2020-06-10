<template>
  <div class="listwrap" />
</template>

<script>
export default {
  name: 'BuildingManage',

  components: {},
  data() {
    return {}
  },
  methods: {
    addRoomes() {
      this.$router.push({ path: '/roomManage/add' })
    }
  }
}
</script>

<style scoped lang="scss">
.listwrap {
  display: flex;
}
</style>
