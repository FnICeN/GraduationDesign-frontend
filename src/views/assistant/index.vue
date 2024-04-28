<script setup lang="ts">
import ChatBox from "./chatbox.vue";
import { ref } from "vue";
import { message } from "@/utils/message";
import { getRes } from "@/api/getResponse";
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Assistant"
});
const messages = ref([
  {
    sender: "other",
    content: "您好，我是您的智能答疑助手，请问有什么我可以帮助您的吗？"
  }
]);

const usermessage = ref("");
const bloading = ref(false);

const sendMessage = async () => {
  if (usermessage.value === "") {
    message("内容不能为空！", { type: "error" });
    return;
  } else if (bloading.value) {
    message("系统正在处理消息，请等待输出结束...", { type: "warning" });
    return;
  }

  bloading.value = true;
  messages.value.push({ sender: "me", content: usermessage.value });
  let temp = usermessage.value;
  usermessage.value = "";

  let res = await getRes({ question: temp });

  if (res.success) {
    messages.value.push({ sender: "other", content: res.data["response"] });
    bloading.value = false;
  }
};
</script>

<template>
  <div id="main" class="flex flex-col h-full">
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
