<template>
  <modal :value="closable" title="提交违规行为" @on-visible-change="modalChange" :mask-closable="false">
    <div>
      <span class="inline-block title">旺旺号：</span>
      <i-input class="ww-name" :disabled="disabled" v-model="alitmAccount" style="width: 120px;"/>
    </div>
    <div class="mt-20">
      <span class="inline-block title">违规行为：</span>
      <i-select :disabled="disabled" v-model="addToBlackListReason" style="width:300px;" @on-change="selectChange">
        <i-option style="width:300px;" v-for="(item ,index) in reasonList" :value="item.reasonStatus" :key="index">{{item.reasonDec}}</i-option>
      </i-select>
    </div>
    <div class="mt-20" v-show="addToBlackListReason === 'other_reason'">
      <span class="inline-block title">填写原因：</span>
      <i-input type="textarea" v-model="addToBlackOtherReason" :disabled="disabled" placeholder="100字以内" style="width:300px"/>
    </div>
    <div class="mt-20" v-if="addToBlackListReason && addToBlackListReason !== 'none_reason'">
      <span>记入征信体系：</span>
      <checkbox v-model="addToCredit" :disabled="disabled">需要</checkbox>
      <span class="cl999">（成功计入征信体系后， <span class="main-color">火眼金睛</span>会统计此条拉黑记录）</span>
    </div>
    <div class="mt-5 cl999 ml-88" v-show="addToCredit && addToBlackListReason">
      <p>记入征信体系需要提交截图证明，由平台审核是否属实，审核期间及审核结果均不影响您正常拉黑，即此用户无法申请您发布的任何活动。</p>
      <p class="main-color f-b">客服审核通过后，会根据实际情况对违规的拿手进行相关处罚。</p>
    </div>
    <div class="mt-20" v-show="addToCredit && addToBlackListReason">
      <span>活动编号：</span>
      <i-input v-model.trim="taskNumber" :disabled="disabled" class="width-300" placeholder="请输入拿手违规行为对应的活动编号" />
    </div>
    <div class="mt-20 clear" v-show="addToCredit && addToBlackListReason">
      <span class="left mt-20">相关截图：</span>
      <upload class="left ml-5"
              ref="upload"
              :on-success="bankListImageSuccess"
              :disabled="disabled"
              :multiple="true"
              :uploadLength="5"
              :default-file-list="bankListDefaultList"
              :on-remove="removeBankListImage"
              :format="['jpg','jpeg','png','gif','bmp']"
              :max-size="1024"
              name="screenshots"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              type="drag">
        <div class="camera">
          <icon type="ios-camera" size="20"/>
        </div>
      </upload>

      <span class="ml-10 mt-20 left cl999">支持jpg/jpeg/gif/bmp格式，大小不超过10M，最多可上传5张</span>
    </div>
    <div class="black-list-error-tip mt-20" v-if="blackListInfo.auditStatus && blackListInfo.auditStatus === 3"><icon color="#FF9900" type="information-circled"/><span class="ml-5">审核不通过：{{blackListInfo.refuseReason}}</span></div>
    <div slot="footer" class="text-ct">
      <i-button :disabled="disabled" type="error" size="large" class="pl-40 pr-40" @click="confirm" :loading="loading">确定</i-button>
    </div>
  </modal>
</template>

