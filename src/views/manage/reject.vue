<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { getCurUserAllOrders } from "@/api/getInfo";
import { changeStatus, deleteOrder } from "@/api/orders";

defineOptions({
  name: "Reject"
});

const loading = ref(false);
const tableData = ref([]);
const rejectConfirmWindow = ref(false);
const destoryConfirmWindow = ref(false);
var selectId = 0;

onMounted(async () => {
  loading.value = true;
  let productsRes = await getCurUserAllOrders();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
});

const refresh = async () => {
  loading.value = true;
  let productsRes = await getCurUserAllOrders();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
};

const Confirm = row => {
  selectId = row.orderid;
  if (row.sta === "已退货") {
    message("该商品已退货", { type: "warning" });
    return;
  } else if (row.sta === "已下单") {
    message("该订单还未发货", { type: "warning" });
    destoryConfirmWindow.value = true;
    return;
  }
  rejectConfirmWindow.value = true;
};
const RejectAct = async () => {
  loading.value = true;
  let res = await changeStatus({ orderid: selectId, status: "已退货" });
  if (res.success) {
    message("退货成功", { type: "success" });
    rejectConfirmWindow.value = false;
    refresh();
    return;
  }
  message("退货失败", { type: "error" });
};
const DestoryAct = async () => {
  loading.value = true;
  let res = await deleteOrder({ orderid: selectId });
  if (res.success) {
    message("取消订单成功", { type: "success" });
    destoryConfirmWindow.value = false;
    refresh();
    return;
  }
  message("取消订单失败", { type: "error" });
};
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="pt-5">
        <el-card>
          <template #header>
            <div class="text-2xl font-bold text-center">
              <span>所有订单</span>
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
                您目前没有任何订单记录
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
                  @click="Confirm(scope.row)"
                >
                  退货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div>
      <el-dialog v-model="rejectConfirmWindow" title="商品退货" width="300">
        <span>确认需要进行退货吗？</span>
        <template #footer>
          <el-button @click="rejectConfirmWindow = false">取 消</el-button>
          <el-button type="primary" @click="RejectAct">确 定</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="destoryConfirmWindow" title="取消订单" width="500">
        <span>该订单目前还未发货，您确定取消该订单吗？</span>
        <br />
        <span class="font-bold text-amber-600"
          >取消后，该订单将不会在订单列表中出现</span
        >
        <template #footer>
          <el-button @click="destoryConfirmWindow = false">取 消</el-button>
          <el-button type="primary" @click="DestoryAct">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
