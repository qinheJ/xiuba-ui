<template>
  <div>
    <div class="my-point">
      <span class="text-icon">扣</span>
      <span class="ml-5">我的违规扣分：</span>
      <span class="ml-5 fs-14 main-color">{{deductPoint || 0}}</span>
    </div>
    <div class="filter-box clear mt-20">
      <span>处罚分类</span>
      <i-select v-model="punishSort" :clearable="true" :filterable="true" placeholder="全部" class="width-150 ml-10" @on-change="changePunishSort">
        <i-option v-for="(item, index) in punishSortList" :value="item.id" :key="index">{{item.text}}</i-option>
      </i-select>
      <span class="ml-10">状态</span>
      <i-select v-model="punishStatus" class="width-100 ml-10">
        <i-option v-for="(item, index) in punishStatusList" :value="item.status" :key="index">{{item.text}}</i-option>
      </i-select>
      <span class="ml-10">扣分时间</span>
      <date-picker v-model="filterTime" type="daterange" format="yyyy-MM-dd HH:mm:ss" class="width-200 ml-10" @on-change="selectDate"></date-picker>
      <span class="ml-10">ID</span>
      <i-input v-model="punisherId" type="text" class="width-100 ml-10"></i-input>
      <i-button :loading="loading" class="bg-main-color cl-fff ml-10" @click="search">搜索</i-button>
    </div>
    <div class="point-result-box">
      <table>
        <thead>
        <tr>
          <th width="10">ID</th>
          <th width="15">创建时间</th>
          <th width="15">处罚分类</th>
          <th width="15">扣分</th>
          <th width="15">状态</th>
          <th width="30">说明</th>
        </tr>
        </thead>
        <tbody v-if="punishList.length > 0">
        <tr v-for="(item, index) in punishList" :Key="index">
          <td>{{item.id}}</td>
          <td>{{item.createTime | dateFormat('YYYY-MM-DD')}}</td>
          <td>{{item.dealMeasure}}</td>
          <td>{{item.deductPoint}}</td>
          <td>{{item.status}}</td>
          <td>{{item.reason}}</td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td colspan="6">暂无记录</td>
        </tr>
        </tbody>
      </table>
      <div v-if="punishList.length > 0" class="mt-10">
        <page :total="totalElements" :current="pageIndex" :page-size="pageSize" class="right" @on-change="changePage"/>
      </div>
    </div>
    <div class="clause-box mt-20">
      <p class="title">白拿拿-商家平台服务条款</p>
      <p class="mt-10 main-color">亲，感谢您成为白拿拿商家用户！</p>
      <p>本指引非常重要，请您一定认真看完！</p>
      <p>在白拿拿，商家用户的流程图如下：</p>
      <img class="mt-20" src="~assets/img/common/merchant-clause.jpg" alt="商家用户流程图"/>
      <p class="cl000">图中给予了您充分时间进行相关审核，若您不能在规定时间内审核完毕，系统将自动通过</p>
      <p class="cl000">如果发生没有按照承若寄送商品的情况，甚至是寄送空包的情况，将被平台判定为重大违规，平台将注销其商家账号，并视情节严重情况，扣留对应活动保证金！并视情节严重情况，平台将注销其商家账号！</p>
    </div>
    <div class="deduction-box mt-20">
      <p class="title">扣分节点</p>
      <table>
        <thead>
          <tr>
            <th width="20%">扣分节点</th>
            <th width="20%">每次发布活动需缴纳保证金</th>
            <th width="20%">限制发布活动</th>
            <th width="20%">活动上线展示排后</th>
            <th width="20%">商品平台不做任何推荐</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>满6分</td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-alert" color="#f9284f" size="18"/></td>
            <td><icon type="md-alert" color="#f9284f" size="18"/></td>
            <td><icon type="md-alert" color="#f9284f" size="18"/></td>
          </tr>
          <tr>
            <td>满12分</td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-alert" color="#f9284f" size="18"/></td>
            <td><icon type="md-alert" color="#f9284f" size="18"/></td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
          </tr>
          <tr>
            <td>满24分</td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-alert" color="#f9284f" size="18"/></td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
          </tr>
          <tr>
            <td>满36分</td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
            <td><icon type="md-checkmark-circle" color="#1FAC00" size="18"/></td>
          </tr>
        </tbody>
      </table>
      <p class="mt-20 lht20">每次发布活动需缴纳保证金：卖家每次发活动都需要缴纳1000元保证金才能发布活动</p>
      <p class="lht20">限制发布活动：指卖家无法在平台发布活动（满24分每2天只能发布1次活动，满36分每月只能发布5次活动）</p>
      <p class="lht20">活动上线展示排后：卖家发布的活动将无法排在前面，只能排在类目商品最后面</p>
      <p class="lht20">商品平台不做任何推荐：卖家商品无法获得平台任何资源推荐</p>
    </div>
    <div class="rule-box mt-20">
      <p class="title">商家处罚规则</p>
      <table>
        <thead>
          <tr>
            <td>违规阶段</td>
            <td>违规类型</td>
            <td>违规行为</td>
            <td>处罚规定</td>
            <td>扣信誉分</td>
          </tr>
        </thead>
        <tbody>
          <!--<tr>-->
            <!--<td rowspan="4">活动过程</td>-->
            <!--<td>商品价格类</td>-->
            <!--<td>-->
              <!--<p>1.在广告有效期内，更改活动商品价格</p>-->
              <!--<p>2.活动商品价格虚高</p>-->
              <!--<p>3.同款商品价格严重偏差，30天内波动价格超过50%</p>-->
            <!--</td>-->
            <!--<td>每人次扣除50元；</td>-->
            <!--<td>每人次扣1分</td>-->
          <!--</tr>-->
        <tr>
          <td rowspan="3">活动过程</td>
          <td>商品运费类</td>
          <td>
            <p>应当包邮的商品未包邮 </p>
            <!--<p>2.邮费不符合物流企业正常收费标准 </p>-->
            <!--<p>3.未经用户同意给用户发到付件</p>-->
          </td>
          <td>
            每人次扣除5元
          </td>
          <td>每人次扣1分</td>
        </tr>
        <tr>
          <td>上下架类</td>
          <td>活动期间内商品未保持上架状态（除合理情形且商家提供充分的书面证明材料外）</td>
          <td>每人次扣除5元；</td>
          <td>每人次扣2分</td>
        </tr>
        <tr>
          <td>下单类</td>
          <td>
            <p>1、引导用户错误购买（包括购买非发布页面所示商品、赠品等情形）</p>
            <p>2、引导用户放弃领奖资格</p>
            <p>3、找不到宝贝又联系不上商家，拿手可无条件终止活动</p>
            <p>4、实际下单要求与活动下单要求不一致，拿手可无条件终止活动，并索取一定补偿。</p>
          </td>
          <td>每人次扣除5元；</td>
          <td>每人次扣2分</td>
        </tr>
        <tr>
          <td rowspan="5">发货过程</td>
          <td>发货时间</td>
          <td>未在用户下单付款后72小时内发货（除合理情形且商家提供充分的书面证明材料外）</td>
          <td rowspan="2">每人次扣除5元； 若恶意不发货超过7天 则扣除全部的活动担保金</td>
          <td rowspan="2">每人次扣2分</td>
        </tr>
        <tr>
          <td>发货快递</td>
          <td>未发货至用户指定的收货地址</td>
        </tr>
        <tr>
          <td>实物商品及质量</td>
          <td>
            <p>1、实际发货商品与活动商品不一致</p>
            <p> 2、发货商品质量不符合平台或相关法律规定</p>
          </td>
          <td>每人次扣除10元</td>
          <td>每人次扣3分</td>
        </tr>
        <tr>
          <td>错发漏发</td>
          <td>因商家或快递原因漏发错发商品，且不进行任何处理</td>
          <td>每人次扣除5元
            注：平台无法核实双方
            商品具体情况的，以淘宝
            处理结果为准
          </td>
          <td>每人次扣1分</td>
        </tr>
        <tr>
          <td>收货评价</td>
          <td>
            <p>1.私下联系用户强制按指定内容进行评价</p>
            <p>2.私下联系用户强制追加评价</p>
            <p>3.用户收货评价后，24小时内未确认评价的，系统自动审核确认，所产生的后果商家自行承担</p>
          </td>
          <td>每人次扣除5元；</td>
          <td>每人次扣2分</td>
        </tr>
        <tr>
          <td rowspan="3">平台规则</td>
          <td>私下拉群</td>
          <td>
            <p>1、引导用户加入商家创建的QQ、微信群</p>
            <p>2、在和用户旺旺聊天过程中提及白拿拿、评测等</p>
          </td>
          <td>每次扣除20元</td>
          <td>每次扣3分</td>
        </tr>
        <tr>
          <td>领奖审核</td>
          <td>拒绝已通过拿手的下单资格</td>
          <td>每人次扣除5元</td>
          <td>每人次扣2分</td>
        </tr>
        <tr>
          <td>任务押金</td>
          <td>因已缴纳的返款费不足以给用户返款，在客服通知后48小时内未补缴返款费。</td>
          <td>系统强制补差价，并每人次扣除5元</td>
          <td>每人次扣3分</td>
        </tr>
        <tr>
          <td>其他行为</td>
          <td>其他恶意行为</td>
          <td>
            <p>1、其他恶意行为造成用户或者平台损失的</p>
            <p>2、让拿手终止平台活动，私下返款的</p>
          </td>
          <td>一经发现，根据情节轻重酌情处罚</td>
          <td>根据情况酌情扣1-12分</td>
        </tr>
        </tbody>
      </table>
      <p class="mt-20 lht20">特别说明：</p>
      <p class="lht20">1、若商家存在违规行为的，平台有权在未通知商家及未经商家许可的情况下，直接扣除罚款及分值。</p>
      <p class="lht20">2、为保障双方资金和交易安全，平台有权根据实际情况暂时或者永久限制商家使用部分功能。若商家需要解除限制的，需根据要求提供相应证明材料并提供相应的保证措施。</p>
      <p class="lht20">3、若商家存在交易纠纷为处理完成且拒不处理的，在交易纠纷处理完毕前，平台有权限制商家在平台发布任何活动。</p>
    </div>
  </div>
