<template>
  <div class="spread-landing-page">
    <div class="content text-ct">
      <div class="banner pos-rel">
        <div v-if="!isLogin" class="btn-area">
          <div class="register-btn btn mr-20" @click="toRegister">注册商家账号</div>
          <div class="advisory-btn btn ml-20" @click="toRegister">马上咨询</div>
        </div>
        <div v-if="isLogin" class="btn-area">
          <a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDAxOTQwNF80ODQ2MjlfODAwMDE5NDA0XzJf" target="_blank" class="advisory-btn btn ml-20">马上咨询</a>
        </div>
      </div>
      <img src="~assets/img/spread-landing-page/choose-bainan.png" alt="" class="mt-40">
      <div class="bainana-niubility">
        <img src="~assets/img/spread-landing-page/bainana-niubility_03.png" alt="" class="mt-40">
      </div>
      <img src="~assets/img/spread-landing-page/the-problem.png" alt="" class="mt-40">
      <img src="~assets/img/spread-landing-page/bainana-data.png" alt="" class="mt-40">
      <div class="cursor-p" @click="toReleaseActivity">
        <img src="~assets/img/spread-landing-page/experience.png" alt="" class="mt-40">
      </div>
      <img src="~assets/img/spread-landing-page/platform-compare.png" alt="" class="mt-40">
      <div class="success-case"></div>
      <img src="~assets/img/spread-landing-page/progress-explain.png" alt="" class="mt-40">
      <div class="merchant-backstage"></div>
      <div class="diagnosis">
        <a v-if="isLogin" class="diagnosis-btn cursor-p text-ct" href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDAxOTQwNF80ODQ2MjlfODAwMDE5NDA0XzJf" target="_blank" ></a>
        <a v-else class="diagnosis-btn cursor-p text-ct" @click="toRegister"></a>
      </div>
      <div v-if="showQuickRegister" class="quick-register">
        <div class="center">
          <img src="~assets/img/spread-landing-page/help-superman.png" alt="" class="superman">
          <img src="~assets/img/spread-landing-page/help-text.png" alt="" class="help-text">
          <div class="edit-box clear">
            <div class="edit-input-box clear">
              <span class="edit-tip">手机号：</span>
              <input class="edit-input" type="number" v-model="formCustom.phone">
              <!--<span class="send-verifed-code">发送验证码</span>-->
            </div>
            <div class="edit-input-box clear">
              <span class="edit-tip">用户密码：</span>
              <input class="edit-input" type="password" v-model="formCustom.pwd">
            </div>
            <div class="edit-input-box clear">
              <span class="edit-tip">确认密码：</span>
              <input class="edit-input" type="password" v-model="formCustom.repwd">
            </div>
            <div class="edit-input-box clear">
              <span class="edit-tip">QQ：</span>
              <input class="edit-input" type="number" v-model="formCustom.qqNumber">
            </div>
            <div class="edit-input-box clear">
              <span class="edit-tip">图形验证码：</span>
              <input class="edit-input" type="number" v-model="formCustom.validateCode">
              <img class="vrcode-image" :src="regImgSrc" width="100" alt="图形验证码" @click="getRegVrcode">
            </div>
            <div class="edit-input-box clear">
              <span class="edit-tip">短信验证码：</span>
              <input class="edit-input" type="number" v-model="formCustom.smsCode">
              <sms-countdown style="top:3px;" :on-success="sendCodeSuccess"
                             :phone="formCustom.phone"
                             :purpose="formCustom.purpose"
                             :validateCode="formCustom.validateCode">
              </sms-countdown>
            </div>
            <div class="edit-input-box clear submit-btn" @click="register">
              立即注册
            </div>
          </div>
          <div class="close-btn" @click="showQuickRegister = false">
            <img src="~assets/img/spread-landing-page/guanbaniu.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/config/apiConfig'
  import SmsCountdown from '@/components/SmsCountdown'
  import {isInteger, setStorage} from '@/config/utils'
  export default {
    name: "spread-landing-page",
    components: {
      SmsCountdown: SmsCountdown
    },
    data() {
      return {
        showQuickRegister: true,
        regImgSrc: null,
        formCustom: {
          phone: null,
          pwd: null,
          repwd: null,
          qqNumber: null,
          smsCode: null,
          role: 1,
          purpose: 'reg',
          platForm: 'PC',
          validateCode: null,
          // agreeStrip: true,
        },
      }
    },
    computed: {
      isLogin() {
        return this.$store.state.login
      },
      getUserRole() {
        return this.$store.getters.getUserRole
      },
    },
    created() {
      this.getRegVrcode();
      if (this.isLogin) {
        this.showQuickRegister = false;
      }
    },
    methods: {
      toRegister() {
        this.$router.push({path: '/register/seller-register',query:{from:'spreadLandingPage'}});
      },
      toReleaseActivity() {
        this.$router.push({name: 'TaskRelease'});
      },
      getRegVrcode() {
        this.regImgSrc = "/api/vrcode.json?rand=" + new Date() / 100;
        this.formCustom.validateCode = null;
      },
      sendCodeSuccess(res) {
        const self = this;
        if (res.status) {
          self.$Message.success({
            content: "短信验证码发送成功！",
            duration: 1,
          });
        } else {
          self.$Message.error(res.msg);
          self.getRegVrcode();
        }
      },
      // 注册
      register() {
        const _this = this;
        if (!(/^1\d{10}$/.test(_this.formCustom.phone))) {
          _this.$Message.info({content:'请输入正确的手机号！'});
          return
        }
        if (!_this.formCustom.pwd) {
          _this.$Message.info({content:'请输入密码！'});
          return
        }
        if (!_this.formCustom.repwd) {
          _this.$Message.info({content:'请确认密码！'});
          return
        }
        if (_this.formCustom.repwd !== _this.formCustom.pwd) {
          _this.$Message.info({content:'两次输入的密码不一致！'});
          return
        }
        if (!_this.formCustom.qqNumber) {
          _this.$Message.info({content:'请输入QQ号'});
          return
        }
        if (!isInteger(_this.formCustom.qqNumber) || _this.formCustom.qqNumber.length > 10) {
          _this.$Message.info({content:'请输入正确格式的QQ号'});
          return
        }
        if (!_this.formCustom.validateCode) {
          _this.$Message.info({content:'请输入图形验证码！'});
          return
        }
        if (!_this.formCustom.smsCode) {
          _this.$Message.info({content:'请输入短信验证码！'});
          return
        }

        api.register(_this.formCustom).then(res => {
          if (res.status) {
            _this.$Message.success({
              content: "注册成功",
              duration: 1,
              onClose: () => {
                _this.setUserInfo(_this.formCustom.phone, _this.formCustom.pwd, _this.formCustom.role);
              }
            });
          } else {
            self.$Message.error(res.msg);
          }
        })
      },
      // 注册成功后的登录
      setUserInfo(phone, pwd) {
        const self = this;
        api.login({
          phone: phone,
          passWord: pwd,
          platForm: 'PC'
        }).then((res) => {
          if (res.status) {
            self.$store.commit({
              type: 'RECORD_USER_INFO',
              info: res.data,
              token: res.token
            });
            if (res.data.role === 1) {
              self.$router.push({name: 'Home'});
            } else {
              self.$router.push({name: 'WwBind'});
            }
          } else {
            self.$Message.error(res.msg);
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "src/css/mixin";
  .content {
    input {
      border:none;
      outline: none;
    }
    .banner {
      background: url("~assets/img/spread-landing-page/banner.png") no-repeat center center;
      background-size: 100% 100%;
      min-width: 1200px;
      height:500px;
      overflow: hidden;
      .btn-area {
        margin-top: 370px;
        text-align: center;
      }
      .btn {
        display: inline-block;
        width: 196px;
        height: 62px;
        line-height: 62px;
        text-align: center;
        color: #fff;
        font-size: 24px;
        margin-right: 47px;
        border-radius: 5px;
        cursor: pointer;
      }
      .register-btn {
        background: #fda712;
        border:2px solid #fda712;
        &:hover {
          background: #fdcf12;
        }
      }
      .advisory-btn {
        border: 2px solid #eee;
        &:hover {
          color:#fda712;
          border-color:#fda712;
        }
      }
    }
    .success-case {
      min-width: 1200px;
      height:820px;
      background: url("~assets/img/spread-landing-page/success-case.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .merchant-backstage {
      min-width: 1200px;
      height:740px;
      background: url("~assets/img/spread-landing-page/merchant-backstage.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .diagnosis {
      min-width: 1200px;
      height:360px;
      background: url("~assets/img/spread-landing-page/diagnosis.png") no-repeat center center;
      background-size: 100% 100%;
      overflow: hidden;
      margin-bottom: 100px;
      .diagnosis-btn {
        width: 310px;
        height:60px;
        background: url("~assets/img/spread-landing-page/diagnosis-btn.png") no-repeat center center;
        background-size: 100% 100%;
        display: inline-block;
        margin-top: 205px;
      }
    }
    .quick-register {
      width: 100%;
      height: 250px;
      margin: 0 auto;
      background: rgba(56,53,58,0.85);
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2;
      .center {
        width: 1265px;
        height: 200px;
        margin: 0 auto;
        position: relative;
        .superman {
          width: 271px;
          margin-top: -78px;
          vertical-align: middle;
          display: block;
          float: left;
        }
        .help-text {
          width: 437px;
          height: 104px;
          display: block;
          float: left;
          font-size: 42px;
          line-height: 62px;
          color: #fff;
          text-align: center;
          letter-spacing: 2px;
          margin-left: -40px;
          margin-top: 40px;
        }
        .edit-box {
          float: right;
          width: 588px;
          height: 150px;
          margin-top: 28px;
          .edit-input-box {
            width: 274px;
            height: 38px;
            line-height: 38px;
            background: #fff;
            margin: 5px 9px;
            float: left;
            position: relative;
          }
          .edit-tip {
            height:38px;
            color:#b4b4b4;
            font-size: 16px;
            float: left;
            padding-left:20px;
            &::before {
              content: '*';
              color:$mainColor;
              margin-left: -8px;
              margin-right: 10px;
              font-size: 14px;
            }
          }
          .edit-input {
            float: left;
          }
          .vrcode-image {
            position: absolute;
            top:0;
            right:0;
          }
          .send-verifed-code {
            position: absolute;
            right: 0;
            top: 0;
            width: 100px;
            background-color: #DBDBDB;
            color: #666;
            height: 38px;
            font-size: 12px;
            margin: 0;
          }
          .submit-btn {
            background: #ffc41d;
            color: #ff3b2e;
            text-align: center;
            border: 1px solid #ffc41d;
            font-size: 16px;
            width:566px;
          }
        }
        .close-btn {
          position: absolute;
          right: -43px;
          top: 17px;
          width: 26px;
          height: 26px;
          cursor: pointer;
        }
      }
    }
  }
</style>
