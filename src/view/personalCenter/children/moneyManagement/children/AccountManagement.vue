<template>
  <div class="my-account">
    <div class="user-safe" v-show="myAccount.userSafe">
      <p class="fs-14">账户信息</p>
      <ul>
        <li>
          <ul>
            <li class="one">实名认证</li>
            <li class="two">
              {{geIifCertification(userList.ifCertification)}}
            </li>
            <li class="three">
              <router-link to="/user/personal-setting/verified" v-show="!userList.ifCertification">去认证
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <ul>
            <li class="one">绑定手机</li>
            <li class="two">
              {{userList.phone}}
            </li>
            <li class="three">
              <a href="javascript:;"></a>
            </li>
          </ul>
        </li>
        <li v-if="userRole === 0">
          <ul>
            <li class="one">
              提现账号
            </li>
            <li class="two">
              {{getIfBandingBankCard(userList.ifBandingBankCard)}}
            </li>
            <li class="three">
              <a v-show="userList.ifBandingBankCard === null" @click="bandCard">去绑定</a>
              <a v-show="userList.ifBandingBankCard !== null" @click="bandCard">去修改</a>
            </li>
          </ul>
        </li>
        <li>
          <ul>
            <li class="one">
              支付密码
            </li>
            <li class="two">
              <span v-if="!isEditPwdAlready">未设置(初始密码为888888，为了你的账号安全，建议您重置支付密码)</span>
              <span v-else>已设置(为了你的账户安全，建议定期修改密码)</span>

            </li>
            <li class="three">
              <a href="javascript:;" v-if="!isEditPwdAlready" @click="myAccountPwdChangeFather('modifyPwd')">重置支付密码</a>
              <a href="javascript:;" v-else @click="myAccountPwdChangeFather('modifyPwd')">忘记支付密码？</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="modify-pwd clear" v-show="myAccount.modifyPwd">
      <div class="modify-pwd-sel clear">
        <p>重置支付密码</p>
        <div v-show="myAccountSon.selBox" class="sel-box clear">
          <p class="left">请选择重置的方式：</p>
          <div class="left">
            <div>
              <div @click="myAccountPwdChangeSon('selDefaultModify')" class="sel-canal">
                <p>
                  我忘记支付密码了
                  <br>
                  <span style="color: #999">忘记密码或者密码被锁定了</span>
                </p>
                <i data-v-5aa11427="" class="ivu-icon ivu-icon-chevron-right"
                   style="vertical-align: middle;display: table-cell; font-size: 20px;"></i>
              </div>
              <div @click="myAccountPwdChangeSon('selPhoneModify')" class="sel-canal">
                <p>
                  我记得原来的密码
                </p>
                <i data-v-5aa11427="" class="ivu-icon ivu-icon-chevron-right"
                   style="vertical-align: middle;display: table-cell; font-size: 20px;"></i>
              </div>
              <iButton @click="myAccountPwdChangeFather('userSafe')">
                返回上一页
              </iButton>
            </div>
          </div>

        </div>
        <div v-show="myAccountSon.selPhoneModify" class="sel-default-modify mt-20">
          <iForm ref="defaultModifyCustom" :model="defaultModifyCustom" :rules="defaultModifyRuleCustom"
                 :label-width="400">
            <div class="clear form-input-box">
              <Form-item label="原始密码" class="left" style="width: 650px" prop="oldPwd">
                <iInput type="password" size="large" v-model="defaultModifyCustom.oldPwd"></iInput>
              </Form-item>
            </div>
            <div class="clear form-input-box">
              <Form-item label="新密码" class="left" style="width: 650px" prop="newPwd">
                <iInput type="password" size="large" v-model="defaultModifyCustom.newPwd"></iInput>
              </Form-item>
            </div>
            <div class="clear form-input-box">
              <Form-item label="确认密码" class="left" style="width: 650px" prop="repwd">
                <iInput type="password" size="large" v-model="defaultModifyCustom.repwd"></iInput>
              </Form-item>
            </div>
            <div>
              <Form-item>
                <iButton @click="handleSubmit('defaultModifyCustom',modifyDefaultPayPwdFunc)">
                  确定
                </iButton>
                <iButton @click="myAccountPwdChangeSon('selBox')">
                  返回上一页
                </iButton>
              </Form-item>
            </div>
          </iForm>
        </div>
        <div v-show="myAccountSon.selDefaultModify" class="sel-phone-modify mt-20">
          <iForm ref="payCustom" :model="payCustom" :rules="payRuleCustom" :label-width="400">
            <div class="clear form-input-box">
              <Form-item label="绑定手机" prop="phone" class="left" style="width: 650px">
                <input class="fs-14" type="text" v-model="payCustom.phone" style="border: none;" readonly>
              </Form-item>
            </div>
            <div class="clear form-input-box">
              <Form-item label="图形验证码" prop="validateCode" class="left" style="width: 550px">
                <iInput type="text" size="large" v-model="payCustom.validateCode"></iInput>
              </Form-item>
              <div style="width: 100px; float:left;">
                <img :src="imgSrc" width="100%" alt="" @click="getVrcode">
              </div>
            </div>
            <div class="clear form-input-box">
              <Form-item label="短信验证码" class="left pos-rel" style="width: 650px">
                <iInput type="text" number size="large" v-model="payCustom.smsCode"></iInput>
                <SmsCountdown :on-success="sendCodeSuccess" style="top: 3px;"
                              :phone="payCustom.phone"
                              :purpose="payCustom.purpose"
                              :validateCode="payCustom.validateCode"
                              :timeout=120
                >
                </SmsCountdown>
              </Form-item>
            </div>
            <div>
              <Form-item>
                <iButton @click="handleSubmit('payCustom',modifyPayPwdFunc)">
                  确定
                </iButton>
                <iButton @click="myAccountPwdChangeSon('selBox')">
                  返回上一页
                </iButton>
              </Form-item>
            </div>
          </iForm>
        </div>
        <div v-show="myAccountSon.modifyPwd" class="mt-20">
          <iForm ref="trendsModifyCustom" :model="trendsModifyCustom" :rules="trendsModifyRuleCustom"
                 :label-width="400">
            <div class="clear form-input-box">
              <Form-item label="新密码" prop="pwd" class="left" style="width: 650px">
                <iInput type="password" size="large" v-model="trendsModifyCustom.pwd"></iInput>
              </Form-item>
            </div>
            <div class="clear form-input-box">
              <Form-item label="确认新密码" class="left" style="width: 650px" prop="repwd">
                <iInput type="password" size="large" v-model="trendsModifyCustom.repwd"></iInput>
              </Form-item>
            </div>
            <div>
              <Form-item>
                <iButton @click="handleSubmit('payCustom',modifyFinishPayPwdFunc)">
                  确定
                </iButton>
              </Form-item>
            </div>
          </iForm>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import {Icon, Form, Button, Modal, Input} from 'iview'
  import api from '@/config/apiConfig'
  import SmsCountdown from '@/components/SmsCountdown'

  export default {
    name: 'AccountManagement',
    components: {
      iInput: Input,
      iForm: Form,
      FormItem: Form.Item,
      iButton: Button,
      ButtonGroup: Button.Group,
      Icon: Icon,
      Modal: Modal,
      SmsCountdown: SmsCountdown
    },
    data() {
      //表单验证
      const validatePhone = (rule, value, callback) => {
        if (!(/^1\d{10}$/.test(value))) {
          callback(new Error('请输入正确手机号'));
        } else {
          callback()
        }
      };

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback()
        }
      };
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入图片验证码'));
        } else {
          callback()
        }
      };
      const validateDefaultPassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.defaultModifyCustom.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.trendsModifyCustom.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validateSmsCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入动态码'));
        } else {
          callback()
        }
      };
      return {
        imgSrc: null,
        payCustom: {
          phone: this.$store.state.userInfo.phone,
          validateCode: '',
          purpose: 'forget',
          smsCode: '',
          role: 0,
        },
        payRuleCustom: {
          phone: [
            {validator: validatePhone, trigger: 'blur'},
          ],
          validateCode: [
            {validator: validateCode, trigger: 'blur'},
          ],
          smsCode: [
            {validator: validateSmsCode, trigger: 'blur'}
          ]

        },
        trendsModifyCustom: {
          pwd: '',
          repwd: ''
        },
        defaultModifyCustom: {
          oldPwd: '',
          newPwd: '',
          repwd: '',
        },
        defaultModifyRuleCustom: {
          oldPwd: [
            {validator: validatePass, trigger: 'blur'},
          ],
          newPwd: [
            {validator: validatePass, trigger: 'blur'},
          ],
          repwd: [
            {validator: validateDefaultPassCheck, trigger: 'blur'},
          ]
        },
        trendsModifyRuleCustom: {
          pwd: [
            {validator: validatePass, trigger: 'blur'},
          ],
          repwd: [
            {validator: validatePassCheck, trigger: 'blur'},
          ],
        },
        infoSelect: 'account',
        myAccount: {
          userSafe: true,
          modifyPwd: false,
        },
        myAccountSon: {
          selBox: true,
          selDefaultModify: false,
          selPhoneModify: false,
          modifyPwd: false,
        },
      }
    },
    mounted() {
    },
    created() {
      let type = this.$route.query.type;
      if (this.$route.query.infoSelect) {
        this.infoSelect = this.$route.query.infoSelect;
        this.myAccountPwdChangeFather('modifyPwd');
      }
      if (type && type === 'resetPwd') {
        this.myAccount.userSafe = false;
        this.myAccount.modifyPwd = true;
        this.myAccountSon.selBox = false;
        this.myAccountSon.selPhoneModify = true
      } else if (type && type === 'findPwd') {
        this.myAccount.userSafe = false;
        this.myAccount.modifyPwd = true;
        this.myAccountSon.selBox = false;
        this.myAccountSon.selDefaultModify = true
      }
      this.getVrcode();
    },
    computed: {
      isEditPwdAlready: function () {
        return this.$store.getters.getIsEditPwdAlready;
      },
      userList: function () {
        return this.$store.getters.getPersonalInfo;
      },
      bankCardNumber:function () {
        return this.$store.getters.getUserAccountInfo.bankCardNum
      },
      userRole() {
        return this.$store.getters.getUserRole
      }
    },
    methods: {
      bandCard() {
        this.$router.push({name: 'GetoutMoney', query: {bandCard: 'bandCard'}});
      },
      handleSubmit(name, callback) {
        let res = false;
        this.$refs[name].validate((valid) => {
          res = !!valid
        });
        if (typeof callback === 'function' && res) {
          callback();
        }
      },
      modifyDefaultPayPwdFunc() {
        let self = this;
        api.modifyDefaultPayPwd({
          oldPwd: self.defaultModifyCustom.oldPwd,
          newPwd: self.defaultModifyCustom.newPwd,
          repwd: self.defaultModifyCustom.repwd
        }).then((res) => {
          if (res.status) {
            self.$Message.success({
              content: res.msg,
              duration: 1,
              onClose: function () {
                self.$router.go(-1);
                self.$store.dispatch('getUserInformation');
              }
            });
          } else {
            self.$Message.error({
              content: res.msg,
              duration: 9
            });
          }
        })
      },
      modifyPayPwdFunc() {
        let self = this;
        api.validatePaySmscode({
          phone: self.payCustom.phone,
          smsCode: self.payCustom.smsCode,
        }).then((res) => {
          if (res.status) {
            self.myAccountPwdChangeSon('modifyPwd');
            self.$store.dispatch('getUserInformation');
          } else {
            self.$Message.error({
              content: res.msg,
              duration: 9
            });
            self.getVrcode();
          }
        });
      },
      modifyFinishPayPwdFunc() {
        let self = this;
        api.modifyPayPwd({
          phone: self.payCustom.phone,
          smsCode: self.payCustom.smsCode,
          pwd: self.trendsModifyCustom.pwd,
          repwd: self.trendsModifyCustom.repwd,
        }).then(res => {
          if (res.status) {
            self.$Message.success({
              content: res.msg,
              duration: 1,
              onClose: function () {
                self.$router.go(-1);
                self.$store.dispatch('getUserInformation');
              }
            });
          } else {
            self.$Message.error({
              content: res.msg,
              duration: 9
            });
          }
        })
      },
      checkPhone() {
        this.$refs.loginTrendsCustom.validateField('phone');
      },
      sendCodeSuccess(res) {
        let self = this;
        if (res.status) {
          self.$Message.success({
            top: 50,
            content: res.msg
          });
        } else {
          self.$Message.error({
            content: res.msg,
            duration: 9
          });
          self.getVrcode();
        }
      },
      accountInit(type) {
        this.infoSelect = type
      },

      getVrcode() {
        this.imgSrc = "/api/vrcode.json?rand=" + new Date() / 100
      },
      geIifCertification(type) {
        return type===false?'未认证':'已认证';
      },
      getIfBandingBankCard(type) {
        return type === null ? '未绑定' : this.bankCardNumber
      },

      myAccountPwdChangeFather(type) {
        for (let k in this.myAccount) {
          this.myAccount[k] = k === type;
        }
      },
      myAccountPwdChangeSon(type) {
        for (let k in this.myAccountSon) {
          this.myAccountSon[k] = k === type;
        }
      },
    }
  }
</script>


