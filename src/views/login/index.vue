<script setup lang="ts">
import Motion from "./utils/motion";
import { md5 } from "js-md5";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { useNav } from "@/layout/hooks/useNav";
import { register } from "@/api/user";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const registerWindow = ref(false);

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title } = useNav();

const ruleForm = reactive({
  username: "userA",
  password: "111111"
});

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(md5(ruleForm.password));
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: md5(ruleForm.password)
        })
        .then(res => {
          console.log(res);
          if (res.success) {
            // 获取后端路由
            initRouter().then(() => {
              router.push(getTopMenu(true).path);
              message("登录成功", { type: "success" });
            });
          } else {
            message("登录失败", { type: "error" });
            registerWindow.value = true;
            loading.value = false;
          }
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

const registerAct = async () => {
  loading.value = true;
  let res = await register({
    username: ruleForm.username,
    password: md5(ruleForm.password)
  });
  if (res) {
    message("注册成功，请登录", { type: "success" });
    registerWindow.value = false;
    loading.value = false;
    return;
  }
  message("注册失败", { type: "error" });
  loading.value = false;
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" size="large">
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog v-model="registerWindow" title="账户注册" width="300">
      <span>该账户还未注册，是否直接注册？</span>
      <br />
      <span>账户昵称：{{ ruleForm.username }}</span>
      <br />
      <span>账户密码：{{ ruleForm.password }}</span>
      <template #footer>
        <el-button @click="registerWindow = false">取 消</el-button>
        <el-button type="primary" @click="registerAct">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
