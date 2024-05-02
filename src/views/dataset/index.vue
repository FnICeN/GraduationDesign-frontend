<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { delay } from "@pureadmin/utils";
import { getQa, getQaLength } from "@/api/qa";
defineOptions({
  name: "Dataset"
});

const loading = ref(false);
const dataList = ref([]);
const columns: TableColumnList = [
  {
    label: "问题",
    prop: "q",
    minWidth: 200
  },
  {
    label: "答案",
    prop: "a",
    minWidth: 200
  }
];
/** 加载动画配置 */
const loadingConfig = reactive({
  text: "正在加载第一页...",
  viewBox: "-10, -10, 50, 50",
  spinner: `
      <path class="path" d="
        M 30 15
        L 28 17
        M 25.61 25.61
        A 15 15, 0, 0, 1, 15 30
        A 15 15, 0, 1, 1, 27.99 7.5
        L 15 15
      " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
    `
  // svg: "",
  // background: rgba()
});
/** 分页配置 */
const pagination = ref({
  pageSize: 15,
  currentPage: 1,
  pageSizes: [15],
  total: 0,
  align: "center",
  background: true,
  small: false
});
const onCurrentChange = async val => {
  if (typeof val == "object") {
    return;
  }
  loadingConfig.text = `正在加载第${val}页...`;
  loading.value = true;
  console.log(val);
  let qas = await getQa(val);
  dataList.value = qas.data;
  delay(500).then(() => {
    loading.value = false;
  });
};

onMounted(async () => {
  let length = await getQaLength();
  pagination.value.total = length;
  let qas = await getQa(1);
  dataList.value = qas.data;
  loading.value = false;
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="pb-5">
      <span class="text-2xl font-bold">训练 / 回答数据集</span>
    </div>
    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      size="large"
      :height="800"
      :loading="loading"
      :loading-config="loadingConfig"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      @current-change="onCurrentChange"
    />
  </div>
</template>
