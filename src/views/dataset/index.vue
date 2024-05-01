<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { delay } from "@pureadmin/utils";
defineOptions({
  name: "Dataset"
});

const loading = ref(false);
const dataList = ref([]);
const columns: TableColumnList = [
  {
    label: "博文id",
    prop: "id",
    minWidth: 100
  },
  {
    label: "用户名",
    prop: "username",
    minWidth: 150
  },
  {
    label: "日期",
    prop: "date",
    minWidth: 200
  },
  {
    label: "正文",
    prop: "text",
    minWidth: 700
  },
  {
    label: "主题",
    prop: "topic",
    minWidth: 400
  },
  {
    label: "点赞量",
    prop: "attitude",
    minWidth: 100
  },
  {
    label: "评论量",
    prop: "comment",
    minWidth: 100
  },
  {
    label: "转发量",
    prop: "repost",
    minWidth: 100
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
const pagination = reactive({
  pageSize: 15,
  currentPage: 1,
  pageSizes: [10, 15, 20],
  total: 0,
  align: "center",
  background: true,
  small: false
});
function onCurrentChange(val) {
  loadingConfig.text = `正在加载第${val}页...`;
  loading.value = true;
  delay(600).then(() => {
    loading.value = false;
  });
}

onMounted(() => {
  delay(600).then(() => {
    // dataList.value = tableData;
    pagination.total = dataList.value.length;
    loading.value = false;
  });
});
</script>

<template>
  <div>
    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      size="large"
      :height="800"
      :loading="loading"
      :loading-config="loadingConfig"
      :data="
        dataList.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @current-change="onCurrentChange"
    />
  </div>
</template>
