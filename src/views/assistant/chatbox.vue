<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
const messages = ref([]);
const props = defineProps({
  userq: {
    type: Array<any>,
    default: null
  }
});
messages.value = props.userq;
const child = ref();
watch(
  () => messages,
  newVal => {
    console.log("探测到");
    nextTick(() => {
      child.value[newVal.value.length - 1].scrollIntoView(); // 关键代码
    });
  },
  {
    deep: true
  }
);
</script>

<template>
  <!--          消息整体-->
  <div
    v-for="(message, index) in messages"
    :key="index"
    ref="child"
    :class="message.sender === 'me' ? 'flex flex-row-reverse' : 'flex'"
    :style="{
      'padding-bottom': messages.length - 1 === index ? '2rem' : 'none'
    }"
  >
    <!--            消息头像-->
    <div class="">
      <FontIcon
        :icon="
          message.sender === 'me'
            ? 'icon-a-biyexueyeboshimao'
            : 'icon-AIzhineng'
        "
        style="font-size: 30px"
      />
    </div>
    <!--          消息-->
    <div
      :class="
        message.sender === 'me'
          ? 'flex flex-col pt-5 pr-2'
          : 'flex flex-col pt-5 pl-2'
      "
    >
      <!--          消息内容-->
      <div
        :class="
          message.sender === 'me'
            ? 'max-w-2xl w-auto bg-emerald-300 px-3 py-1.5 rounded-md break-words break-all inline-block'
            : 'max-w-2xl w-auto bg-zinc-300 px-3 py-1.5 rounded-md break-words break-all inline-block'
        "
      >
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
