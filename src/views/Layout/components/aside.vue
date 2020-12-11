<template>
  <div id="">
    <!-- el-menu-item的index不能重复，要确保唯一 -->
    <!-- 在el-menu标签里加一个router，可以实现路由跳转，跳转的路径是index的值。                                               
         这样就可以让侧边导航栏和路由直接对应起来 
    -->
    <!-- active-text-color指激活的文字颜色 -->
    <el-menu
      class="nav-menu"
      default-active="2"
      background-color="#002033"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse"
    >
      <el-menu-item index="/">
        <!-- 使用阿里矢量字体图标 -->
        <i class="iconfont iconyemian-copy-copy"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="iconfont iconcontent"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="iconfont iconimage"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="iconfont iconpublish"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="iconfont iconmessage"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="fans">
        <i class="iconfont iconfans"></i>
        <span slot="title">粉丝管理</span> </el-menu-item
      ><el-menu-item index="settings">
        <i class="iconfont iconsetting"></i>
        <span slot="title">个人管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "LeftAside",
  components: {},
  props: ["is-collapse"], //子组件接收父组件控制折叠的值
  data() {
    return {
      // 左侧菜单栏是否折叠
      // isCollapse: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.nav-menu {
  height: 100%;
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
</style>