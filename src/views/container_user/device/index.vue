<template>
  <div
    class="app-container"
    style="display: flex; flex-direction: column; align-items: center"
  >
    <h1 style="align-self: center">已注册算力设备</h1>
    <el-table
      style="width: auto"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="left" label="ID" prop="id" width="55" />
      <el-table-column
        align="left"
        label="名称"
        prop="deviceName"
        width="65"
      />
      <el-table-column align="left" label="描述" prop="info" width="155" />
      <el-table-column
        align="left"
        label="创建者ID"
        prop="userId"
        width="60"
      />
      <el-table-column
        align="left"
        label="创建时间"
        prop="createdTime"
        width="100"
      />
      <el-table-column
        align="left"
        label="活动时间"
        prop="lastLogin"
        width="100"
      />
      <el-table-column
        align="left"
        label="GPU驱动"
        prop="driverVersion"
        width="90"
      />
      <el-table-column
        align="left"
        label="CUDA版本"
        prop="cudaVersion"
        width="90"
      />
      <el-table-column align="left" label="GPU数量" width="95">
        <template slot-scope="scope">
          <el-popover placement="right" width="100%" trigger="hover">
            <el-table :data="scope.row.gpus">
              <el-table-column prop="id" label="编号" width="55" />
              <el-table-column prop="name" label="型号" width="150" />
              <el-table-column prop="calPower" label="算力" width="50" />
              <el-table-column prop="powerLimit" label="额定功率" width="99" />
              <el-table-column prop="memAll" label="显存总量" width="99" />
            </el-table>
            <el-button slot="reference">{{ scope.row.gpuNum }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="显存(MB)"
        prop="gpuMemSum"
        width="100"
      />
      <el-table-column
        align="left"
        label="算力"
        prop="calPowerSum"
        width="55"
      />
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
import * as device_api from "../aix-device";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      totalCount: 0,
      pageSize: 9,
      currentPage: 1,

      inputDeviceName: "",
      inputDeviceInfo: "",
      dialogDeviceInfo: {
        deviceName: "unknown",
        id: "",
        userId: "",
        info: "",
        token: "",
      },
    };
  },
  methods: {
    updateName() {
      device_api
        .updateDeviceNameById(
          this.dialogDeviceInfo.id + "",
          this.inputDeviceName
        )
        .then((response) => {
          this.refreshPage();
        });
    },
    updateInfo() {
      device_api
        .updateDeviceInfoById(
          this.dialogDeviceInfo.id + "",
          this.inputDeviceInfo
        )
        .then((response) => {
          this.refreshPage();
        });
    },
    handleCurrentChange(cur) {
      this.currentPage = cur;
      this.refreshPage();
    },
    refreshPage() {
      device_api.getDeviceCount().then((response) => {
        this.totalCount = response.data;
      });

      device_api
        .getClientListByPage(this.currentPage, this.pageSize)
        .then((response) => {
          this.list = response.data;
          this.listLoading = false;
        });
    },
  },
  created() {
    this.listLoading = true;
    device_api.getDeviceCount().then((response) => {
      this.totalCount = response.data;
    });

    device_api.getClientListByPage(1, this.pageSize).then((response) => {
      this.list = response.data;
      this.listLoading = false;
    });
    // const win = this
    // // 定义复制按钮
    // const btn = new ClipboardJS('.copyBtn')
    // btn.on('success', function(e) {
    //   console.info('Action:', e.action)
    //   console.info('Text:', e.text)
    //   console.info('Trigger:', e.trigger)
    //   win.copySuccess()
    //   e.clearSelection()
    // })
  },
};
</script>

<style scoped>
</style>
