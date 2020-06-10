<template>
  <div class="activetab">
    <br>
    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px;">
      <el-step title="步骤 1" />
      <el-step title="步骤 2" />
      <el-step title="步骤 3" />
    </el-steps>
    <br>
    <el-row v-show="active === 0">
      <el-row class="bt-line">
        <el-button type="primary" @click="setBaseInfo()">下一步</el-button>
      </el-row>

      <el-form ref="form1" :model="form1" :rules="rules1" label-width="80px">
        <el-form-item label="楼栋名" prop="buildingName">
          <el-input v-model="form1.buildingName" placeholder="如：88栋" />
        </el-form-item>
        <el-form-item label="楼栋描述" prop="buildingDesc">
          <el-input v-model="form1.buildingDesc" type="textarea" placeholder="如：顺发街道 平安花园" />
        </el-form-item>

        <el-form-item label="总楼层" prop="buildingFloor">
          <el-input v-model="form1.buildingFloor" />
          <!-- <el-input-number v-model="form1.buildingFloor" ></el-input-number> -->
        </el-form-item>
        <el-form-item label="梯户数" prop="everyFloorDoors">
          <el-input v-model="form1.everyFloorDoors" />
          <!-- <el-input-number v-model="form1.everyFloorDoors" :min="1" :max="20"></el-input-number> -->
        </el-form-item>
      </el-form>
    </el-row>

    <el-row v-show="active === 1">
      <el-row class="bt-line">
        <el-button @click="lastStep(1)">上一步</el-button>
        <el-button type="primary" @click="setChargeInfo()">下一步</el-button>
      </el-row>

      <el-form ref="form2" :model="form2" label-width="80px">
        <el-row v-for="(charge, index) in form2.otherCharges" :key="charge.key">
          <el-col :span="8">
            <el-form-item
              label="费用名称"
              :prop="'otherCharges.' + index + '.chargeName'"
              :rules="{
                required: true,
                message: '必填',
                trigger: 'blur'
              }"
            >
              <el-input v-model="charge.chargeName" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="金额"
              :prop="'otherCharges.' + index + '.chargeAmount'"
              :rules="{
                required: true,
                message: '必填',
                trigger: 'blur'
              }"
            >
              <el-input v-model="charge.chargeAmount" :min="0" :max="10000" />
              <!-- <el-input-number v-model="charge.chargeAmount" :min="0" :max="10000"></el-input-number> -->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeChargeItem(charge)">删除</el-button>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="addChargeItem">新增项目</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row v-show="active === 2">
      <el-row class="bt-line">
        <el-button @click="lastStep(2)">上一步</el-button>
        <el-button slot="reference" type="primary" @click="saveRoomData">保存设置</el-button>
        <el-button-group style="float: right;">
          <el-button @click="selectionAllSelect">全选</el-button>
          <el-button @click="selectionAllNot">全不选</el-button>
          <el-button @click="changeCharge('roomFee', '房租')">修改房租</el-button>
          <el-button
            v-for="(chargeInfo) in form2.otherCharges"
            :key="chargeInfo.key"
            @click="changeCharge(chargeInfo.key, chargeInfo.chargeName)"
          >修改{{ chargeInfo.chargeName }}</el-button>
        </el-button-group>
      </el-row>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roomName" label="房间号" width="120">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.roomName }}</span> -->
            <el-input v-model="scope.row.roomName" />
          </template>
        </el-table-column>
        <el-table-column prop="roomFee" label="月租" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.roomFee" />
          </template>
        </el-table-column>
        <el-table-column
          v-for="(chargeInfo) in form2.otherCharges"
          :key="chargeInfo.key"
          :prop="chargeInfo.key"
          :label="chargeInfo.chargeName"
          width="120"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row[chargeInfo.key]" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row v-show="active === 3">
      <div class="finish">
        <i class="el-icon-finished" />
        <el-button type="primary" @click="addPaseList">添加首期水电数据
        </el-button>
      </div>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <!-- :before-close="handleClose" -->
      <el-form label-width="80px">
        <el-form-item :label="dialogForm.chargeName">
          <el-input v-model="dialogForm.charge" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeTableData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddBuilding',

  data() {
    return {
      active: 0,
      form1: {
        buildingName: '88栋',
        buildingDesc: '66号',
        buildingFloor: '2',
        everyFloorDoors: '3'
      },
      rules1: {
        buildingName: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        buildingFloor: [{ required: true, message: '必填', trigger: 'blur' }],
        everyFloorDoors: [{ required: true, message: '必填', trigger: 'blur' }]
      },

      form2: {
        otherCharges: [
          { chargeName: '卫生费', chargeAmount: '30', key: 'ocId1' },
          { chargeName: '宽带费', chargeAmount: '90', key: 'ocId2' }
        ]
      },
      chargeKey: 100,
      tableData: [],
      multipleSelection: [],
      dialogForm: {
        chargeName: '',
        chargeKey: '',
        charge: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    setBaseInfo() {
      this.$refs['form1'].validate(valid => {
        if (valid) {
          console.log(this.form1)
          this.active = 1
        } else {
          return false
        }
      })
    },
    setChargeInfo() {
      this.$refs['form2'].validate(valid => {
        if (valid) {
          console.log(this.form1)
          this.createTableInfo()
          this.active = 2
        } else {
          return false
        }
      })
    },
    createTableInfo() {
      this.tableData = []
      for (
        let floor = 1;
        floor <= parseInt(this.form1.buildingFloor);
        floor++
      ) {
        for (
          let door = 1;
          door <= parseInt(this.form1.everyFloorDoors);
          door++
        ) {
          const floorCharge = {
            key: floor + '' + door,
            roomName: '' + floor + (door > 9 ? door : '0' + door),
            roomFee: 0
          }
          for (let ckey = 0; ckey < this.form2.otherCharges.length; ckey++) {
            const otherCInfo = this.form2.otherCharges[ckey]
            floorCharge[otherCInfo.key] = this.form2.otherCharges[
              ckey
            ].chargeAmount
          }
          this.tableData.push(floorCharge)
        }
      }
    },
    lastStep(n) {
      if (n === 0) {
        return
      }
      this.active--
    },
    addChargeItem() {
      this.form2.otherCharges.push({
        chargeName: '',
        chargeAmount: 0,
        key: 'ocId' + this.chargeKey
      })
      this.chargeKey++
    },
    removeChargeItem(item) {
      var index = this.form2.otherCharges.indexOf(item)
      if (index !== -1) {
        this.form2.otherCharges.splice(index, 1)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 全选
    selectionAllSelect() {
      this.tableData.map(item => {
        this.$refs.multipleTable.toggleRowSelection(item)
      })
    },
    // 全不选
    selectionAllNot() {
      this.$refs.multipleTable.clearSelection()
    },
    // 反选
    selectionAllToggle() {},
    changeCharge(key, name) {
      this.dialogForm.chargeName = name
      this.dialogForm.chargeKey = key
      this.dialogForm.charge = ''
      this.dialogVisible = true
    },
    changeTableData() {
      this.dialogVisible = false
      this.multipleSelection.map(item => {
        item[this.dialogForm.chargeKey] = this.dialogForm.charge
      })
    },
    saveRoomData() {
      //   api.then.///
      // 返回楼栋ID
      this.active = 3
      console.log(JSON.stringify(this.tableData))
    },
    addPaseList() {
      this.$router.push({
        paht: '/phaseManage/add',
        query: { buildingId: 66 }
      })
      // <router-link :to="{path:}">录入首期水电资料</router-link>
      // 4000
      // 403
    }
  }
}
</script>

<style lang="scss" scoped>
.activetab {
  max-width: 800px;
}
.bt-line {
  margin: 16px 0;
}
.finish {
  font-size: 60px;
  color: #67c23a;
  width: 100%;
  text-align: center;
  margin: 100px 0;
}
</style>
