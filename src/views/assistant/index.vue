<script setup lang="ts">
import ChatBox from "./chatbox.vue";
import { ref, getCurrentInstance, onMounted, onUnmounted } from "vue";
import { message } from "@/utils/message";
import { getRes, changeMode, clear } from "@/api/getResponse";
import { Delete } from "@element-plus/icons-vue";
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Assistant"
});
const messages = ref([]);

onMounted(() => {
  //读取历史记录
  console.log("mounted");
  let t = getCurrentInstance().appContext.config.globalProperties.$history;
  if (t) {
    // 循环添加
    for (let i = 0; i < t.length; i++) messages.value.push(t[i]);
    if (t.length > 1) {
      mode.value = 5;
      usellm.value = true;
    }
    console.log(messages.value);
  }
});

onUnmounted(() => {
  // 离开时只要在LSTM、开启大模型且有对话内容就保存历史记录
  console.log("unmounted");
  if (messages.value.length > 1 && mode.value === 5 && usellm.value === true) {
    getCurrentInstance().appContext.config.globalProperties.$history =
      messages.value;
    return;
  } else {
    // 无对话内容，重置历史记录
    getCurrentInstance().appContext.config.globalProperties.$history = [
      {
        sender: "other",
        content: "您好，我是您的智能答疑助手，请问有什么我可以帮助您的吗？"
      }
    ];
  }
});

const usermessage = ref("");
const bloading = ref(false);
const mode = ref();
const usellm = ref(false);
const fullscreenLoading = ref(false);

const sendMessage = async () => {
  if (usermessage.value === "") {
    message("内容不能为空！", { type: "error" });
    return;
  } else if (bloading.value) {
    message("系统正在处理消息，请等待输出结束...", { type: "warning" });
    return;
  } else if (mode.value === undefined) {
    message("请选择匹配模式！", { type: "error" });
    return;
  }

  bloading.value = true;
  messages.value.push({ sender: "me", content: usermessage.value });
  let temp = usermessage.value;
  usermessage.value = "";

  let res = await getRes({
    question: temp,
    mode: mode.value,
    usellm: usellm.value
  });

  if (res.success) {
    messages.value.push({
      sender: "other",
      content: res.data["response"]
    });
    bloading.value = false;
  }
};

const clearMessages = async () => {
  console.log("clear");
  //将messages数组清空至只剩下第一条消息
  messages.value.splice(1);
  usermessage.value = "";
  message("聊天记录已清空！", { type: "success" });
  let clearRes = await clear();
  if (clearRes.success) {
    mode.value = undefined;
    bloading.value = false;
    message("缓存已清空！", { type: "success" });
  } else {
    message("清空缓存失败！", { type: "error" });
  }
};

const changeModeAction = async () => {
  fullscreenLoading.value = true;
  let res = await changeMode(mode.value);
  if (res.success) {
    fullscreenLoading.value = false;
    message("匹配模式已切换！", { type: "success" });
  } else {
    fullscreenLoading.value = false;
    message("匹配模式切换失败！", { type: "error" });
  }
};
</script>

<template>
  <div id="main" class="flex flex-col h-full">
    <el-affix :offset="100">
      <div class="grid grid-cols-12 gap-4 items-center">
        <el-popconfirm
          title="你确定要清空聊天记录吗？"
          @confirm="clearMessages"
        >
          <template #reference>
            <el-button type="danger" :icon="Delete">清空记录</el-button>
          </template>
        </el-popconfirm>
        <el-select
          v-model="mode"
          v-loading.fullscreen.lock="fullscreenLoading"
          placeholder="请选择匹配模式"
          class="w-auto col-span-2"
          :disabled="messages.length > 1"
          @change="changeModeAction"
        >
          <el-option label="BoW" :value="1" />
          <el-option label="BM25" :value="2" />
          <el-option label="VSM-tfidf" :value="3" />
          <el-option label="VSM-Word2Vec" :value="4" />
          <el-option label="LSTM" :value="5" />
        </el-select>
        <span v-if="mode === 5" class="text-right font-bold text-xl col-span-2">
          大模型辅助：
        </span>
        <el-switch
          v-if="mode === 5"
          v-model="usellm"
          size="large"
          inline-prompt
          style="

--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="开启"
          inactive-text="关闭"
          :disabled="messages.length > 1"
        />
      </div>
    </el-affix>
    <div id="box" class="mb-auto">
      <ChatBox :userq="messages" />
    </div>
    <el-affix position="bottom" :offset="30">
      <el-input v-model="usermessage" @keyup.enter="sendMessage">
        <template #append>
          <el-button type="primary" :loading="bloading" @click="sendMessage"
            >发送</el-button
          >
        </template>
      </el-input>
    </el-affix>
  </div>
</template>
