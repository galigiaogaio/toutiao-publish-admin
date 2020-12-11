<template>
  <!-- layout是主路由，home是作为子路由渲染到router-view里 -->
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
      <!-- 侧边栏组件aside.vue文件 -->
      <left-aside class="asidemenu" :is-collapse="isCollapse"></left-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!-- <i class="el-icon-s-fold"></i> -->
          <!-- class样式处理
            {css类名：布尔值}  true：就采用该类名，false:不采用该类名。这两类名不会同时执行
           -->
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse,
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>文章发布管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar">
            <!-- 这里的昵称头像是写死的，应该根据不同登录的用户切换 -->
            <!--  <img class="avatar-pic" src="./touxiang.jpg" alt="" />
            <span>用户昵称</span> -->
            <img class="avatar-pic" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!--   <span>
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 需求：点击退出文件，就会退出系统 -->
            <!-- el-dropdown-item是一个组件，组件上的任何事件都会被当成自定义事件
            即组件默认是不识别原生事件的，除非内部做了处理
             -->
            <!-- 当我们在组件里，要监听某一个组件的原生事件时，监听不到时，可以给它加一个.native修饰符 -->
            <el-dropdown-item @click.native="onlogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 默认子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LeftAside from "./components/aside";
import { getUserProfile } from "@/api/user.js";
export default {
  name: "LayoutIndex",
  components: {
    LeftAside,
  },
  data() {
    return {
      // 当前用户登录信息
      user: {},
      isCollapse: false, //侧边菜单栏的展示状态。。由于按钮在父组件，效果在子组件。所以把这个值传给子组件
    };
  },
  computed: {},
  watch: {},
  created() {
    //组件初始化好，执行这个函数，请求获取用户资料
    this.loadUserProfile();
  },
  mounted() {},
  methods: {
    loadUserProfile() {
      //这个方法是api文件里封装的方法
      //除了登录接口，其他所有接口都需要授权才能请求使用
      //或者说，除了登录接口，其他接口都需要提供你的身份令牌(token)才能获取数据。只有身份验证通过才会给你数据
      getUserProfile().then((res) => {
        // console.log(res);
        this.user = res.data.data;
      });
    },
    onlogout() {
      this.$confirm("确认退出吗？", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 这里面是点击确认之后做的操作
          // 如何退出：1.把用户的登录状态清除
          window.localStorage.removeItem("user");
          //          2.跳转到登录页面
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.aside {
  background-color: #d3dce6;
  .asidemenu {
    height: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar {
    display: flex;
    align-items: center;
    .avatar-pic {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
}
.main {
  background-color: #e9eef3;
}
</style>