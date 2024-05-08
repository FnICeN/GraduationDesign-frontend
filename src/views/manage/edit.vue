<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllProducts } from "@/api/getInfo";
import { addProduct, updateProduct, deleteProduct } from "@/api/products";
import { message } from "@/utils/message";
defineOptions({
  name: "Edit"
});

const loading = ref(false);
const tableData = ref([]);
const delWindow = ref(false);
const editWindow = ref(false);
const isEdit = ref(false);
const selectedItem = ref(null);
const formItem = ref({
  productid: null,
  productname: "",
  price: null
});

const refresh = async () => {
  loading.value = true;
  let productsRes = await getAllProducts();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
};

onMounted(async () => {
  loading.value = true;
  let productsRes = await getAllProducts();
  if (productsRes.success) {
    tableData.value = productsRes.data;
    loading.value = false;
  } else {
    message("数据获取失败", { type: "error" });
  }
});

const editClick = row => {
  if (!isEdit.value) {
    console.log("not edit");
    formItem.value.productid = null;
    formItem.value.productname = "";
    formItem.value.price = null;
    editWindow.value = true;
    return;
  }
  selectedItem.value = row;
  formItem.value.productid = row.productid;
  formItem.value.productname = row.productname;
  formItem.value.price = row.price;
  editWindow.value = true;
  console.log("edit", selectedItem.value);
};

const editConfirm = async () => {
  console.log(formItem.value);
  let res = await updateProduct({
    productid: selectedItem.value.productid,
    productname: formItem.value.productname,
    price: formItem.value.price
  });
  if (res) {
    message("修改成功", { type: "success" });
    editWindow.value = false;
    refresh();
    return;
  }
  message("修改失败", { type: "error" });
};

const addConfirm = async () => {
  console.log("addConfirm", formItem.value);
  let res = await addProduct({
    productname: formItem.value.productname,
    price: formItem.value.price
  });
  if (res) {
    message("添加成功", { type: "success" });
    editWindow.value = false;
    refresh();
    return;
  }
  message("添加失败", { type: "error" });
};

const delConfirm = async () => {
  console.log("delConfirm", selectedItem.value);
  let res = await deleteProduct({ productid: selectedItem.value.productid });
  if (res) {
    message("下架成功", { type: "success" });
    delWindow.value = false;
    refresh();
    return;
  }
  message("下架失败", { type: "error" });
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
                <span>商品列表</span>
              </div>
              <div class="text-center">
                <el-button
                  type="primary"
                  @click="
                    isEdit = false;
                    editClick({ row: null });
                  "
                >
                  上架新商品</el-button
                >
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
              fixed
              prop="productid"
              label="物品号"
              width="150"
            />
            <el-table-column prop="productname" label="商品名" width="200" />
            <el-table-column prop="price" label="价格" width="150" />
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
                  @click="
                    isEdit = true;
                    editClick(scope.row);
                  "
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  @click="
                    delWindow = true;
                    selectedItem = scope.row;
                  "
                  >下架</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div>
      <!-- <el-dialog v-model="confirmWindow" title="商品购买" width="300">
        <span>是否确认购买该商品？</span>
        <template #footer>
          <el-button @click="confirmWindow = false">取 消</el-button>
          <el-button type="primary" @click="buyProductAct">确 定</el-button>
        </template>
      </el-dialog> -->
      <el-dialog
        v-model="editWindow"
        :title="isEdit ? '编辑商品信息' : '添加商品'"
        width="500"
      >
        <el-form :model="formItem">
          <el-form-item label="品名">
            <el-input v-model="formItem.productname" autocomplete="off" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input
              v-model="formItem.price"
              autocomplete="off"
              type="number"
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
      <el-dialog v-model="delWindow" title="下架商品" width="300">
        <span>确认下架该商品吗？</span>
        <template #footer>
          <el-button @click="delWindow = false">取 消</el-button>
          <el-button type="danger" @click="delConfirm"> 确 定 </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
