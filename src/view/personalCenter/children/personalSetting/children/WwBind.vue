<template>
  <div class="ww-account-box">
    <div v-if="!showWwBindBox" class="ww-account-list">
      <a @click=addWwBindFunc>添加新旺旺号</a>
      <ul class="ww-account-title">
        <li>已绑定旺旺号</li>
        <li>绑定时间</li>
        <li>信用等级截图</li>
        <li>绑定状态</li>
        <li>操作</li>
      </ul>
      <div>
        <ul class="ww-account-ctt" v-for="(ww, index) in wwBindLists">
          <li>
            <p>{{ww.alitmAccount}}</p>
            <p v-if="ww.creditLevel"><img :src="aliLevelList[parseInt(ww.creditLevel) - 2]['text']" style="width: auto;height: auto;"></p>
            <p v-if="ww.tqz">淘气值：{{aliTqzList[parseInt(ww.tqz) - 1]['label']}}</p>
          </li>
          <li>{{ww.applyTime | dateFormat('YYYY-MM-DD hh:mm:ss')}}</li>
          <li><img :src="ww.wwCreditLevelPicUrl" alt="" style="width: 50px; padding: 10px;"></li>
          <li>
            <span v-show="ww.status === 1">审核中</span>
            <div v-if="ww.status === 2 ">
              <p>{{wwStatusTextOn}}</p>
              <i-switch
                v-model="switchTrue"
                @on-change="switchTypeTrue(ww.id)">
              </i-switch>
            </div>
            <div v-if="ww.status === 5 ">
              <p>{{wwStatusTextOff}}</p>
              <i-switch
                v-model="switchFalse"
                @on-change="switchTypeFalse(ww.id)">
              </i-switch>
            </div>
            <Tooltip v-show="ww.status === 3" :content="ww.remarks" placement="top" style="color: #ff6633;">
              <icon type="md-information-circle" color="#FF6633"/>
              <span>审核不通过(查看)</span>
            </Tooltip>
            <Tooltip v-show="ww.status === 4" :content="ww.freezeRemark ? ww.freezeRemark : '系统冻结'" placement="top" style="color: #ff6600;">
              <span class="cursor-p">冻结</span>
            </Tooltip>
          </li>
          <li>
            <!--<a v-show=" ww.status === 3 || (ww.status === 2 && !switchValueTrue && switchValueFalse)|| (!switchValueFalse && !switchValueTrue)"
              @click="modifyWwBindFunc(ww)" class="mr-10">修改</a>-->
            <!--<a  v-show="ww.status !== 4 && ww.infoFrom !=='r_g'&& ww.infoFrom !=='r_d'" @click="deleteWwBindFunc(ww)">解绑</a>-->
            <!--<a v-show="ww.status == 3 " @click="modifyWwBindFunc(ww,index)">重新提交</a>-->
            -----
          </li>
        </ul>
      </div>
    </div>
    <div class="ww-account-bind" v-if="showWwBindBox">
      <Alert v-show="remarks.text" type="warning" show-icon>
        审核不通过： {{remarks.text}},请重新提交（{{remarks.auditTime | dateFormat('YYYY-MM-DD hh:mm:ss')}}）
      </Alert>
      <div class="ww-account-form mt-20">
        <iForm ref="wwFormValidate" :model="wwFormValidate" :rules="wwFormRuleCustom" label-position="right"
               :label-width="150">
          <Form-item label="旺旺ID：" prop="alitmAccount">
            <i-input v-model="wwFormValidate.alitmAccount" :disabled="modifyWw"/>
          </Form-item>
          <Form-item label="性别：" prop="sex">
            <Radio-group v-model="wwFormValidate.sex">
              <Radio label="0">
                男
              </Radio>
              <Radio label="1">
                女
              </Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="是否开启蚂蚁花呗" prop="antPay">
            <Radio-group v-model="wwFormValidate.antPay">
              <Radio label="true">
                是
              </Radio>
              <Radio label="false">
                否
              </Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="生日" prop="birthday">
            <DatePicker type="date" placeholder="请选择生日" format="yyyy-MM-dd" @on-change="selectDate"></DatePicker>
          </Form-item>
          <Form-item label="旺旺号信用等级：" prop="alitmLevel">
            <i-select v-model="wwFormValidate.alitmLevel">
              <i-option v-for="item in aliLevelList" :label='item.label'
                       :value="item.value" :key="item.value">
                <img :src="item.text" alt="">
              </i-option>
            </i-select>
          </Form-item>
          <Form-item label="旺旺信用等级截图：" prop="alitmLevelPicUrl" class="ww-info-img clear">
            <Upload class="left"
                    ref="uploadAlitmLevelPicUrl"
                    :show-upload-list="false"
                    :on-success="handlewwBindAlitmLevelPicUrlSuccess"
                    :format="['jpg','jpeg','png','gif','bmp']"
                    :max-size="10240"
                    :default-file-list="wwFormValidate.alitmLevelPicUrl"
                    name="wwBind"
                    :on-remove="removewwBindAlitmLevelPicUrl"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    type="drag">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <icon type="md-camera" size="20"/>
              </div>
            </Upload>
          </Form-item>
          <div>
            <a class="look-image" @click="changeDemoPicFunc(demoUrl.wwLevelApp)">[查看手淘示例截图]</a>
            <p class="look-image-tip-text"> 截图位置：打开手淘并登录后，点击“我的淘宝”，在“必备工具”中选择“我的评价”即可在顶部看到当前旺旺信用等级</p>
            <a class="look-image mt-6 inline-block" @click="changeDemoPicFunc(demoUrl.wwLevelPc)">[查看PC示例截图]</a>
            <p class="look-image-tip-text"> 截图位置：打开淘宝首页并登录后，点击顶部“我的淘宝”，然后在左侧菜单列表中点击“评价管理”，即可查看当前旺旺信用等级</p>
          </div>
          <!--<Form-item label="账号信息截图："  prop="picUrl" class="ww-info-img">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handlewwBindPicUrlSuccess"
              :format="['jpg','jpeg','png','gif','bmp']"
              :max-size="2000"
              :default-file-list="wwFormValidate.picUrl"
              name="wwBind"
              :on-remove = "removewwBindPicUrl"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              type="drag">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </Form-item>
          <Form-item>
            截图位置：我的淘宝->账户设置->安全设置
          </Form-item>-->
          <Form-item label="淘气值：" prop="taoqizhi" class="mt-12">
            <i-select v-model="wwFormValidate.taoqizhi">
              <i-option v-for="item in aliTqzList" :label='item.label' :value="item.value"
                       :key="item.value">
                {{item.label}}
              </i-option>
            </i-select>
          </Form-item>
          <Form-item label="淘气值截图：" prop="taoqizhiPicUrl" class="ww-info-img clear">
            <Upload
              class="left"
              ref="uploadTaoqizhiPicUrl"
              :show-upload-list="false"
              :on-success="handlewwBindtaoqizhiPicUrlSuccess"
              :format="['jpg','jpeg','png','gif','bmp']"
              :max-size="10240"
              :default-file-list="wwFormValidate.taoqizhiPicUrl"
              name="wwBind"
              :on-remove="removewwBindtaoqizhiPicUrl"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              type="drag">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="md-camera" size="20"/>
              </div>
            </Upload>
          </Form-item>
          <div>
            <a class="look-image" @click="changeDemoPicFunc(demoUrl.taoqiApp)">[查看手淘示例截图]</a>
            <p class="look-image-tip-text"> 截图位置：打开手淘并登录后，点击“我的淘宝”，即可查看到当前账号的淘气值</p>
            <a class="look-image mt-6 inline-block" @click="changeDemoPicFunc(demoUrl.taoqiPc)">[查看PC示例截图]</a>
            <p class="look-image-tip-text">截图位置：打开淘宝首页，将鼠标移至左上角自己的淘宝账户，即可看到自己的淘气值</p>
          </div>
          <Form-item label="收货地址：" prop="address" class="mt-12">
            <region-picker
              :auto="true"
              :placeholder="{province: '选择省份', city: '选择市', district: '选择地区'}"
              :province="region.province"
              :city="region.city"
              :district="region.district"
              @onchange="regionPickerChange">
            </region-picker>
          </Form-item>
          <!--<Form-item prop="detailAddress">-->
            <!--<iInput v-model="wwFormValidate.detailAddress"></iInput>-->
          <!--</Form-item>-->
          <Form-item>
            <i-button :class="[btnState.wwBindBtn ? '': 'ww-bind-btn']" :disabled="btnState.wwBindBtn"
                     @click="handleSubmit('wwFormValidate',wwBindFunc)">提交
            </i-button>
            <iButton type="ghost" class="cl666" @click="handleReset('wwFormValidate',clearWwInfo)">重置</iButton>
          </Form-item>
          <p class="ww-tip">
            1.支持jpg/jpeg/gif/bmp/png格式，最大不超过10M
          </p>
          {{wwFormValidate.birthday}}
        </iForm>

      </div>
      <div class="left ww-account-cue mt-20">
        <p>
          <a @click="changeDemoPicFunc(demoUrl.wwAccount)">什么是旺旺ID号？</a>
        </p>
      </div>
    </div>
    <!--删除任务弹框-->
    <Modal v-model="deleteWwModal" width="360">
      <p slot="header" class="main-color text-ct">
        <Icon type="md-information-circle" size="16"/>
        <span>删除确认</span>
      </p>
      <div class="text-ct">
        <p>解绑后该旺旺将从亲的账号中删除，</p>
        <p>是否确认解绑？</p>
      </div>
      <div slot="footer">
        <i-button type="error" size="large" long :loading="modalLoading" @click="confirmDelete">删除</i-button>
      </div>
    </Modal>
    <Modal v-model="demoShow" width="900">
      <div class="text-ct">
        <img :src="demoShowPic" alt="" style="width: 100%; margin-top: 20px">
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
  import {Icon, Form, Input, Switch, Select, Option, Button, Radio, Modal, Alert, Tooltip, DatePicker} from 'iview'
  import {RegionPicker} from 'vue-region-picker'
  import CHINA_REGION from 'china-area-data'
  import Upload from '@/components/Upload'
  import api from '@/config/apiConfig'
  import {aliCallbackImgUrl} from '@/config/env'
  import commonConfig from '@/config/commonConfig'

  RegionPicker.region = CHINA_REGION;
  RegionPicker.vueVersion = 2;
  export default {
    name: 'ww-bind',
    components: {
      Tooltip: Tooltip,
      iInput: Input,
      iSwitch: Switch,
      iForm: Form,
      FormItem: Form.Item,
      iButton: Button,
      Icon: Icon,
      Radio: Radio,
      RadioGroup: Radio.Group,
      Upload: Upload,
      Modal: Modal,
      Alert: Alert,
      iSelect: Select,
      iOption: Option,
      RegionPicker: RegionPicker,
      DatePicker:DatePicker
    },
    data() {
      //表单验证
      const wwName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'));
        } else if (value.length > 50) {
          callback(new Error('旺旺ID过长'))
        } else {
          callback()
        }
      };
      const wwRequired = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else {
          callback()
        }
      };
      const sex = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择性别'));
        } else {
          callback()
        }
      };
      const antPay = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择是否开启花呗'));
        } else {
          callback();
        }
      };
      const birthday = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择生日'));
        } else {
          callback();
        }
      };
      const alitmLevel = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择旺旺号信用等级'));
        } else {
          callback();
        }
      };
      const alitmLevelUrl = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请选择旺旺号信用等级截图'));
        } else {
          callback();
        }

      };
      const taoqizhi = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择淘气值'));
        } else {
          callback()
        }
      };
      const tqzUrl = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请上传淘气值图片'));
        } else {
          callback()
        }
      };
      // const addAddress = (rule, value, callback) => {
      //   console.log(value + '111');
      //   if (value === '') {
      //     callback(new Error('地址不能为空'));
      //   } else {
      //     callback()
      //   }
      // };


      return {
        alimitId: null,
        wwStatusTextOn: '启用中',
        wwStatusTextOff: '停用中',
        switchTrue: true,
        switchFalse: false,
        switchValueTrue: false,
        switchValueFalse: true,
        modalLoading: false,
        deleteWwModal: false,
        deleteWwId: '',
        aliLevelList: commonConfig.aliLevelList,
        aliTqzList: commonConfig.aliTqzList,
        userData: {},
        demoShowPic: '',
        demoShow: false,
        demoUrl: {
          wwAccount: '/static/img/demo/ww-bind/taobao-account-demo.jpg',
          wwAccountInfo: '/static/img/demo/ww-bind/taobao-account-info.png',
          taoqiPc: '/static/img/demo/ww-bind/taoqi_demo.png',
          taoqiApp: '/static/img/demo/ww-bind/taoqi_demo_app.png',
          wwLevelPc: '/static/img/demo/ww-bind/ww_level_demo.png',
          wwLevelApp: '/static/img/demo/ww-bind/ww_level_demo_app.png'
        },
        btnState: {
          wwBindBtn: false,
          verifiedBtn: false,
        },
        showWwBindBox: false,
        modifyWw: false,
        wwBindLists: [],
        wwFormValidate: {
          sex: '0',
          antPay:'true',
          birthday:'',
          alitmAccount: '',
          alitmLevel: '',
          taoqizhi: '',
//          picUrl: [],
          alitmLevelPicUrl: [],
          taoqizhiPicUrl: [],
          // detailAddress: '',
        },
        wwFormRuleCustom: {
          alitmAccount: [
            {required: true, validator: wwName, trigger: 'blur'},
          ],
          sex: [
            {required: true, validator: sex, trigger: 'blur'},
          ],
          antPay: [
            {required: true, validator: antPay, trigger: 'change'},
          ],
          birthday: [
            {required:true, validator: birthday, trigger:'blur'}
          ],
          alitmLevel: [
            {required: true, validator: alitmLevel, trigger: 'change'},
          ],
          alitmLevelPicUrl: [
            {required: true, validator: alitmLevelUrl, trigger: 'blur'},
          ],
          taoqizhi: [
            {required: true, validator: taoqizhi, trigger: 'change'},
          ],
          taoqizhiPicUrl: [
            {required: true, validator: tqzUrl, trigger: 'blur'},
          ],
         /* taoqizhiPicUrl: [
            {required: true, validator: wwName, trigger: 'blur'},
          ],*/
          // address: [
          //   {required: true, validator: addAddress, trigger: 'blur'}
          // ],
          // detailAddress: [
          //   {required: true, validator: addAddress, trigger: 'blur'},
          // ],




        },
        remarks: {
          text: '',
          auditTime: '',
        },
        region: {},
        address: {},
        oldAlitmAccount:null,
      }
    },
    mounted() {

    },
    created() {
      let self = this;
      self.wwBindList();
    },
    computed: {},
    methods: {
      switchTypeTrue(id) {
        let self = this;
        if (!self.switchValueTrue) {
          self.wwStatusTextOn = '停用中';
          self.switchValueTrue = true;
          api.disuseWw({
            id: id
          }).then((res) => {
            if (res.status) {
              self.$Message.success('已停用！')
            } else {
              self.$Message.error(res.msg);
            }
          })
        } else {
          self.wwStatusTextOn = '启用中';
          self.switchValueTrue = false;
          api.unDisuseWw({
            id: id
          }).then((res) => {
            if (res.status) {
              self.$Message.success('已启用！');
            } else {
              self.$Message.error(res.msg);
            }
          })
        }
      },
      switchTypeFalse(id) {
        let self = this;
        if (!self.switchValueFalse) {
          self.wwStatusTextOff = '停用中';
          self.switchValueFalse = true;
          api.disuseWw({
            id: id
          }).then((res) => {
            if (res.status) {
              self.$Message.success('已停用！')
            } else {
              self.$Message.error(res.msg)
            }
          })
        } else {
          self.wwStatusTextOff = '启用中';
          self.switchValueFalse = false;
          api.unDisuseWw({
            id: id
          }).then((res) => {
            if (res.status) {
              self.$Message.success('已启用！');
            } else {
              self.$Message.error(res.msg);
            }
          })
        }
      },
      regionPickerChange(obj) {
        this.address = obj;
      },
      deleteWwBindFunc(ww) {
        let self = this;
        self.deleteWwId = ww.id;
        self.deleteWwModal = true;
      },
      confirmDelete() {
        let self = this;
        self.modalLoading = true;
        api.wwUnbind({id: self.deleteWwId}).then((res) => {
          self.modalLoading = false;
          if (res.status) {
            self.$store.dispatch('getUserInformation');
            self.$Message.success({
              content: res.msg,
              duration: 1,
              onClose: function () {
                self.$router.go(0);
              }
            });
          } else {
            if (res.statusCode === 'have_waiting_audit_apply') {
              res.msg = '亲，该旺旺还有活动任务正在审核中，请完成该旺旺的所有任务后再进行解绑操作！';
            } else if (res.statusCode === 'have_under_way_showker_task') {
              res.msg = '亲，该旺旺还有活动任务正在进行中，请完成该旺旺的所有任务后再进行解绑操作！';
            }
            self.$Message.error({
              content: res.msg
            });
          }
          self.deleteWwModal = false;
        })
      },
      modifyWwBindFunc(ww) {
        let _this = this;
        _this.showWwBindBox = true;
        _this.wwFormValidate.id = ww.id;
        _this.wwFormValidate.alitmAccount = ww.alitmAccount;
        _this.oldAlitmAccount = ww.alitmAccount;
        _this.wwFormValidate.alitmLevel = ww.creditLevel;
        _this.wwFormValidate.taoqizhi = ww.tqz;
        _this.address.province = ww.takeProvince;
        _this.address.city = ww.takeCity;
        _this.address.district = ww.takeDistrict;
        _this.region.province = ww.takeProvince;
        _this.region.city = ww.takeCity;
        _this.region.district = ww.district;
        _this.wwFormValidate.sex =ww.alitmRole?ww.alitmRole.toString():null;
        _this.wwFormValidate.detailAddress = ww.takeDetail;
        _this.wwFormValidate.alitmLevelPicUrl = [{
          src: ww.wwCreditLevelPic,
        }];
        _this.wwFormValidate.taoqizhiPicUrl = [{
          src: ww.tqzPic,
        }];
        _this.remarks.text = ww.remarks;
        _this.remarks.auditTime = ww.auditTime;
        _this.modifyWw = true;
        _this.$set(_this.wwFormValidate);
      },
      addWwBindFunc() {
        let _this = this;
        if (!_this.wwBindLists) {
          _this.showWwBindBox = true;
          _this.wwFormValidate.id = '';
          _this.wwFormValidate.alitmAccount = '';
          _this.wwFormValidate.alitmLevel = '';
          _this.wwFormValidate.taoqizhi = '';
          _this.wwFormValidate.birthday = '';
          _this.wwFormValidate.antPay = 'true';
//          _this.wwFormValidate.picUrl = [];
          _this.wwFormValidate.alitmLevelPicUrl = [];
          _this.wwFormValidate.taoqizhiPicUrl = [];
          _this.remarks.text = '';
          _this.modifyWw = false;
        } else {
          _this.$Message.warning("亲, 最多只能绑定1个旺旺号");
        }
      },
      changeDemoPicFunc(demoPic) {
        this.demoShow = true;
        this.demoShowPic = demoPic;
      },
      wwBindList() {
        let self = this;
        api.wwBindList().then((res) => {
          if (res.status) {
            self.wwBindLists = res.data;
            if (res.statusCode === 'success_but_not_any_alitm') {
              self.showWwBindBox = true;
              self.$nextTick(() => {
                self.$Notice.info({
                  title: '旺旺号信息绑定',
                  desc: '申请宝贝时，需要首先绑定淘宝旺旺号后才可以进行操作。请先按照页面提示进行旺旺号的绑定，以便于后期活动的申请，感谢您的支持与配合！',
                  duration: 0
                });
              });
            }
          } else {
            self.$Message.error(res.msg);
          }
        });
      },
      wwBindFunc() {
        let self = this;
        if (self.wwFormValidate.taoqizhiPicUrl && self.wwFormValidate.alitmLevelPicUrl) {
          if (!self.address.province) {
            self.$Message.error('请选择省');
            return
          }
          if (!self.address.city) {
            self.$Message.error('请选择市');
            return
          }
          if (!self.address.district) {
            self.$Message.error('请选择区/县');
            return
          }
          self.btnState.wwBindBtn = true;
          if (self.modifyWw) {
            api.wwModify({
              alitmAccount: self.wwFormValidate.alitmAccount,
//              wwInfoPic: this.wwFormValidate.picUrl[0].src,
              creditLevel: self.wwFormValidate.alitmLevel,
              tqz: self.wwFormValidate.taoqizhi,
              wwCreditLevelPicUrl: self.wwFormValidate.alitmLevelPicUrl[0].src,
              tqzPicUrl: self.wwFormValidate.taoqizhiPicUrl[0].src,
              id: self.wwFormValidate.id,
              takeProvince: self.address.province,
              takeCity: self.address.city || null,
              takeDistrict: self.address.district || null,
              alitmRole: self.wwFormValidate.sex,
              birthday:self.wwFormValidate.birthday,
              antPay:self.wwFormValidate.antPay
              // takeDetail: self.wwFormValidate.detailAddress
            }).then((res) => {
              if (res.status) {
                self.remarks = '';
                self.$Message.success({
                  content: "亲！提交成功，客服妹子会尽快审核...",
                  duration: 1,
                  onClose: function () {
                    self.wwBindList();
                    self.clearWwInfo();
                    self.showWwBindBox = false;
                  }
                });
              } else {
                self.$Message.error(res.msg);
              }
              self.btnState.wwBindBtn = false;
            })
          } else {
            api.wwBind({
              alitmAccount: self.wwFormValidate.alitmAccount,
//              wwInfoPic: this.wwFormValidate.picUrl[0].src,
              creditLevel: self.wwFormValidate.alitmLevel,
              tqz: self.wwFormValidate.taoqizhi,
              wwCreditLevelPicUrl: self.wwFormValidate.alitmLevelPicUrl[0].src,
              tqzPicUrl: self.wwFormValidate.taoqizhiPicUrl[0].src,
              takeProvince: self.address.province,
              takeCity: self.address.city || null,
              takeDistrict: self.address.district || null,
              alitmRole: self.wwFormValidate.sex,
              birthday:self.wwFormValidate.birthday,
              antPay:self.wwFormValidate.antPay
              // takeDetail: self.wwFormValidate.detailAddress
            }).then((res) => {
              if (res.status) {
                self.$Message.success({
                  content: "亲！提交成功，客服妹子会尽快审核...",
                  duration: 1,
                  onClose: function () {
                    self.wwBindList();
                    self.clearWwInfo();
                    self.$store.dispatch('getUserInformation');
                    self.showWwBindBox = false;
                  }
                });
              } else {
                self.$Message.error(res.msg);
              }
              self.btnState.wwBindBtn = false;
            })
          }
        } else {
          self.$Modal.warning({
            content: '请上传必需图片'
          });
        }
      },
      removewwBindAlitmLevelPicUrl() {
        this.wwFormValidate.alitmLevelPicUrl = [];
      },
      removewwBindtaoqizhiPicUrl() {
        this.wwFormValidate.taoqizhiPicUrl = [];
      },
      clearWwInfo() {
        this.wwFormValidate.alitmAccount = '';
        let child = this.$refs;
        child.uploadAlitmLevelPicUrl.handleRemove();
        child.uploadTaoqizhiPicUrl.handleRemove();
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
      handleReset(name, callback) {
        this.$refs[name].resetFields();
        if (typeof callback === 'function') {
          callback();
        }
      },
//      handlewwBindPicUrlSuccess(res, file){
//        this.wwFormValidate.picUrl = [{
//          src: aliCallbackImgUrl + res.name
//        }];
//      },
      handlewwBindtaoqizhiPicUrlSuccess(res) {
        this.wwFormValidate.taoqizhiPicUrl = [{
          src: aliCallbackImgUrl + res.name
        }];
      },
      handlewwBindAlitmLevelPicUrlSuccess(res) {
        this.wwFormValidate.alitmLevelPicUrl = [{
          src: aliCallbackImgUrl + res.name
        }];
      },
      handleFormatError(file) {
        this.$Modal.warning({
          title: '文件格式不正确',
          content: '图片 ' + file.name + ' 格式不正确，请上传 jpg 或 jpeg 或 gif 或 bmp 格式的图片。'
        });
      },
      handleMaxSize(file) {
        this.$Modal.warning({
          title: '超出文件大小限制',
          content: '图片 ' + file.name + ' 太大，不能超过 2M'
        });
      },
      handleBeforeUpload() {
        /* const check = this.mainUploadList.length < 1;
         if (!check) {
         this.$Modal.warning({
         title: '最多只能上传 1 张图片。'
         });
         }
         return check;*/
      },
      selectDate(date) {
        this.wwFormValidate.birthday = date;
      }
    }
  }
</script>
