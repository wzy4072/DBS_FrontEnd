<template>
  <div>
    <div v-for="b in buildingList" :key="b.id">{{ b.buildingName }}</div>
    <el-button
      type="success"
      icon="el-icon-circle-plus-outline"
      circle
      @click="addRoomes"
    />
  </div>
</template>

<script>
import { getBuildings } from '@/api/buildingApi'

export default {
  name: 'BuildingManage',
  components: {},
  data() {
    return {
      buildingList: []
    }
  },
  mounted() {
    this.getBuildingList()
  },
  methods: {
    addRoomes() {
      this.$router.push({ path: '/dbsSys/building/add' })
    },
    getBuildingList() {
      getBuildings().then(res => {
        this.buildingList = res.result
      })
    }
  }
}
</script>

<style scoped lang="scss">
.listwrap {
  display: flex;
}
</style>