</template>

<script>
  import api from '@/config/apiConfig'
  import {Select, Option, DatePicker, Button, Icon, Page, Input} from 'iview'
  import {merchantPunishType, getSeverTime} from '@/config/utils'
  export default {
    name: "service-clause",
    components: {
      iSelect: Select,
      iOption: Option,
      DatePicker: DatePicker,
      iButton: Button,
      Icon: Icon,
      Page: Page,
      iInput: Input
    },
    data() {
      return {
        deductPoint: null,
        punishSortList: [
          {
            text: '全部',
            id: 0
          },
          // {
          //   text: '商品价格类',
          //   id: 11
          // },
          {
            text: '商品运费类',
            id: 12
          },
          {
            text: '上下架类',
            id: 13
          },
          {
            text: '下单类',
            id: 14
          },
          {
            text: '发货时间',
            id: 21
          },
          {
            text: '发货快递',
            id: 22
          },
          {
            text: '实物商品',
            id: 23
          },
          {
            text: '错发漏发',
            id: 24
          },
          {
            text: '收货评价',
            id: 25
          },
          {
            text: '私下拉群',
            id: 31
          },
          {
            text: '领奖审核',
            id: 32
          },
          {
            text: '任务押金',
            id: 33
          },
          {
            text: '其他行为',
            id: 41
          },
        ],
        punishStatusList: [
          {
            text: '已生效',
            status: 1
          },
          {
            text: '未生效',
            status: 0
          }
        ],
        filterTime: null,
        punishSort: null,
        punishStatus: null,
        pageIndex: 1,
        pageSize: 10,
        dealTimeStart: null,
        dealTimeEnd: null,
        punisherId: null,
        loading: false,
        totalElements: 0,
        punishList: []
      }
    },
    computed: {

    },
    created() {
      this.search();
      this.getUserInfo();
    },
    methods: {
      selectDate(e) {
        this.dealTimeStart = e[0];
        this.dealTimeEnd = e[1];
      },
      changePage(page) {
        this.pageIndex = page;
        this.search();
      },
      changePunishSort(id) {
        if (id === 0) {
          this.punishSort = null;
        }
      },
      search() {
        const _this = this;
        _this.loading = true;
        api.getPunishInfo({
          pageIndex: _this.pageIndex,
          pageSize: _this.pageSize,
          dealMeasure: _this.punishSort,
          enable: _this.punishStatus === null ? null : !!_this.punishStatus,
          dealTimeStart: _this.dealTimeStart,
          dealTimeEnd: _this.dealTimeEnd,
          id: _this.punisherId
        }).then(res => {
          if (res.status) {
            res.data.content.forEach(item => {
              item.dealMeasure = merchantPunishType(item.dealMeasure);
              item.status = (item.deadLineTime - getSeverTime()) > 0 ? '已生效' : '未生效';
            });
            _this.punishList = res.data.content;
            _this.totalElements = res.data.totalElements;
          } else {
            _this.$Message.error(res.msg);
          }
          _this.loading = false;
        })
      },
      getUserInfo() {
        const _this = this;
        api.getUserAccount({
          platForm: 'PC'
        }).then(res => {
          if (res.status) {
            _this.deductPoint = res.data.extension.deductPoint;
          } else {
            _this.$Message.error(res.msg);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/css/mixin';
  /*页面内公共样式*/
  .title {
    padding: 10px 0 10px 10px;
    border-bottom: 2px solid $mainColor;
    font-size: 18px;
    font-weight: bold;
  }
  /*页面内非公共样式*/
  .my-point {
    background: #F3F3F3;
    padding: 15px;
    .text-icon {
      padding:5px;
      border: 1px solid #ccc;
      border-radius: 50%;
    }
  }
  .point-result-box {
    table {
      width: 100%;
      text-align: center;
      border: 1px solid #e5e5ea;
      margin-top: 15px;
      thead {
        border-bottom: 1px solid #e5e5ea;
      }
      th,td {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }
  .deduction-box {
    table {
      width: 100%;
      border-top: 1px solid #e5e5ea;
      border-left: 1px solid #e5e5ea;
      text-align: center;
      td,th {
        border-right: 1px solid #e5e5ea;
        border-bottom: 1px solid #e5e5ea;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }
  .rule-box {
    table {
      width: 100%;
      border-top: 1px solid #e5e5ea;
      border-left: 1px solid #e5e5ea;
      text-align: center;
    }
    td,th {
      border-right: 1px solid #e5e5ea;
      border-bottom: 1px solid #e5e5ea;
      padding: 10px;
    }
  }

</style>
