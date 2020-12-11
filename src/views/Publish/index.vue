<template>
  <div id="publish-container">
    <el-card class="box-card">
       <div slot="header" class="clearfix">
         <!-- 面包屑路径导航 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
         </el-breadcrumb>
       </div>
       <!-- 表单区 -->
       <el-form ref="form" :model="article" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
         <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option 
            :label="channel.name" 
            :value="channel.id"
            v-for="(channel,index) in channels"
            :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <!-- button按钮的点击事件，默认是有一个参数的，当我们添加了点击事件没传参数，
               内部就会自动加一个参数。。就可能会报错 -->
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
       </el-form>
       
   </el-card>
  </div>
</template>
<script>
import { getArticleChannels , publishArticle, getArticle, updateArticle} from '@/api/article'
export default {
  name: "PublishIndex",
  components: {},
  data() {
    return {
        channels:[], //文章频道列表
        article:{
          title:'',
          content:'',
          cover:{
            type:0,  //封面类型 -1：自动，0：无图，1:1张图，3:3张图
            images:[]  //封面图片地址
          },
        channel_id:null
        },
    };
  },
computed:{},
watch:{},
created () {
  this.loadChannels()
  // 由于我们让发布和编辑使用的是同一个组件
  // 所以这里要判断，如果路由路径参数中有id，则请求展示文章内容
  if($route.query.id){
    this.loadArticle()
  }
},
mounted () {},
methods: {
  // 参数为draft=false意思是：当没传参数时，draft默认就是false,传了参数就是该参数的值
   onPublish(draft=false) {
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        //  publishArticle(this.article,draft) 第一个参数：文章的请求体。第二个参数：文章的状态

        // 如果是修改文章，则执行修改操作，否则执行添加操作
        // draft为true就是草稿，为false就是发表
        const articleId=this.$route.query.id
        if(articleId){
          // 执行修改操作
          updateArticle(articleId,this.article,draft).then(res=>{
            // console.log(res);
            this.$message({
              message:`${draft ? '存入草稿' : '发布'}成功`,
              type:'success'
            })
          })

        }else{
          publishArticle(this.article,draft).then(res=>{
        // 处理响应结果
          //  console.log(res);
           this.$message({
            message:`${draft ? '存入草稿' : '发布'}成功`,
            type:'success'
          })
          // 修改完之后就会跳到内容管理页面
          this.$router.push('/article')
        })
        }
        
      },
   loadChannels(){
     getArticleChannels().then(res=>{
       console.log(res);
      this.channels=res.data.data.channels
     })

     /*  getArticleChannels().then(({ data })=>{
       console.log(data);
      this.channels=data.data.channels
     })  */
   },
  //  修改文章：加载文章内容
   loadArticle(){
     getArticle(this.$route.query.id).then(res=>{
      //  console.log(res);
       this.article=res.data.data
     })
   }
}
};
</script>

<style lang="less" scoped>
</style>