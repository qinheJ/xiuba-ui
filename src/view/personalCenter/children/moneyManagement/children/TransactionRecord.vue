<template>
  <div class="my-transact">
    <div class="clear date-picker">
      <div class="left">
        <span>起止日期：</span>
        <Date-picker type="datetime" placeholder="选择日期" style="width: 200px" v-model="beginTime" format="yyyy-MM-dd HH:mm:ss" @on-change="beginTimeFun">
        </Date-picker>
        <span>-</span>
        <Date-picker type="datetime" placeholder="选择日期" style="width: 200px" v-model="endTime" format="yyyy-MM-dd HH:mm:ss" @on-change="endTimeFun"></Date-picker>
      </div>
      <div class="choice-time left">
        <span class="cursor-p" v-for="item in choiceTime" :class="{active:timeSelect === item.isSelect} " @click="getTargetTime(item.id,item.isSelect)">{{item.text}}</span>
      </div>
    </div>
    <div class="transact-type">
      <span>交易类型：</span>
      <div class="checkbox">
        <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">
          全部
        </Checkbox>
      </div>
      <div class="checkbox">
        <Checkbox-group v-model="transactType" @on-change="checkAllGroupChange">
          <Checkbox label="0">活动</Checkbox>
          <Checkbox v-if="getUserInfoRole === 1" label="1">充值</Checkbox>
          <Checkbox v-if="getUserInfoRole === 0" label="2">提现</Checkbox>
          <Checkbox label="4">推荐奖励</Checkbox>
          <Checkbox label="100">其它</Checkbox>
        </Checkbox-group>
      </div>
    </div>
    <div class="activity-number mt-10">
      活动编号：
      <iInput v-model="activityNumber" style="width: 200px;height: 30px" class="ml-10"></iInput>
    </div>
    <iButton class="ibtn" @click="changePageShow(transactType)">筛选</iButton>
    <div class="mt-22 line"></div>
    <div class="transaction-amount">
      <span>收入：<span style="color: #2F962F;">{{(userAccount.amountIncomes / 100).toFixed(2) || 0}}</span>元</span>
      <span class="ml-20">支出：<span class="main-color">{{(userAccount.amountPayment / 100).toFixed(2) || 0}}</span>元</span>
    </div>
    <div class="personal-list-table mt-10">
      <table class="list-table">
        <thead>
        <tr>
          <th style="width: 20%">交易时间</th>
          <th style="width: 40%">交易类型</th>
          <th style="width: 20%">交易金额（元）</th>
          <th style="width: 20%">操作</th>
        </tr>
        </thead>
        <tbody v-for="(tbodyDetails,index) in myTableDetailsAll" :key="index">
        <tr>
          <td>
            <p>{{tbodyDetails.tradTime | dateFormat('YYYY-MM-DD ')}}</p>
            <p>{{tbodyDetails.tradTime | dateFormat('hh:mm:ss ')}}</p>
          </td>
          <td>
            <p>{{getTradType(tbodyDetails.accountChangeType)}}</p>
            <p v-if="tbodyDetails.accountChangeType !== 1 && tbodyDetails.accountChangeType !== 2 && tbodyDetails.accountChangeType !== 3 && tbodyDetails.accountChangeType !== 10 && tbodyDetails.accountChangeType !== 11 && tbodyDetails.accountChangeType !== 12 && tbodyDetails.accountChangeType !== 13 && tbodyDetails.accountChangeType !== 14">活动编号：{{tbodyDetails.taskSerialNum}}</p>
            <p v-if="tbodyDetails.accountChangeType === 14">ID: {{tbodyDetails.referId}}</p>
          </td>
          <td :class="{tdColor:tbodyDetails.amountChange<0 , tdColorGreen:tbodyDetails.amountChange>0}">
            {{typeChang(tbodyDetails.amountChange / 100) || 0}}
          </td>
          <td>
            <p class="details blue" @click="detailsInit(tbodyDetails.id)">详情
              <Icon :type="detailSelect===tbodyDetails.id?'arrow-up-b':'arrow-down-b'" class="ml-5 "></Icon>
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="padding: 0px;border: none">
            <collapse-transition>
              <div v-show="detailSelect===tbodyDetails.id">
                <table class="small-table" style="background-color: #f9f9f9;">
                  <thead>
                  <tr>
                    <th style="width:20%;">交易时间</th>
                    <th style="width:30%;">流水号</th>
                    <th style="width:30%;">交易明细</th>
                    <th style="width:10%;">交易金额（元）</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in userListDetails">
                    <td>
                      <p>{{item.tradTime | dateFormat('YYYY-MM-DD ')}}</p>
                      <p>{{item.tradTime | dateFormat('hh:mm:ss ')}}</p>
                    </td>
                    <td>
                      {{item.serialNumber}}
                    </td>
                    <td>
                      <p v-if="getTradType(item.tradName)">{{getTradType(item.tradName) }}</p>
                      <p v-else>{{item.tradName}}</p>
                    </td>
                    <td :class="{tdColor:item.tradAmount<0 , tdColorGreen:item.tradAmount>0}">
                      {{typeChang(item.tradAmount / 100) || 0}}
                    </td>
                  </tr>
                  <tr v-if="getUserInfoRole === 1 && tbodyDetails.accountChangeType === 0">
                    <td colspan="4">
                      <Button
                        @click="amountPopWindow = true; taskNumber = tbodyDetails.taskSerialNum; getDepositReturnList(tbodyDetails.taskId)"
                        class="theSpecialBtn">查看拿手担保金支出明细
                      </Button>
                    </td>
                  </tr>
                  <tr v-show="showNotice">
                    <td colspan="4">暂无数据！</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </collapse-transition>
          </td>
        </tr>
        </tbody>
        <tbody>
        <tr v-show="showBigNoticeAll">
          <td colspan="4">暂无数据！</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="right mt-22" v-if="!isChange">
      <Page :total="totalPages*10" :page-size="pageSize" @on-change="changePages"></Page>
    </div>
    <Modal
      v-model="amountPopWindow"
      :styles="{top:'200px',width:'800px'}"
      class-name="pop-up-window">
      <div slot="header">活动编号：<span style="color: red;">{{taskNumber || '无'}}&nbsp;,&nbsp;</span>共返还拿手担保金：<span
        style="color: red;">{{(totalPay / 100).toFixed(2)}}</span>&nbsp;元
      </div>
      <div>
        <table class="alert-table-list"
               style="width: 100%;border: 1px solid #F3F3F3;background-color:#F8F8F8;text-align: center">
          <thead>
          <tr style="border-bottom: 1px solid #F3F3F3;">
            <th style="width: 20%;padding: 10px 0px;">交易时间</th>
            <th style="width: 20%">流水号</th>
            <th style="width: 40%">交易明细</th>
            <th style="width: 20%">交易金额（元）</th>
          </tr>
          </thead>
          <tbody>
          <tr style="border-bottom: 1px solid #F3F3F3;" v-for="item in getDepositList">
            <td style="padding:10px 0px;">
              <p>{{item.tradTime | dateFormat('YYYY-MM-DD ') }}</p>
              <p>{{item.tradTime | dateFormat('hh:mm:ss ')}}</p>
            </td>
            <td>{{item.serialNumber}}</td>
            <td>
              <p>{{getTradType(item.tradName)}}</p>
            </td>
            <td class="main-color">
              {{'-' + item.tradAmount / 100 || 0}}
            </td>
          </tr>
          </tbody>
          <tbody v-if="getDepositList.length===0">
          <tr>
            <td colspan="4" style="height: 40px">暂无数据！</td>
          </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {Icon, DatePicker, Input, Checkbox, Button, Page, Radio, Modal} from 'iview'
  import api from '@/config/apiConfig'
  import {taskErrorStatusList} from '@/config/utils'
  import CollapseTransition from 'iview/src/components/base/collapse-transition'

  export default {
    name: 'TransactionRecord',
    components: {
      DatePicker: DatePicker,
      iInput: Input,
      Checkbox: Checkbox,
      CheckboxGroup: Checkbox.Group,
      iButton: Button,
      ButtonGroup: Button.Group,
      Icon: Icon,
      Modal: Modal,
      Page: Page,
      Radio: Radio,
      RadioGroup: Radio.Group,
      CollapseTransition: CollapseTransition,
    },
    data() {
      return {
        imgSrc: null,
        myTableDetailsAll: [],
        userListDetails: null,
        infoSelect: 'account',
        detailSelect: 'false',
        showBigNotice: false,
        showBigNoticeAll: false,
        showNotice: false,
        beginTime: null,
        endTime: null,
        timeSelect: 'all',
        choiceTime: [
          {
            text: '今天',
            isSelect: 'today',
            id: 0

          },
          {
            text: '昨天',
            isSelect: 'yesterday',
            id: 1
          },
          {
            text: '最近一个月',
            isSelect: 'oneMouth',
            id: 2
          },
          {
            text: '全部',
            isSelect: 'all',
            id: 3
          }
        ],
        checkAll: false,
        transactType: [],
        activityNumber: null,
        amountPopWindow: false,
        getDepositList: {},
        totalPay: 0,
        taskNumber: '',
        totalPages: 1,
        pageSize: 10,
        pageIndex: 0,
        accountIncomes: 0,
        accountPayout: 0,
        mainColor: true,
        mainColorGreen: false,
        isChange: false,
        tradTimeStart: null,
        tradTimeEnd: null,
      }
    },
    mounted() {

    },
    created() {
      let taskNumber = this.$route.query.taskNumber;
      let activeType = this.$route.query.activeType;
      if (taskNumber) {
        this.activityNumber = taskNumber;
        this.getTradListAll();
      } else if (activeType === 1) {
        this.getTradListAll([1]);
      } else if (activeType === 1) {
        this.getTradListAll([2]);
      } else {
        this.getTradListAll();
      }
    },
    computed: {
      userAccount() {
        return this.$store.getters.getUserAccountInfo || {};
      },
      getUserBalance() {
        return this.$store.getters.getUserBalance;
      },
      getUserInfoRole() {
        return this.$store.getters.getUserRole;
      }
    },
    methods: {
      beginTimeFun(e) {
        let self = this;
        self.beginTime = e;
        self.tradTimeStart = e;
      },
      endTimeFun(e) {
        this.endTime = e;
        this.tradTimeEnd = e;
      },
      changePageShow(type) {
        if (!this.endTime) {
          this.tradTimeEnd = null
        }
        if (!this.beginTime) {
          this.tradTimeStart = null
        }
        if (!this.endTime && !this.beginTime) {
          this.timeSelect = 'all'
        }
        this.pageIndex = 0;
        this.isChange = true;
        this.getTradListAll(type);
      },
      typeChang(num) {
        if (num > 0) {
          num = '+' + num;
        }
        return num
      },
      accountInit(type) {
        this.infoSelect = type
      },
      detailsInit(type) {
        if (this.detailSelect === type) {
          this.detailSelect = 'none'
        } else {
          this.detailSelect = type;
          this.getTradListDetails(type);
        }
      },
      getTradListAll(type) {
        let _this = this;
        if (type && (type.length === 0 || type.length === 5)) {
          type = null;
        } else {
          type = JSON.stringify(type);
        }
        api.getTradList({
          tradTimeStart: _this.tradTimeStart,
          tradTimeEnd: _this.tradTimeEnd,
          accountChangeTypeStr: type || null,
          reversePicUrl: null,
          taskSerial: _this.activityNumber,
          page: _this.pageIndex,
          size: _this.pageSize
        }).then(res => {
          if (res.status) {
            _this.isChange = false;
            _this.totalPages = res.data.tradPage.totalPages;
            _this.myTableDetailsAll = res.data.tradPage.content;
            _this.accountIncomes = res.data.income;
            _this.accountPayout = res.data.expense;
            _this.showBigNoticeAll = _this.myTableDetailsAll.length === 0;
          } else {
            _this.$Message.error(res.msg);
          }
        });
      },
      getTradListDetails(type) {
        let _this = this;
        api.getTradListDetails({
          tradId: type
        }).then(res => {
          if (res) {
            _this.userListDetails = res;
            _this.showNotice = _this.userListDetails.length === 0;
          } else {
            console.log("列表数据为空！");
          }
        });
      },
      handleCheckAll() {
        this.checkAll = !this.checkAll;
        if (this.checkAll) {
          if (this.getUserInfoRole === 1) {
            this.transactType = ['0', '1', '2', '4', '100'];
          } else {
            this.transactType = ['0', '2', '4'];
          }
        } else {
          this.transactType = [];
        }
      },
      checkAllGroupChange() {
        if (this.getUserInfoRole === 1) {
          if (this.transactType.length === 5) {
            this.checkAll = true;
          } else if (this.transactType.length > 0) {
            this.checkAll = false;
          } else {
            this.checkAll = false;
          }
        } else if (this.getUserInfoRole === 0) {
          if (this.transactType.length === 3) {
            this.checkAll = true;
          } else if (this.transactType.length > 0) {
            this.checkAll = false;
          } else {
            this.checkAll = false;
          }
        }
      },
      getTargetTime(type, select) {
        let _this = this;
        _this.timeSelect = select;

        function getDateStr(time) {
          let date = new Date();
          date.setDate(date.getDate() + time);
          let seperator1 = "-";
          let seperator2 = ":";
          let month = date.getMonth() + 1;
          let strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          return date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + '00' + seperator2 + '00' + seperator2 + '00';
        }

        if (type === 0) {
          _this.beginTime = getDateStr(0);
          _this.endTime = getDateStr(1);
          _this.tradTimeStart = getDateStr(0);
          _this.tradTimeEnd = getDateStr(1);
        } else if (type === 1) {
          _this.beginTime = getDateStr(-1);
          _this.endTime = getDateStr(0);
          _this.tradTimeStart = getDateStr(-1);
          _this.tradTimeEnd = getDateStr(0);
        } else if (type === 2) {
          _this.beginTime = getDateStr(-30);
          _this.endTime = getDateStr(1);
          _this.tradTimeStart = getDateStr(-30);
          _this.tradTimeEnd = getDateStr(1);
        } else {
          _this.beginTime = null;
          _this.endTime = null;
          _this.tradTimeStart = null;
          _this.tradTimeEnd = null;
          _this.isChange = true;
          _this.transactType = [];
          _this.getTradListAll();
        }
      },
      getTradType(type) {
        return taskErrorStatusList(type);
      },
      getDepositReturnList(type) {
        let _this = this;
        api.getDepositReturnList({
          taskId: type
        }).then(res => {
          if (res) {
            _this.totalPay = 0;
            _this.getDepositList = res.list;
            for (let i = 0, len = res.list.length; i < len; i++) {
              _this.totalPay += res.list[i].tradAmount;
            }
          } else {
            _this.$Message.error('数据列表为空');
          }
        });
      },
      changePages(data) {
        this.pageIndex = data - 1;
        this.getTradListAll(this.transactType);
      }
    }
  }
</script>


