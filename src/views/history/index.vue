<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurUserHistory } from "@/api/getInfo";
import { delQaFromHistory } from "@/api/qa";
import { message } from "@/utils/message";
defineOptions({
  name: "Edit"
});

const loading = ref(false);
const tableData = ref([]);
const delWindow = ref(false);
const selectedItem = ref(null);

const refresh = async () => {
  loading.value = true;
  let productsRes = await getCurUserHistory();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
};

onMounted(async () => {
  loading.value = true;
  let historyRes = await getCurUserHistory();
  if (historyRes.success) {
    tableData.value = historyRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
});

const TimestampToDate = timestamp => {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};

const delConfirm = async () => {
  console.log(selectedItem.value);
  let delRes = await delQaFromHistory({
    timestamp: selectedItem.value.timestamp
  });
  if (delRes.success) {
    message("删除成功", { type: "success" });
    delWindow.value = false;
    refresh();
  } else {
    message("删除失败", { type: "error" });
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="pt-5">
        <el-card>
          <template #header>
            <div class="text-2xl font-bold grid grid-cols-3">
              <div class="col-start-2 text-center">
                <span>您的问答历史记录</span>
              </div>
            </div>
          </template>
          <el-table
            v-loading="loading"
            stripe
            :data="tableData"
            size="large"
            style="width: 100%"
            :header-row-style="{ fontSize: '18px', flexDirection: 'row' }"
          >
            <el-table-column
              prop="timestamp"
              label="时间"
              width="200"
              :formatter="obj => TimestampToDate(obj.timestamp)"
            />
            <el-table-column prop="q" label="问题" width="300" />
            <el-table-column prop="a" label="回答" width="300" />
            <el-table-column
              prop="llm"
              label="大模型"
              width="100"
              :formatter="
                obj => {
                  return obj.llm === 1 ? '是' : '否';
                }
              "
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="150"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="danger"
                  @click="
                    delWindow = true;
                    selectedItem = scope.row;
                  "
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <el-dialog v-model="delWindow" title="删除记录" width="300">
      <span>确认删除该条记录吗？</span>
      <template #footer>
        <el-button @click="delWindow = false">取 消</el-button>
        <el-button type="danger" @click="delConfirm"> 确 定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
