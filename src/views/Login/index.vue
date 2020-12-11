<template>
  <!-- 
  每个el-form 表单组件都必须使用 el-form-item组件包裹
   -->
  <div class="login-container">
    <div class="login-head">
      <div class="logo"></div>
    </div>
    <!-- 
      配置form表单验证：
      1，必须给 el-form组件绑定model为表单数据对象
      2，给需要验证的表单项 el-form-item绑定prop属性
         注意：prop属性需要制定表单对象中的数据名称
      3，通过el-form组件的rules属性配置验证规则

      手动触发表单验证：
      1，给el-form设置ref。ref的值，随便取，只要不重复
      2，通过ref获取el-form组件，调用组件的validate进行验证     


                
                                                        
     -->
    <el-form
      class="login-form"
      :rules="formRules"
      ref="login-form"
      :model="user"
      size="mini"
    >
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <!--这个位置的同意协议：去element官网找form中的自定义校验规则 -->
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item size="large">
        <el-button
          class="login-btn"
          type="primary"
          @click="onLogin"
          :loading="LoginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { login } from "@/api/user"; //按需加载
export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "13911111111",
        code: "246810",
        agree: false, //是否同意协议
      },
      //checked: false, //是否同意登录协议选中状态
      LoginLoading: false, //登录的loading状态。默认false
      formRules: {
        mobile: [
          //required: true表示必填项，不能为空。 message就是提示消息
          //trigger：触发验证的机制，blur就是失去焦点时触发验证 change是改变的时候触发，会动态的验证
          { required: true, message: "请输入手机号码", trigger: "change" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的号码格式",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "change" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确的验证码格式",
            trigger: "blur",
          },
        ],
        agree: [
          {
            //自定义校验规则。这个位置的同意协议：去element官网找form中的自定义校验规则
            //如果验证通过：callback()
            //验证失败：callback(new Error('错误消息))
            // element在触发验证的时候，会自己内部调用validator这个函数，不是我们调用
            // 我们只需要提供校验函数处理逻辑就可以了
            // 函数的三个参数名，可以随便取：如a,b,c。element在调用的时候回自己传参数进来
            validator: (rule, value, callback) => {
              // console.log(rule, value);
              //value就是勾选用户协议这个框的值,当勾选了value就是true，没勾选就是false
              if (value) {
                //验证通过调用callback，不用传参数
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    onLogin() {
      //获取表单数据(根据接口要求绑定数据)
      // const user = this.user;
      //表单验证 validate是异步的
      this.$refs["login-form"].validate((valid, err) => {
        /* console.log(valid);
        console.log(err); */
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return;
        }
        //验证通过，提交登录
        this.login();
      });
    },
    /* 
    对于代码中的请求操作
    1，接口请求可能需要重用
    2，实际工作中，接口非常容易变动，修改起来麻烦
    建议：把所有的请求都封装成函数，然后统一的组织到模块中进行管理。即api文件夹
    好处：管理维护方便，也好重用
    
    */
    login() {
      // 开启登录中的loading。。开启了就要关闭，即在成功失败响应处关闭
      this.LoginLoading = true;

      /*函数在api里的user.js文件做了一层封装
       request({
        method: "POST",
        url: "/mp/v1_0/authorizations",
        // data用来设置POST请求体
        data: this.user,
      }) */

      login(this.user)
        .then((res) => {
          this.$message({
            message: "登录成功",
            type: "success",
          });
          //关闭loading  注意写的位置。不要写在成功回调函数里面！！！
          this.LoginLoading = false;
          // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
          //  window.localStorage.setItem(存储的数据名，存储的值)
          // 本地存储只能存字符串。如果需要存对象数组类型的数据，则要把他们转为json格式字符串进行存储
          // window.localStorage.setItem("user", res.data.data);  res.data.data这是一个对象
          window.localStorage.setItem("user", JSON.stringify(res.data.data));
          //跳转到首页
          //方式一： this.$router.push('/')
          //方式二：这个方式更有语义化
          this.$router.push({
            name: "home",
          });
        })
        .catch((err) => {
          this.$message.error("登录失败，手机号或验证码错误");
          this.LoginLoading = false;
        });
      //处理后端响应结果：成功：xxx , 失败 ：xxx
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  background: url("./login-bg.jpg") no-repeat;
  background-size: cover;
  .login-head {
    box-sizing: border-box;
    width: 400px;
    height: 77px;
    // margin-bottom: 30px;
    background-color: #fff;
    padding-left: 50px;
    .logo {
      width: 300px;
      margin: 0 auto;
      background: url("./toutiao2.png") no-repeat;
      margin-top: 20px;
      height: 57px;
    }
  }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
      background-color: red;
    }
  }
}
</style>











