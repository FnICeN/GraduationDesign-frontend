<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue";
import { getCurUserInfo } from "@/api/getInfo";
import { useTransition } from "@vueuse/core";
defineOptions({
  name: "Welcome"
});

const userid = ref(0);
const username = ref("未登录");
const orderCount_source = ref(0);
const sendOrReceiveCount_source = ref(0);
const completeCount_source = ref(0);
const app = getCurrentInstance();

const output_orderCount = useTransition(orderCount_source, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1]
});
const output_sendOrReceiveCount = useTransition(sendOrReceiveCount_source, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1]
});
const output_completeCount = useTransition(completeCount_source, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1]
});

onMounted(async () => {
  let res = await getCurUserInfo();
  userid.value = res.data.userid;
  username.value = res.data.username;
  orderCount_source.value = res.data.orderCount;
  sendOrReceiveCount_source.value = res.data.sendOrReceiveCount;
  completeCount_source.value = res.data.completeCount;
  console.log(res);
  //保存用户名到全局
  app.appContext.config.globalProperties.$username = res.data.username;
});
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 v-if="userid === 0">您还未登录，请先登录</h1>
    <el-card v-if="userid !== 0" class="w-3/5">
      <template #header>
        <h1 class="text-center">欢迎访问在线电商平台，尊敬的{{ username }}</h1>
      </template>
      <div>
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="h-full p-5 rounded bg-gray-200 flex flex-col">
              <el-statistic
                :value="output_orderCount"
                :precision="0"
                value-style="font-size: 30px"
              >
                <template #title>
                  <span class="text-base">您的的所有订单数</span>
                </template>
              </el-statistic>
              <!-- <span>您的的所有订单数</span>
              <ReNormalCountTo
                :duration="1000"
                :color="'#409EFF'"
                :fontSize="'2em'"
                :startVal="1"
                :endVal="userInfo.orderCount"
              /> -->
            </div>
          </el-col>
          <el-col :span="8">
            <div class="h-100% p-5 rounded bg-gray-200">
              <el-statistic
                :value="output_sendOrReceiveCount"
                :precision="0"
                value-style="font-size: 30px; color: #c4aa00"
              >
                <template #title>
                  <span class="text-base">您待发货或签收的订单数</span>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="h-100% p-5 rounded bg-gray-200">
              <el-statistic
                :value="output_completeCount"
                :precision="0"
                value-style="font-size: 30px; color: #67C23A"
              >
                <template #title>
                  <span class="text-base">您已完成的订单数</span>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
