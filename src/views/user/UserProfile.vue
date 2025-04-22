<script setup>
// 导入自定义布局组件（用于页面整体结构）
import PageContainer from '@/components/PageContainer.vue'
// 导入 Vue 的响应式工具（用于创建引用和响应式数据）
import { ref } from 'vue'
// 导入用户状态管理 Store（获取用户信息和更新方法）
import { useUserStore } from '@/stores'
// 导入更新用户信息的 API 服务（与后端交互）
import { userUpdateInfoService } from '@/api/user'
// 导入 Element Plus 的消息提示组件（显示操作结果）

// -------------------------- 表单引用 --------------------------
// 创建表单引用，用于调用表单验证方法（el-form 的 ref）
const formRef = ref()

// -------------------------- 状态初始化 --------------------------
// 从用户 Store 中解构出用户信息（email, id, nickname, username）和 getUser 方法
// 注意：user 是 Store 中的响应式对象，解构后属性仍保持响应式
const {
  user: { email, id, nickname, username }, // 解构用户信息字段
  getUser // 用于更新用户信息的方法（调用后重新获取最新数据）
} = useUserStore()

// 初始化表单数据（基于用户当前信息）
// 表单模型包含用户 ID（用于标识修改对象）和可编辑字段（昵称、邮箱）
const form = ref({
  id, // 用户唯一标识（编辑时必填，来自 Store）
  username, // 登录用户名（不可编辑，来自 Store）
  nickname, // 用户昵称（可编辑，来自 Store 初始值）
  email // 用户邮箱（可编辑，来自 Store 初始值）
})

// -------------------------- 表单验证规则 --------------------------
// 定义表单字段的验证规则（符合 Element Plus 表单验证格式）
const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }, // 失去焦点时校验是否必填
    {
      pattern: /^\S{2,10}/, // 正则：2-10个非空字符（\S 匹配非空白字符）
      message: '昵称长度在2-10个非空字符',
      trigger: 'blur' // 失去焦点时校验格式
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' }, // 失去焦点时校验必填
    {
      type: 'email', // Element Plus 内置邮箱格式校验
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change'] // 失去焦点或值变化时校验
    }
  ]
})

// -------------------------- 表单提交逻辑 --------------------------
const submitForm = async () => {
  try {
    // 1. 触发表单验证（返回 Promise，验证通过则继续，否则抛出错误）
    await formRef.value.validate() // 等待校验结果，失败会触发 ElMessage 提示

    // 2. 调用 API 提交修改（携带表单数据）
    await userUpdateInfoService(form.value) // 传递包含 id、nickname、email 的对象

    // 3. 更新用户状态（重新获取最新用户信息，确保视图同步）
    getUser() // 调用 Store 中的方法，重新从后端获取用户数据

    // 4. 提示用户操作结果
    ElMessage.success('修改成功') // 显示绿色成功提示
  } catch (error) {
    // 校验失败或 API 调用失败时，错误会被 Element Plus 自动捕获并提示
    // 此处可添加额外的错误处理（如特定错误码处理）
    ElMessage.error('修改失败，请稍后重试', error) // 显示红色错误提示
  }
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
