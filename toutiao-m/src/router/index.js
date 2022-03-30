import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 配置路由
const routes = [
  // { path: '/',redirect:'/login' },//重载
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    // 将layout 组件配置到一级路由
    path: '/',
    name: 'tab-bar',
    component: () => import('@/views/layout'),

    // 配置子路由
    children: [
      {
        //默认子路由
        path: '',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },

  {
    path: '/search',// 搜索页面
    name: 'search',
    component: () => import('@/views/search')
  },

  {
    path: '/article/:articleId', // 文章详情页面
    name: 'article',
    component: () => import('@/views/article'),
    props: true //将路由动态参数映射到组件的 props 中，更推荐这种做法
  },
  {
    path: '/user/profile', // 个人信息
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
]

const router = new VueRouter({
  routes
})

export default router
