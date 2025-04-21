// 从 vue-router 库中导入 createRouter 和 createWebHistory 函数
// createRouter 用于创建路由实例，createWebHistory 用于创建 HTML5 History 模式的路由历史
import { createRouter, createWebHistory } from 'vue-router'
// 从 @/stores 目录导入 useUserStore 函数，该函数用于获取用户状态管理的存储实例
import { useUserStore } from '@/stores'

// createRouter 创建路由实例，===> new VueRouter()
// 1. history模式: createWebHistory()   http://xxx/user
// 2. hash模式: createWebHashHistory()  http://xxx/#/user

// vite 的配置 import.meta.env.BASE_URL 是路由的基准地址，默认是 ’/‘
// https://vitejs.dev/guide/build.html#public-base-path

// 如果将来你部署的域名路径是：http://xxx/my-path/user
// vite.config.ts  添加配置  base: my-path，路由这就会加上 my-path 前缀了
// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 #
// 2. hash模式：   createWebHashHistory 地址栏带 #
// console.log(import.meta.env.DEV)

// vite 中的环境变量 import.meta.env.BASE_URL  就是 vite.config.js 中的 base 配置项
// 创建路由实例，并传入配置对象
const router = createRouter({
  // 使用 createWebHistory 创建 HTML5 History 模式的路由历史，并传入基础路径
  history: createWebHistory(import.meta.env.BASE_URL),
  // 定义路由规则数组，每个规则是一个对象，包含路径和对应的组件
  routes: [
    // 定义登录页面的路由规则
    {
      // 路径为 /login
      path: '/login',
      // 使用动态导入的方式加载 @/views/login/LoginPage.vue 组件
      component: () => import('@/views/login/LoginPage.vue'),
    },
    // 定义根路径的路由规则
    {
      // 路径为 /
      path: '/',
      // 使用动态导入的方式加载 @/views/layout/LayoutContainer.vue 组件
      component: () => import('@/views/layout/LayoutContainer.vue'),
      // 当访问根路径时，自动重定向到 /article/manage 路径
      redirect: '/article/manage',
      // 定义嵌套路由，这些路由是 / 路径下的子路由
      children: [
        // 文章管理页面的路由规则
        {
          // 路径为 /article/manage
          path: '/article/manage',
          // 使用动态导入的方式加载 @/views/article/ArticleManage.vue 组件
          component: () => import('@/views/article/ArticleManage.vue'),
        },
        // 文章频道页面的路由规则
        {
          // 路径为 /article/channel
          path: '/article/channel',
          // 使用动态导入的方式加载 @/views/article/ArticleChannel.vue 组件
          component: () => import('@/views/article/ArticleChannel.vue'),
        },
        // 用户个人资料页面的路由规则
        {
          // 路径为 /user/profile
          path: '/user/profile',
          // 使用动态导入的方式加载 @/views/user/UserProfile.vue 组件
          component: () => import('@/views/user/UserProfile.vue'),
        },
        // 用户头像页面的路由规则
        {
          // 路径为 /user/avatar
          path: '/user/avatar',
          // 使用动态导入的方式加载 @/views/user/UserAvatar.vue 组件
          component: () => import('@/views/user/UserAvatar.vue'),
        },
        // 用户密码修改页面的路由规则
        {
          // 路径为 /user/password
          path: '/user/password',
          // 使用动态导入的方式加载 @/views/user/UserPassword.vue 组件
          component: () => import('@/views/user/UserPassword.vue'),
        },
      ],
    },
  ],
})

// 登录访问拦截 => 默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
//    '/login'   { name: 'login' }
// 全局前置守卫，在每次路由导航之前执行
router.beforeEach((to) => {
  // 调用 useUserStore 函数获取用户状态管理的存储实例
  const userStore = useUserStore()
  // 如果用户没有 token 且访问的不是登录页面
  if (!userStore.token && to.path !== '/login') {
    // 则将路由拦截到登录页面
    return '/login'
  }
  // 其他情况正常放行
  return undefined
})

// 导出路由实例，以便在 main.js 中引入并挂载到 Vue 应用中
export default router
