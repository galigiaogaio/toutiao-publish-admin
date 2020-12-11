/* 项目启动入口 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载element组件库
import ElementUI from 'element-ui'
// 加载element组件库样式
import 'element-ui/lib/theme-chalk/index.css'
// 加载json-bigint
import JSONbig from 'json-bigint'
// 加载全局样式
import './styles/index.less'

// 全局注册element
Vue.use(ElementUI);

Vue.config.productionTip = false

/* 创建Vue 根实例 */
/* 把router配置到根实例中 */
// 通过render方法把APP根组件渲染到  #app入口节点（入口节点就是public里的index.html）中
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')














