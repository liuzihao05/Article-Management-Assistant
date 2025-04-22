import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'

/**
 * 定义用户状态管理 Store
 * @param id 'big-user' - Store 的唯一标识符（建议与功能相关，便于调试和管理）
 * @param setup函数 - 返回包含状态、方法的对象（组合式 API 风格）
 * @param persist配置 - 持久化存储配置（使用 pinia-plugin-persistedstate 插件）
 */
export const useUserStore = defineStore(
  'big-user', // Store 的唯一 ID（必填，用于缓存和 devtools 标识）
  () => {
    // -------------------------- 响应式状态 --------------------------
    // 用户认证令牌（JWT Token），用于接口请求认证
    // 初始值为空字符串，表示未登录状态
    // 用户信息对象（包含用户名、头像、权限等）
    // 初始值为空对象，获取用户信息后赋值
    const token = ref('')
    const user = ref({})

    // -------------------------- 状态修改方法 --------------------------
    /**
     * 设置用户 Token
     * @param newToken - 新的 Token 值（通常在登录成功后调用）
     * 作用：更新本地 Token 状态，并触发视图响应式更新
     */

    /**
     * 清除用户 Token（登出时调用）
     * 作用：重置 Token 为初始状态，强制用户重新登录
     */
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    /**
     * 异步获取用户详细信息（通常在登录后或页面加载时调用）
     * 流程：
     * 1. 调用 API 服务获取用户数据
     * 2. 将返回的用户数据赋值给 user 状态
     * 注意：需确保 API 响应格式与预期一致（假设 res.data.data 是用户信息对象）
     */
    const getUser = async () => {
      const res = await userGetInfoService() // 调用获取用户信息的 API

      user.value = res.data.data // 将 API 响应中的用户数据赋值给响应式状态
    }

    /**
     * 直接设置用户信息（可选，用于本地数据初始化或测试）
     * @param obj - 包含用户信息的对象
     * 作用：跳过 API 调用，直接更新用户状态（如从缓存恢复数据）
     */
    const setUser = (obj) => {
      user.value = obj
    }

    // -------------------------- 返回公共接口 --------------------------
    // 将状态和方法暴露为 Store 的公共接口
    // 组件中可通过 store.token 访问状态，store.setToken() 调用方法
    return {
      token, // 用户认证令牌（只读，修改需通过 setToken/removeToken）
      setToken, // 设置 Token 的方法
      removeToken, // 清除 Token 的方法
      user, // 用户信息对象（只读，修改需通过 getUser/setUser）
      getUser, // 获取用户信息的异步方法
      setUser // 直接设置用户信息的方法
    }
  },
  {
    // -------------------------- 持久化配置 --------------------------
    // 使用 pinia-plugin-persistedstate 插件实现状态持久化
    // 配置文档：https://prazdevs.github.io/pinia-plugin-persistedstate/
    persist: true // 启用持久化存储
  }
)
