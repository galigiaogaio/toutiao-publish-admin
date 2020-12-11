<template>
  <div id="article-container">
    <!-- 顶部用一个卡片把面包屑和数据筛选表单包裹 起来，更美观 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="small">
        <el-form-item label="状态">
          <!-- 1. 先把el-radio-group中的v-model值改为我们自己设置的动态保存值得status 
                  这样每当我们点击这6个不同的按钮，就会将它们六个对应的值传到status里         
           -->
          <!-- 2. el-radio默认是把label作为文本和选中之后的value值 -->

          <!-- 3. 注意label前要加:,这样绑定的才是值，不然绑定的就是字符串，就没办法获取了
              <el-radio :label="null">全部</el-radio> 
              -->

          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- 注意这里面的内容，要自己遍历，它不是表格，表格就不需要我们遍历 -->
          <!-- v-model="channelId"当我们点击某一个内容选项，就会把它value里的id同步到channelId -->
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channelData"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button按钮的click事件有个默认参数，当我们没有指定参数时，
          它会默认传递一个没用的数据，所以我们要记得传一个参数，不然会报错 -->
          <el-button :disabled="loading" type="primary" @click="loadArticles(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 中间用卡片包裹表格 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{ totalCount }} 条结果：
      </div>
      <!-- 底部数据列表-基础表格 -->
      <!--
         Table表格如何用
         1.需要把展示的数组列表数据绑定给table组件的data属性
         注意：我们不需要去v-for遍历，组件内部自己会遍历
         2.设计表格列el-table-column（即看一个表格需要分几列展示，就放几个el-table-column）。
           width 可以设置表格列的宽度
           label可以设置列的标题
           prop 用来设定要渲染的列表项数据字段。默认只能展示文本
         3.表格列默认只能渲染普通文本，如果需要展示其他内容，例如放图片，按钮等，就要选择自定义列模板
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        class="list-table"
        v-loading="loading"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <!-- 当接口数据images里没有图片时，就放这个图 -->
            <!-- v-if v-else这个代码对打包来讲，都是有效的，因为无论如何，都要把代码渲染出来
               当images里有图片就渲染它，没有就渲染v-else里的本地图片
             -->
            <!-- 这是用的element组件的images -->
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.cover.images[0]"
              fit="fit"
            ></el-image>

            <!-- 这是我们自己手动写的 -->
            <!--   <img
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              class="article-img"
              alt=""
            />
            <img v-else class="article-img" src="./no_img.gif" alt="" /> -->

            <!-- 引入图片错误写法！！！下面这种情况是在运行期间动态处理的。
                 而本地图片必须在打包的时候就存在-->
            <!-- <img
              class="article-img"
              :src="scope.row.cover.images[0] || 'no_img.gif'"
              alt=""
            /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <!-- 当我们自定义列模板用户，prop就无效了 -->
          <!-- 但如果我们想要在自定义模板中获取当前遍历项数据，
               那么就要在template上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <!-- 这种写法太麻烦，可以优化 -->
            <!--  
            <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.status === 3"
              >审核失败</el-tag
            >
            <el-tag type="info" v-else-if="scope.row.status === 4"
              >已删除</el-tag> 
            -->
            <!-- scope.row 意思是拿到当前行对象 -->
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <!-- 自定义操作这一列。自定义的内容必须放到template里面 -->
          <!-- 想要在自定义模板中获取当前遍历项数据，那么就要在template上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <!-- 编辑按钮，加一个事件，这样点击编辑的时候，就会跳到文章发布页面 -->
            <!--@click="$router.push('/publish?id='+scope.row.id)" 可以把当前页面的id通过url传到文章发布页面，
            在publish页面就可以拿到这个id，就可以请求加载这个id对应的数据，渲染到该页面变成编辑状态
                任何数据和字符串拼接，都会自动的去toString()。。
                所以这里就不需要手动的去toString(),但写上更安全一些 -->
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              type="primary"
              @click="$router.push('/publish?id='+scope.row.id)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页-Pagination 分页 -->
      <!-- :total="1000"用来控制页面的数据总条数，它默认是按照10条每页计算总页码
           假设总共有11830条数据就会分成11830/10=1183（页）
           :page-size="pageSize"设置了这个属性，就会按该值动态计算页码
      -->
      <!-- 所以要把他的属性值换成服务器实际返回给我们多少数据 -->
      <!-- current-page获取当前的页码。。这个属性加了.sync就会随着页码的更新而更新 -->
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        background
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="onCurrentChange"
      >
        <!-- 将disabled的属性值和loading加载的值绑定在一起，这样就可以等加载完才能点击别的页码
         只有请求通过了，才会恢复这些按钮的点击
         -->
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import {
  getArticles,
  getArticleChannels,
  deleteArticle,
} from "@/api/article.js";
export default {
  name: "ArticleIndex",
  components: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      articles: [], //文章数据列表，把请求到的数据赋值给articles
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, //本身的索引值就是0
        { status: 1, text: "待审核", type: "info" }, //本身的索引值就是1
        { status: 2, text: "审核通过", type: "success" }, //本身的索引值就是2
        { status: 3, text: "审核失败", type: "warning" },
        { status: 4, text: "已删除", type: "danger" },
      ],
      totalCount: 0, //总数据条数
      pageSize: 10, //每一页数据条数
      status: null, //查询文章的状态，null或者不传参数就是指全部状态
      channelData: [], //文章频道列表
      channelId: null, //查询文章的频道  axios不会发生数据为null，undefined之类的数据！！！
      rangeDate: null, //筛选范围日期
      loading: true, //表格数据加载中loading  在请求结束以后关闭loading
      page: 1,
    };
  },
  computed: {},
  watch: {},
  created() {
    // 传入参数1，这样在第一次进入该页面时，默认请求的数据是第一页
    this.loadArticles(1);
    this.loadChannels();
  },
  mounted() {},
  methods: {
    loadArticles(page = 1) {
      // 每当有请求的时候，都要开启loading加载
      this.loading = false;

      //这样当created里调用这个函数没传参数时，默认还是会请求第一页数据
      getArticles({
        //这个函数是api里article里封装的函数。。{}里为它的请求参数
        // 不写，发请求时，默认是请求第一页，总共10条的数据
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId, //channel_id这个是根据接口文档，后端要求的名字，而且这属于对象的名字，
        // 是不受代码规范的控制的，所以是不会报错的
        /*  
       这种日期格式写法，会有一个报错： "TypeError: Cannot read property '0' of null"
       错误原因：当我们清空选中的日期格式，就会把rangeDate这个属性的所有日期数据清空，变成rangeDate:null
       begin_pubdate: this.rangeDate[0], //开始日期
        end_pubdate: this.rangeDate[1], //截止日期
      */
        //  this.rangeDate如果它有效，就会把下标0或者1拿过来，如果没效，就是个null
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null, //截止日期
      }).then((res) => {
        // console.log(res);
        // 解构语法
        // total_count:totalCount 左边total_count是获取的真正数据名称，totalCount是我们重新命名的数据名称。。
        // 由于不能使用_号，所以要重命名
        const { results, total_count: totalCount } = res.data.data;
        // this.articles = res.data.data.results;
        this.articles = results;
        this.totalCount = totalCount;
        this.loading = false;
      });
    },
    onCurrentChange(page) {
      // console.log(page); //当点击底部某一页，就会打印该页码的数字
      // 调用loadArticles函数，并把页面传给他
      // 删除成功，更新当前页的文章数据列表
      this.loadArticles(this.page);
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        // console.log(res);
        this.channelData = res.data.data.channels;
      });
    },
    // 点击删除按钮事件
    onDeleteArticle(articleId) {
      // console.log("1");
      this.$confirm("确认删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log("2");
          // deleteArticle(传要删除的文字id)
          deleteArticle(articleId.toString()).then((res) => {
            // console.log(res);
            // this.loadArticles(页码)
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // 找到数据接口
      // 封装请求调用
      // 删除请求响应
      // 处理响应结果
    },
  },
};
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-img {
  width: 60px;
}
</style>