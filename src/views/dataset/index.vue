<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { delay } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { getQa, getQaLength, addQa, delQa, updateQa } from "@/api/qa";
defineOptions({
  name: "Dataset"
});

const loading = ref(false);
const dataList = ref([]);
const isEdit = ref(false);
const editWindow = ref(false);
const delWindow = ref(false);
const selectedItem = ref(null);
const formItem = ref({
  q: "",
  a: ""
});
const columns: TableColumnList = [
  {
    label: "ID",
    prop: "id",
    hide: true
  },
  {
    label: "问题",
    prop: "q",
    minWidth: 200
  },
  {
    label: "答案",
    prop: "a",
    minWidth: 200
  },
  {
    headerSlot: "operateHeader",
    label: "操作",
    fixed: "right",
    slot: "operation"
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

const editClick = row => {
  if (!isEdit.value) {
    formItem.value.q = "";
    formItem.value.a = "";
    message("请填写问题和答案", { type: "warning" });
    editWindow.value = true;
    return;
  }
  selectedItem.value = row.row;
  formItem.value.q = row.row.q;
  formItem.value.a = row.row.a;
  editWindow.value = true;
  console.log("edit", selectedItem.value);
};

const del = row => {
  selectedItem.value = row.row;
  delWindow.value = true;
  console.log("del", row);
};

const editConfirm = async () => {
  console.log("editConfirm", selectedItem.value);
  let res = await updateQa({
    id: selectedItem.value.id,
    q: formItem.value.q,
    a: formItem.value.a
  });
  if (res.success) {
    message("修改成功", { type: "success" });
    editWindow.value = false;
    onCurrentChange(pagination.value.currentPage);
    return;
  }
  message("修改失败", { type: "error" });
};

const delConfirm = async () => {
  console.log("delConfirm", selectedItem.value);
  let res = await delQa({ id: selectedItem.value.id });
  if (res.success) {
    message("删除成功", { type: "success" });
    delWindow.value = false;
    onCurrentChange(pagination.value.currentPage);

    return;
  }
  message("删除失败", { type: "error" });
};

const addConfirm = async () => {
  console.log("addConfirm", formItem.value);
  let res = await addQa({
    q: formItem.value.q,
    a: formItem.value.a
  });
  if (res.success) {
    message("添加成功", { type: "success" });
    editWindow.value = false;
    onCurrentChange(pagination.value.currentPage);
    return;
  }
  message("添加失败", { type: "error" });
};
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
      :height="600"
      :loading="loading"
      :loading-config="loadingConfig"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      @current-change="onCurrentChange"
    >
      <template #operation="row">
        <el-button
          type="primary"
          @click="
            isEdit = true;
            editClick(row);
          "
          >编辑</el-button
        >
        <el-button type="danger" @click="del(row)">删除</el-button>
      </template>
    </pure-table>
    <div class="w-3/5 flex">
      <el-button
        type="primary"
        size="large"
        style="flex-basis: 100%; font-size: 20px"
        @click="
          isEdit = false;
          editClick({ row: {} });
        "
        >新增问答数据</el-button
      >
    </div>
    <el-dialog
      v-model="editWindow"
      :title="isEdit ? '编辑问答对' : '添加问答对'"
      width="500"
    >
      <el-form :model="formItem">
        <el-form-item label="问题">
          <el-input
            v-model="formItem.q"
            type="textarea"
            autocomplete="off"
            autosize
          />
        </el-form-item>
        <el-form-item label="回答">
          <el-input
            v-model="formItem.a"
            type="textarea"
            autocomplete="off"
            autosize
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editWindow = false">取消</el-button>
          <el-button
            type="primary"
            @click="isEdit ? editConfirm() : addConfirm()"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="delWindow" title="删除问答对" width="300">
      <span>确认删除该问答对吗？</span>
      <template #footer>
        <el-button @click="delWindow = false">取 消</el-button>
        <el-button type="danger" @click="delConfirm"> 确 定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
