<template>
  <div
      class="app-container"
      style="display: flex; flex-direction: column; align-items: center"
  >
    <div style="font-size: 18px; line-height: 25px; margin: 24px 0 16px 0; display: flex; align-items: center">
      <span>
        环境错误修复管理
      </span>
      <el-button size="small" class="refresh-button" @click="insertError">添加</el-button>
    </div>
    <el-table
        style="width: auto"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        :border="false"
        fit
        highlight-current-row
        class="table"
    >
      <el-table-column align="left" label="ID" prop="id" width="55"/>
      <el-table-column
          align="left"
          label="错误名称"
          prop="name"
          width="155"
      />
      <el-table-column
          align="left"
          label="错误描述"
          prop="keyWords"
          width="455"
      />
      <el-table-column align="left" label="修复指令" width="260">
        <template slot-scope="scope">
          <el-popover placement="right" width="100%" trigger="hover">
            <p v-for="cmd in scope.row.repairCmds" :key="cmd">{{ cmd }}</p>
            <el-button slot="reference">{{ scope.row.repairCmds }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="200px">
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button @click="jumpToManageDialog(scope.row)">修改</el-button>
            <el-button @click="deleteById(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
    >
    </el-pagination>
    <el-dialog title="管理" :visible.sync="dialogVisible" width="1000px">
      <el-form label-position="right" label-width="auto">
        <el-form-item style="margin-right: 450px" label="ID">
          <el-input v-model="dialogErrorId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="错误名称">
          <div style="display: flex">
            <el-input
                style="margin-right: 20px"
                v-model="inputErrorName"
            ></el-input>
            <el-button
                style="margin-right: 450px"
                size="small"
                @click="updateName"
            >修改名称
            </el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="错误描述">
          <div style="display: flex">
            <el-input
                type="textarea"
                style="margin-right: 20px"
                :autosize="{ minRows: 3, maxRows: 7 }"
                maxlength="1000"
                v-model="inputKeyWords"
            >
            </el-input>
            <el-button
                style="height: 35px; margin-right: 50px"
                size="small"
                @click="updateKeywords"
            >修改描述
            </el-button
            >
          </div>
        </el-form-item>
        <br/>
        <el-form-item
            v-for="(cmd, index) in inputRepairCmds"
            :label="'修复指令' + index"
            :key="index"
        >
          <div style="display: flex">
            <el-input
                style="margin-right: 20px"
                v-model="inputRepairCmds[index]"
            ></el-input>
            <el-button style="margin-right: 150px" @click="removeCmd(index)"
            >删除
            </el-button
            >
          </div>
        </el-form-item>
        <!--        <el-form-item-->
        <!--          v-for="(cmd, index) in inputRepairCmds"-->
        <!--          :label="'修复指令' + index"-->
        <!--          :key="cmd.key"-->
        <!--          :prop="'cmds.' + index + '.value'"-->
        <!--          :rules="{ required: true, message: '指令不能为空', trigger: 'blur'}">-->
        <!--          <div style="display: flex">-->
        <!--            <el-input style="margin-right: 20px" v-model="cmd.index"></el-input>-->
        <!--            <el-button style="margin-right: 50px" @click="removeCmd(cmd)">删除</el-button>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button @click="addCmd">新增修复指令</el-button>
          <el-button type="primary" @click="updateRepairCmds"
          >提交修复指令
          </el-button
          >
          <!--          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="添加" :visible.sync="dialogInsertVisible" width="1000px">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="错误名称">
          <el-input style="width: 50%" v-model="insertErrorName"></el-input>
        </el-form-item>
        <el-form-item label="错误描述">
          <el-input
              type="textarea"
              style="margin-right: 20px"
              :autosize="{ minRows: 3, maxRows: 7 }"
              maxlength="1000"
              v-model="insertKeyWords"
          >
          </el-input>
        </el-form-item>
        <br/>
        <el-form-item
            v-for="(cmd, index) in insertRepairCmds"
            :label="'修复指令' + index"
            :key="index"
        >
          <div style="display: flex">
            <el-input
                style="margin-right: 20px"
                v-model="insertRepairCmds[index]"
            ></el-input>
            <el-button
                style="margin-right: 50px"
                @click="removeInsertCmd(index)"
            >删除
            </el-button
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addInsertCmd">新增修复指令</el-button>
        </el-form-item>
        <el-button type="primary" @click="insertCmds">添加</el-button>
      </el-form>
    </el-dialog>
    <!--    <el-dialog-->
    <!--      title="提示"-->
    <!--      :visible.sync="dialogWorningVisible"-->
    <!--      width="30%">-->
    <!--      <span>请谨慎修改此部分配置!</span>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="dialogWorningVisible = false">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import * as known_error_api from "../aix-known_error";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      totalCount: 0,
      pageSize: 9,
      currentPage: 1,
      dialogVisible: false,
      dialogInsertVisible: false,
      dialogWorningVisible: true,
      inputErrorName: "",
      insertErrorName: "",
      inputKeyWords: "",
      insertKeyWords: "",
      inputRepairCmds: [],
      insertRepairCmds: [],
      dialogErrorId: -1,
    };
  },
  created() {
    this.listLoading = true;
    known_error_api.getErrorCount().then((response) => {
      this.totalCount = response.data;
    });

    known_error_api.getErrorListByPage(1, this.pageSize).then((response) => {
      this.list = response.data;
      this.listLoading = false;
    });
  },
  methods: {
    updateName() {
      known_error_api
          .updateNameById(this.dialogErrorId + "", this.inputErrorName)
          .then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.refreshPage();
          });
    },
    updateKeywords() {
      known_error_api
          .updateKeywordsById(this.dialogErrorId + "", this.inputKeyWords)
          .then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.refreshPage();
          });
    },
    updateRepairCmds() {
      let canUpdate = true;
      for (var i = 0, len = this.inputRepairCmds.length; i < len; i++) {
        if (this.inputRepairCmds[i].trim() === "") {
          canUpdate = false;
          this.$message.error("不能有空指令!");
          return;
        }
      }
      if (!canUpdate) {
        return;
      }
      known_error_api
          .updateRepairCmdsById(
              this.dialogErrorId + "",
              JSON.stringify(this.inputRepairCmds)
          )
          .then((response) => {
            this.$message({
              message: "更新成功",
              type: "success",
            });
            this.refreshPage();
          });
    },
    insertError() {
      this.dialogInsertVisible = true;
    },
    deleteById(id) {
      this.$confirm("确认删除？")
          .then((_) => {
            known_error_api.deleteById(id).then((response) => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.refreshPage();
            });
          })
          .catch((_) => {
          });
    },
    insertCmds() {
      let canUpdate = true;
      for (var i = 0, len = this.insertRepairCmds.length; i < len; i++) {
        if (this.insertRepairCmds[i].trim() === "") {
          canUpdate = false;
          this.$message.error("不能有空指令!");
          return;
        }
      }
      if (
          this.insertErrorName.trim() === "" ||
          this.insertKeyWords.trim() === ""
      ) {
        canUpdate = false;
        this.$message.error("不能有空字段!");
      }
      if (!canUpdate) {
        return;
      }
      known_error_api
          .insert(
              this.insertErrorName.trim(),
              this.insertKeyWords.trim(),
              JSON.stringify(this.insertRepairCmds)
          )
          .then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.refreshPage();
          });
    },
    jumpToManageDialog(knownError) {
      this.dialogVisible = true;
      // this.dialogDeviceIndex = index
      this.dialogErrorId = knownError.id;
      this.inputErrorName = knownError.name;
      this.inputKeyWords = knownError.keyWords;
      this.inputRepairCmds = knownError.repairCmds.slice();
      // this.$router.push({
      //   path: `/detail/${token}`
      // })
    },
    handleCurrentChange(cur) {
      this.currentPage = cur;
      this.refreshPage();
    },
    refreshPage() {
      known_error_api.getErrorCount().then((response) => {
        this.totalCount = response.data;
      });
      known_error_api
          .getErrorListByPage(this.currentPage, this.pageSize)
          .then((response) => {
            this.list = response.data;
            this.listLoading = false;
          });
    },
    removeCmd(index) {
      this.inputRepairCmds.splice(index, 1);
    },
    removeInsertCmd(index) {
      this.insertRepairCmds.splice(index, 1);
    },
    addInsertCmd() {
      this.insertRepairCmds.push("");
    },
    addCmd() {
      this.inputRepairCmds.push("");
    },
  },
};
</script>

<style lang="less" scoped>
.refresh-button {
  color: rgba(25, 118, 210, 1);
  border-color: rgba(25, 118, 210, 1);
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  padding: 0 12px;
  font-weight: unset;
  margin-left: auto;
}

.table {
  border: 1px solid rgba(207, 216, 220, 1);
  border-radius: 4px;

  &:before {
    content: unset;
  }

  &:after {
    content: unset;
  }
  /deep/ table {
    border: unset !important;
  }
  /deep/ thead {
    line-height: 14px;
  }

  /deep/ th {
    background-color: rgba(248, 249, 249, 1) !important;
    color: rgba(38, 50, 56, 1);
    font-size: 14px;
    font-weight: 500;
    border: unset;
  }

  /deep/ tbody td {
    height: 40px;
    line-height: 40px;
    padding: 0;
    color: rgba(73, 93, 103, 1);
    font-size: 14px;
  }

  /deep/ .card {
    border-radius: unset;
    border: unset !important;
  }

  .action-button {
    &:focus {
      outline: unset;
    }
  }
}
</style>
