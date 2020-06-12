<template>
  <div class="activetab">
    <el-button type="primary" @click="test()">test</el-button>

    <br>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px;"
    >
      <el-step title="步骤 1" />
      <el-step title="步骤 2" />
      <el-step title="步骤 3" />
    </el-steps>
    <br>
    <el-row v-show="active === 0">
      <el-row class="bt-line">
        <el-button type="primary" @click="setBaseInfo()">下一步</el-button>
      </el-row>

      <el-form ref="form1" :model="form1" :rules="rules1" label-width="100px">
        <el-form-item label="楼栋名" prop="buildingName">
          <el-input v-model="form1.buildingName" placeholder="如：88栋" />
        </el-form-item>
        <el-form-item label="楼栋描述" prop="buildingDesc">
          <el-input
            v-model="form1.buildingDesc"
            placeholder="如：顺发街道 平安花园"
          />
        </el-form-item>

        <el-form-item label="总楼层" prop="buildingFloor">
          <!-- <el-input v-model="form1.buildingFloor" /> -->
          <el-input-number v-model="form1.buildingFloor" />
        </el-form-item>
        <el-form-item label="梯户数" prop="everyFloorDoors">
          <!-- <el-input v-model="form1.everyFloorDoors" /> -->
          <el-input-number v-model="form1.everyFloorDoors" :min="1" :max="20" />
        </el-form-item>
      </el-form>
    </el-row>

    <el-row v-show="active === 1">
      <el-row class="bt-line">
        <el-button @click="lastStep(1)">上一步</el-button>
        <el-button type="primary" @click="setChargeInfo()">下一步</el-button>
      </el-row>

      <el-form ref="form2" :model="form2" label-width="100px">
        <el-form-item label="水费 元/吨" prop="waterPrice">
          <el-input-number v-model="form2.waterPrice" :min="0" :step="0.1" />
        </el-form-item>
        <el-form-item label="电费 元/度" prop="electricityPrice">
          <el-input-number
            v-model="form2.electricityPrice"
            :min="0"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item label="卫生费 元/月" prop="cleanFee">
          <el-input-number v-model="form2.cleanFee" :min="0" :step="0.1" />
        </el-form-item>
        <el-form-item label="宽带费 元/月" prop="netFee">
          <el-input-number v-model="form2.netFee" :min="0" :step="0.1" />
        </el-form-item>

        <el-form-item label="其他 元/月" prop="elseFee">
          <el-input-number v-model="form2.elseFee" :min="0" :step="0.1" />
        </el-form-item>

        <!-- <el-row v-for="(charge, index) in form2.otherCharges" :key="charge.key">
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
              <el-input-number v-model="charge.chargeAmount" :min="0" :max="10000" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeChargeItem(charge)">删除</el-button>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="addChargeItem">新增项目</el-button>
        </el-form-item>
      </el-form>-->
      </el-form></el-row>

    <el-row v-show="active === 2">
      <el-row class="bt-line">
        <el-button @click="lastStep(2)">上一步</el-button>
        <el-button
          type="primary"
          @click="saveRoomData"
        >保存设置</el-button>
        <el-button-group style="float: right;">
          <el-button @click="selectionAllSelect">全选</el-button>
          <el-button @click="selectionAllNot">全不选</el-button>
          <el-button
            @click="changeCharge('roomFee', '房租')"
          >修改房租</el-button>
          <el-button
            @click="changeCharge('cleanFee', '卫生费')"
          >修改卫生费</el-button>
          <el-button
            @click="changeCharge('netFee', '宽带费')"
          >修改宽带费</el-button>
          <el-button
            @click="changeCharge('elseFee', '其他')"
          >修改其他</el-button>

          <!-- <el-button
            v-for="chargeInfo in form2.otherCharges"
            :key="chargeInfo.key"
            @click="changeCharge(chargeInfo.key, chargeInfo.chargeName)"
          >修改{{ chargeInfo.chargeName }}</el-button> -->
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
        <el-table-column prop="roomName" label="房间号">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.roomName }}</span> -->
            <el-input v-model="scope.row.roomName" />
          </template>
        </el-table-column>
        <el-table-column prop="roomFee" label="月租">
          <template slot-scope="scope">
            <el-input v-model="scope.row.roomFee" />
          </template>
        </el-table-column>

        <el-table-column prop="cleanFee" label="卫生费">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cleanFee" />
          </template>
        </el-table-column>

        <el-table-column prop="netFee" label="宽带费">
          <template slot-scope="scope">
            <el-input v-model="scope.row.netFee" />
          </template>
        </el-table-column>

        <el-table-column prop="elseFee" label="其他">
          <template slot-scope="scope">
            <el-input v-model="scope.row.elseFee" />
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-for="chargeInfo in form2.otherCharges"
          :key="chargeInfo.key"
          :prop="chargeInfo.key"
          :label="chargeInfo.chargeName"

        >
          <template slot-scope="scope">
            <el-input v-model="scope.row[chargeInfo.key]" />
          </template>
        </el-table-column> -->
      </el-table>
    </el-row>
    <el-row v-show="active === 3">
      <div class="finish">
        <i class="el-icon-finished" />
        <el-button
          type="primary"
          @click="addPaseList"
        >添加首期水电数据
        </el-button>
      </div>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <!-- :before-close="handleClose" -->
      <el-form label-width="100px">
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
import { addBuilding } from '@/api/buildingApi'
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
        waterPrice: 5,
        electricityPrice: 1.5,
        cleanFee: 20,
        netFee: 0,
        elseFee: 0
        // otherCharges: []
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
          const roomFees = {
            key: floor + '' + door,
            roomName: '' + floor + (door > 9 ? door : '0' + door),
            roomFee: 0
          }
          for (const key in this.form2) {
            if (this.form2.hasOwnProperty(key)) {
              const element = this.form2[key]
              roomFees[key] = element
            }
          }
          //   for (let ckey = 0; ckey < this.form2.otherCharges.length; ckey++) {
          //     const otherCInfo = this.form2.otherCharges[ckey]
          //     roomFees[otherCInfo.key] = this.form2.otherCharges[
          //       ckey
          //     ].chargeAmount
          //   }
          this.tableData.push(roomFees)
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
    test() {
      addBuilding(window.sendData).then(res => {
        this.buildingId = res.data
      })
    },
    saveRoomData() {
      //   api.then.///
      // 返回楼栋ID
      this.active = 3
      const sendData = {
        buildingInfo: this.form1,
        roomList: this.tableData
      }
      window.sendData = sendData
      console.log(JSON.stringify(sendData))
      addBuilding(sendData).then(res => {
        this.buildingId = res.result
      })
    },
    addPaseList() {
      this.$router.push({
        path: '/dbsSys/phase/add',
        query: { buildingId: this.buildingId }
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