<script>
  import {Modal, Input, Select, Option, Checkbox, Button, Icon} from 'iview'
  import Upload from '@/components/Upload'
  import api from '@/config/apiConfig'
  import {aliCallbackImgUrl} from '@/config/env'
  export default {
    name: "add-to-black-list-modal",
    components: {
      Modal: Modal,
      Icon: Icon,
      Checkbox: Checkbox,
      iInput: Input,
      iSelect: Select,
      iOption: Option,
      iButton: Button,
      Upload: Upload,
    },
    props: {
      closable: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      onSuccess: {
        type: Function,
        default() {
          return {}
        }
      },
      blackListInfo: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        reasonList: [
          {
            reasonStatus: 'none_reason',
            reasonDec: '无理由（仅屏蔽此用户申请，不记入征信体系）'
          },
          // {
          //   reasonStatus: 'tao_ke',
          //   reasonDec: '走淘客'
          // },
          // {
          //   reasonStatus: 'illegal_operation',
          //   reasonDec: '不按要求操作'
          // },
          // {
          //   reasonStatus: 'danger_account',
          //   reasonDec: '此号不安全'
          // },
          // {
          //   reasonStatus: 'sales_return',
          //   reasonDec: '有退货行为'
          // },
          {
            reasonStatus: 'rebate_order',
            reasonDec: '返利下单'
          },
          {
            reasonStatus: 'illegal_use_credit_cards_or_ant',
            reasonDec: '违规使用信用卡和花呗'
          },
          {
            reasonStatus: 'mentioned_on_taobao',
            reasonDec: '淘宝上提及平台相关信息'
          },
          {
            reasonStatus: 'show_illegal_pic_on_taobao',
            reasonDec: '淘宝晒图违规'
          },
          {
            reasonStatus: 'not_deliver_refund',
            reasonDec: '未发货私自退款'
          },
          {
            reasonStatus: 'already_deliver_refund',
              reasonDec: '已发货私自退款'
          },
          {
            reasonStatus: 'alitm_account_wrong',
            reasonDec: '使用错误的旺旺号下单'
          },
          // {
          //   reasonStatus: 'voluntary_termination',
          //   reasonDec: '随意终止活动'
          // },
          {
            reasonStatus: 'bad_evaluation_on_taobao',
            reasonDec: '淘宝给中差评'
          },
          {
            reasonStatus: 'not_evaluated_as_required',
            reasonDec: '未按要求评价'
          },
          {
            reasonStatus: 'evaluated_delete',
            reasonDec: '评价被删除'
          },
          {
            reasonStatus: 'quick_order',
            reasonDec: '秒拍'
          },
          {
            reasonStatus: 'enter_store_not_flow_require',
            reasonDec: '未按要求进店'
          },
          {
            reasonStatus: 'commit_not_in_time',
            reasonDec: '未及时提交订单号、评价截图及买家秀等'
          },
          {
            reasonStatus: 'other_reason',
            reasonDec: '其他'
          },
        ],
        addToBlackListModal: false,
        loading: false,
        addToBlackListReason: null,
        addToBlackOtherReason: null,
        alitmAccount: null,
        taskNumber: null,
        addToCredit: false,
        bankListDefaultList: [],
        screenshot: null,
        screenshotList: []
      }
    },
    methods: {
      bankListImageSuccess(res) {
        this.screenshot = aliCallbackImgUrl + res.name;
        this.screenshotList.push(this.screenshot);
      },
      removeBankListImage() {
        this.screenshot = null
      },
      handleFormatError(file) {
        this.$Message.warning('图片 ' + file.name + ' 格式不正确，请上传 jpg 或 jpeg 或 gif 或 bmp 格式的图片。')
      },
      handleMaxSize(file) {
        this.$Message.warning('图片 ' + file.name + ' 太大，不能超过 1M')
      },
      modalChange(value) {
        if (value) {
          this.alitmAccount = this.blackListInfo.alitmAccount ? this.blackListInfo.alitmAccount : null;
          this.addToBlackListReason = this.blackListInfo.reasonCode ? this.blackListInfo.reasonCode : null;
          this.addToBlackOtherReason = this.blackListInfo.reasonCode && this.blackListInfo.reasonCode === 'other_reason' ? this.blackListInfo.reasonStr : null;
          this.taskNumber = this.blackListInfo.taskNum ? this.blackListInfo.taskNum : null;
          this.addToCredit = this.blackListInfo.addToCredit ? this.blackListInfo.addToCredit : null;
          if (this.blackListInfo.screenshot && this.blackListInfo.screenshot.length > 0) {
            this.blackListInfo.screenshot.forEach(item => {
              this.bankListDefaultList.push({src: item})
            })
          }
          this.screenshot = this.blackListInfo.screenshot ? this.blackListInfo.screenshot : null;
        } else {
          this.addToBlackListReason = null;
          this.$emit('change', false);
          this.alitmAccount = null;
          this.addToBlackListReason = null;
          this.addToBlackOtherReason = null;
          this.taskNumber = null;
          this.addToCredit = false;
          this.bankListDefaultList = [];
          this.screenshotList = [];
          this.$refs.upload.fileList.splice(0, 1);
        }
      },
      selectChange(value) {
        this.addToCredit = !(value === 'none_reason');
      },
      confirm() {
        const _this = this;
        if (!_this.alitmAccount) {
          _this.$Message.warning("请填写违规的旺旺号！");
          return;
        }
        if (!_this.addToBlackListReason) {
          _this.$Message.warning("请选择违规原因！");
          return;
        }
        if (_this.addToCredit && !_this.taskNumber) {
          _this.$Message.warning("请填写拿手违规行为对应的活动编号！");
          return;
        }
        // if (!/^[0-9]*$/.test(_this.taskNumber)) {
        //   _this.$Message.warning('请输入正确格式的活动编号！');
        //   return;
        // }
        if (_this.addToCredit && !_this.screenshot) {
          _this.$Message.warning("请上传违规相关凭证截图！");
          return;
        }
        if (_this.addToBlackListReason === 'other_reason' && !_this.addToBlackOtherReason) {
          _this.$Message.warning("请填写违规原因！");
          return;
        }
        _this.loading = true;
        api.addShowkerToBlackList({
          id: _this.blackListInfo.id ? _this.blackListInfo.id : '',
          alitmAccount: _this.alitmAccount,
          reasonCode: _this.addToBlackListReason,
          reasonText: _this.addToBlackOtherReason,
          addToCredit: _this.addToCredit,
          taskNum: _this.taskNumber,
          screenshot: JSON.stringify(_this.screenshotList),
        }).then(res => {
          if (res.status) {
            _this.$emit('change', false);
            _this.$Message.success("拿手违规申诉成功！");
            _this.onSuccess();
          } else {
            _this.$Message.error(res.msg)
          }
          _this.loading = false;
        })
      }
    }
  }
</script>

<style lang="scss">
  .black-list-error-tip {
    width: 100%;
    min-height: 36px;
    line-height: 36px;
    background-color: #FFF5E6;
    border: 1px solid #FFEBCC;
    border-radius: 5px;
    padding-left: 10px;
  }
</style>
