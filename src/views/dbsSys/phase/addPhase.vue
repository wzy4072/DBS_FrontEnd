<template>
  <div>
    <div class="activetab">
      <br>
      <el-steps
        :active="active"
        finish-status="success"
        simple
        style="margin-top: 20px;"
      >
        <el-step title="选择楼栋" />
        <el-step title="录入水电" />
        <el-step title="确认费用" />
      </el-steps>
      <br>
      <el-row v-show="active === 0">
        <el-row class="bt-line">
          <el-button type="primary" @click="setMatters()">下一步</el-button>
        </el-row>
        <el-form ref="form1" label-width="80px">
          <el-form-item label="选择楼栋" prop="buildingName">
            <el-select v-model="buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.buildingName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="期数期名" prop="buildingName">
            <el-input v-model="phaseName" placeholder="如：2020年5月租金单" />
          </el-form-item>
        </el-form>
      </el-row>

      <el-row v-show="active === 1">
        <el-row class="bt-line">
          <el-button @click="lastStep(1)">上一步</el-button>
          <el-button
            type="primary"
            @click="generateChargeTable()"
          >下一步</el-button>
        </el-row>

        <el-table
          ref="meterTable"
          :data="meterTableData"
          tooltip-effect="dark"
          style="width: 100%;"
        >
          <!-- {roomId roomName roomFee  cleanFee waterPrice electricityPrice waterMeter electricityMeter } -->
          <el-table-column prop="roomName" label="房间号" width="120" />
          <el-table-column prop="lastwaterMeter" label="上期水表" width="120" />
          <el-table-column prop="waterMeter" label="本期水表" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.waterMeter" />
            </template>
          </el-table-column>
          <el-table-column
            prop="lastelectricityMeter"
            label="上期电表"
            width="120"
          />
          <el-table-column prop="electricityMeter" label="本期电表" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.electricityMeter" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row v-show="active === 2">
        <el-row class="bt-line">
          <el-button @click="lastStep(2)">上一步</el-button>
          <el-button
            type="primary"
            @click="savePhase"
          >确认生成本期费用</el-button>
          <el-button-group style="float: right;">
            <el-button @click="selectionAllSelect">全选</el-button>
            <el-button @click="selectionAllNot">全不选</el-button>
            <el-button
              @click="changeCharge('roomFee', '房租')"
            >修改房租</el-button>
            <el-button
              v-for="chargeInfo in otherCharges"
              :key="chargeInfo.key"
              @click="changeCharge(chargeInfo.key, chargeInfo.chargeName)"
            >修改{{ chargeInfo.chargeName }}</el-button>
          </el-button-group>
        </el-row>

        <el-table
          ref="chargeTable"
          :data="chargeTableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="roomName" label="房间号" width="120" />

          <el-table-column prop="roomFee" label="租金" width="120" />

          <el-table-column label="水费" width="120">
            <template slot-scope="scope">
              <span>{{
                `(${scope.row.useWater}*${scope.row.waterPrice})= ${scope.row.waterFees}`
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="电费" width="120">
            <template slot-scope="scope">
              <span>{{
                `(${scope.row.useElectricity}*${scope.row.electricityPrice})= ${scope.row.electricityFees}`
              }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="cleanFee" label="卫生费" width="120" />
          <el-table-column
            v-for="chargeInfo in otherCharges"
            :key="chargeInfo.key"
            :prop="chargeInfo.key"
            :label="chargeInfo.chargeName"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[chargeInfo.key] }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="roomAmount" label="总费用" width="120" />

          <el-table-column label="用水量" width="120">
            <template slot-scope="scope">
              <span>{{
                `(${scope.row.lastwaterMeter}-${scope.row.waterMeter})= ${scope.row.useWater}`
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用电量" width="120">
            <template slot-scope="scope">
              <span>{{
                `(${scope.row.lastelectricityMeter}-${scope.row.electricityMeter})= ${scope.row.useElectricity}`
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row v-show="active === 3">
        <div class="finish">
          <i class="el-icon-finished" />
          <el-button type="primary" @click="printBill">打印单据 </el-button>
        </div>
      </el-row>

      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
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
import {
  getBuildings,
  getRoomsByBuildingId,
  addPhase
} from '@/api/buildingApi'

function getArrayItemById(arr, keyName, keyValue) {
  let result = null
  if (!arr || arr.length === 0) return result

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    if (element[keyName] === keyValue) {
      result = element
      break
    }
  }
  return result
}

export default {
  name: 'PhaseAdd',

  data() {
    return {
      active: 0,

      phaseName: '',
      buildingList: [],
      buildingId: '',

      roomList: [],
      otherCharges: [],

      // 上期水电表
      lastPhaseMeter: [],

      meterTableData: [],
      lastPhaseId: '',
      chargeTableData: [],

      multipleSelection: [],
      dialogForm: {
        chargeName: '',
        chargeKey: '',
        charge: ''
      },
      dialogVisible: false
    }
  },
  mounted() {
    // 获取建筑列表
    this.getBuildingList()
    this.buildingId = parseInt(this.$route.query.buildingId) || null
    this.getCharges()
    this.getTableData()
  },
  methods: {
    saveRoomData() {},

    async setMatters() {
      this.active = 1
      const res = await this.getChargesAndRoomsInfo()
      this.roomList = res.result
      this.otherCharges = []
      this.lastPhaseMeter = await this.getLastPhaseInfoByBuildingId()
      this.generateMeterTable()
    },
    lastStep() {
      this.active--
    },
    getBuildingList() {
      getBuildings().then(res => {
        this.buildingList = res.result
      })
    },
    getLastPhaseInfoByBuildingId() {},
    getChargesAndRoomsInfo() {
      const { buildingId } = this
      return getRoomsByBuildingId(buildingId).then(res => {
        return res
      })
    },
    generateMeterTable() {
      // row  {roomId roomName roomFee  cleanFee waterPrice electricityPrice waterMeter electricityMeter }
      this.meterTableData = this.roomList.map(room => {
        const lastPhase = getArrayItemById(
          this.lastPhaseMeter,
          'roomId',
          room.roomId
        )
        return Object.assign({}, room, {
          ['last' + 'waterMeter']: lastPhase ? lastPhase.waterMeter : 0,
          ['last' + 'electricityMeter']: lastPhase
            ? lastPhase.electricityMeter
            : 0,
          waterMeter: 0,
          electricityMeter: 0
        })
      })
    },

    // 根据水电表计算本月总费用
    generateChargeTable() {
      //  {roomId roomName roomFee  cleanFee waterPrice electricityPrice waterMeter electricityMeter }
      // {  roomAmount useWater  waterFees  useElectricity electricityFees  }
      // otherFees

      let otherFees = 0
      const otherFeesObj = {}
      this.otherCharges.map(fee => {
        otherFees += parseInt(fee.chargeAmount)
        otherFeesObj[fee.key] = fee.chargeAmount
      })

      this.chargeTableData = this.meterTableData.map(room => {
        const useWater = room.waterMeter - room.lastwaterMeter
        const useElectricity =
          room.electricityMeter - room.lastelectricityMeter
        const waterFees = (1000 * room.waterPrice * useWater) / 1000
        const electricityFees =
          (1000 * room.electricityPrice * useElectricity) / 1000

        const roomAmount =
          100 * room.roomFee +
          100 * waterFees +
          100 * electricityFees +
          100 * room.cleanFee +
          100 * otherFees
        return Object.assign({}, room, otherFeesObj, {
          roomId: room.id,
          roomAmount: roomAmount / 100,
          useWater,
          useElectricity,
          waterFees,
          electricityFees
        })
      })

      this.active++
    },
    savePhase() {
      // api saveData
      const chargeList = []
      const metersList = []
      this.chargeTableData.map(row => {
        metersList.push({
          buildingId: this.buildingId,
          phaseId: null,
          waterMeter: row.waterMeter,
          electricityMeter: row.electricityMeter
        })
        delete row.useWater
        delete row.useElectricity
        delete row.id
        chargeList.push(row)
      })

      const sendData = {
        phaseInfo: {
          phaseName: this.phaseName,
          buildingId: this.buildingId
        },
        chargeList,
        metersList
      }
      //   window.sendData = sendData
      addPhase(sendData).then(res => {
        if (res.result.phaseId) {
          this.$message.success('保存成功！')
        }
      })

      this.active++
    },
    printBill() {
      this.$router.push({
        paht: '/printBill',
        query: { phaseId: 66 }
      })
    },
    test() {
      addPhase(window.sendData).then(res => {
        console.log(res)
      })

      this.active++
    },
    getTableData() {},
    getCharges() {},
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
    }
  }
}
</script>
