<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllProducts } from "@/api/getInfo";
import { buyProduct } from "@/api/products";
import { message } from "@/utils/message";
defineOptions({
  name: "Buy"
});

const loading = ref(false);
const tableData = ref([]);
const confirmWindow = ref(false);
var prodid = 0;

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

const confirm = row => {
  confirmWindow.value = true;
  prodid = row.productid;
};

const buyProductAct = async () => {
  console.log({ productid: prodid });
  let buyRes = await buyProduct({ productid: prodid });
  if (buyRes.success) {
    message("购买成功", { type: "success" });
    confirmWindow.value = false;
    return;
  }
  message("购买失败", { type: "error" });
};
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="pt-5">
        <el-card>
          <template #header>
            <div class="text-2xl font-bold text-center">
              <span>商品列表</span>
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
                  size="default"
                  @click="confirm(scope.row)"
                >
                  购买
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div>
      <el-dialog v-model="confirmWindow" title="商品购买" width="300">
        <span>是否确认购买该商品？</span>
        <template #footer>
          <el-button @click="confirmWindow = false">取 消</el-button>
          <el-button type="primary" @click="buyProductAct">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
