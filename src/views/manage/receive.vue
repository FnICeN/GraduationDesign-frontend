<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { getCurUserSendOrReceive } from "@/api/getInfo";
import { changeStatus } from "@/api/orders";

defineOptions({
  name: "Receive"
});

const loading = ref(false);
const tableData = ref([]);
const sendConfirmWindow = ref(false);
const ReceiveConfirmWindow = ref(false);
var selectId = 0;

onMounted(async () => {
  loading.value = true;
  let productsRes = await getCurUserSendOrReceive();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
});

const refresh = async () => {
  loading.value = true;
  let productsRes = await getCurUserSendOrReceive();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
};

const sendConfirm = row => {
  if (row.sta === "已发货") {
    message("该商品已发货过，请收货", { type: "warning" });
    return;
  }
  selectId = row.orderid;
  sendConfirmWindow.value = true;
  console.log("sendConfirm", row);
};
const ReciveConfirm = row => {
  if (row.sta === "已下单") {
    message("请先发货", { type: "warning" });
    return;
  }
  selectId = row.orderid;
  ReceiveConfirmWindow.value = true;
  console.log("ReciveConfirm", row);
};
const sendAct = async () => {
  let res = await changeStatus({ orderid: selectId, status: "已发货" });
  if (res.success) {
    message("发货成功", { type: "success" });
    sendConfirmWindow.value = false;
    refresh();
    return;
  }
  message("发货失败", { type: "error" });
};
const ReceiveAct = async () => {
  let res = await changeStatus({ orderid: selectId, status: "已签收" });
  if (res.success) {
    message("收货成功", { type: "success" });
    ReceiveConfirmWindow.value = false;
    refresh();
    return;
  }
  message("收货失败", { type: "error" });
};
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="pt-5">
        <el-card>
          <template #header>
            <div class="text-2xl font-bold text-center">
              <span>待收发列表</span>
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
            <template #empty>
              <div class="text-center text-gray-400 text-base">
                您没有需要发货或签收的商品
              </div>
            </template>
            <el-table-column fixed prop="orderid" label="订单号" width="100" />
            <el-table-column prop="productname" label="商品名" width="150" />
            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column
              prop="sta"
              label="当前状态"
              width="150"
              align="center"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="280"
              header-align="center"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  size="default"
                  @click="sendConfirm(scope.row)"
                >
                  发货
                </el-button>
                <el-button
                  type="primary"
                  size="default"
                  @click="ReciveConfirm(scope.row)"
                >
                  签收
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div>
      <el-dialog v-model="sendConfirmWindow" title="商品发货" width="300">
        <span>确认发出商品吗？</span>
        <template #footer>
          <el-button @click="sendConfirmWindow = false">取 消</el-button>
          <el-button type="primary" @click="sendAct">确 定</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="ReceiveConfirmWindow" title="商品收货" width="300">
        <span>确认签收商品吗？</span>
        <template #footer>
          <el-button @click="ReceiveConfirmWindow = false">取 消</el-button>
          <el-button type="primary" @click="ReceiveAct">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
