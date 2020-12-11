import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginIndex from '@/views/Login/'
import HomeIndex from '@/views/Home/'
import LayoutIndex from '@/views/Layout/'
import ArticleIndex from '@/views/Article/'
import PublishIndex from '@/views/Publish/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',   //给路由取个名字
    component: LoginIndex
  },
  {
    path: '/',
    // name: 'layout',
    component: LayoutIndex,
    children: [
      {
        path: '',  //path为空，会作为默认子路由渲染
        //当访问/ 即父路由时，path为空的这个子路由就会渲染到子路由的出口里边
        name: 'home',   //给路由取个名字
        component: HomeIndex
      },
      {
        path: '/article',
        name: 'article',
        component: ArticleIndex
      },
      {
        path: '/publish',
        name: 'publish',
        component: PublishIndex
      }

    ]
  }

]
const router = new VueRouter({
  routes
})
// to：要去的路由信息
// from:来自哪的路由信息
//next:放行方法  调用这个next()就表示允许通过，要不然就会拦阻不让过
/* router.beforeEach((to, from, next) => {
  // 逻辑
  // 如果要访问的页面不是login登录页面，则要验证登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了,就可以随便访问页面
  // 允许通过

  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    //  不是登录login页面
    // 如何判断是否已经登录，就是本地存储的user，没有登录就不会有user
    if (user) {
      // 如果user存在，就放行
      next()
    } else {
      // 不存在，就让他跳转到登录页面
      next('/login')
    }
  } else {
    // else就表示登录页面
    next()
  }
})

 */
export default router
