<template>
  <div class="activity-management">
    <div class="activity-title pl-10 clear">
      <span class="left">审批拿手</span>
      <span class="right"><router-link to="/user/activity-management/list">返回上一页</router-link></span>
    </div>
    <div class="approve-manage-info mt-12">
      <div class="manage-info-con clear">
        <div class="manage-img left">
          <img :src="approveTaskInfo.taskMainImage + '!thum54'" alt="">
        </div>
        <div class="manage-text left ml-5">
          <p>{{approveTaskInfo.taskName}}</p>
          <p class="mt-15">
            总份数<strong>&nbsp;{{approveTaskInfo.taskCount || 0}}&nbsp;</strong>，<strong>&nbsp;{{approveTaskInfo.trailOn || 0}}&nbsp;</strong>人正在参与活动，<strong>&nbsp;{{approveTaskInfo.trailDone || 0}}&nbsp;</strong>人完成活动，剩余名额<strong>&nbsp;{{approveTaskInfo.taskCount - approveTaskInfo.showkerApplySuccessCount || 0}}&nbsp;</strong>个
          </p>
        </div>
      </div>
      <div class="approve-list mt-20">
        <div class="approve-list-title">
          <span :class="{isSelect:showApproveStatus === 'toAudit'}" @click="changeTitle('toAudit')">待审批</span>
          <span :class="{isSelect:showApproveStatus === 'passAudit'}" @click="changeTitle('passAudit')">已通过</span>
          <span :class="{isSelect:showApproveStatus === 'failAudit'}" @click="changeTitle('failAudit')">未通过</span>
        </div>
        <!--待审批-->
        <div class="await-approve mt-20" v-show="showApproveStatus === 'toAudit'">
          <div class="prompt mb-20">
            <Icon type="md-alert"></Icon>
            <span> 亲，请记得在活动结束前审批拿手哦，如果活动结束后48小时内仍未审批满，系统将自动按申请时间审批剩余名额！</span>
          </div>
          <iSelect v-model="selectStatus" style="width: 120px;margin-right: 12px;">
            <iOption v-for="item in SelectList" :value="item.value" :key="item.value">{{ item.label }}</iOption>
          </iSelect>
          <iInput v-model="searchValue" style="width: 160px;margin-right: 8px;"></iInput>
          <span class="ml-10">旺旺号信用等级大于等于：</span>
          <i-select v-model="wwFormValidate.creditLevel" style="width: 130px;">
            <i-option v-for="(item,index) in aliLevelList" :label='item.label' :value="item.value" :key="item.value">
              <span v-show="index === 0">{{item.text}}</span>
              <img v-show="index !== 0" :src="item.text" alt="">
            </i-option>
          </i-select>
          <span class="ml-10">淘气值范围：</span>
          <iSelect v-model="wwFormValidate.tqz" style="width: 120px;">
            <iOption v-for="item in aliTqzList" :label='item.label' :value="item.value" :key="item.value">
              {{item.label}}
            </iOption>
          </iSelect>
          <iButton type="primary" :loading="searchLoading" @click="searchTaskApplyList">搜索</iButton>
          <div class="activity-table mt-20">
            <table>
              <thead>
              <tr>
                <th width="20%">淘宝账号（旺旺号）</th>
                <th width="20%">申请时间</th>
                <th width="20%">拿手的买家秀记录</th>
                <th width="20%">流程状态</th>
                <th width="20%">操作</th>
              </tr>
              </thead>
              <tbody v-if="approveTableList.length > 0" v-for="item in approveTableList" :key="item.id">
              <tr>
                <td>
                  <p>{{item.alitmAccount}}</p>
                  <p><img :src="item.creditLevel" alt="" style="width: auto;height: auto;"></p>
                  <p v-if="item.tqz">淘气值：{{item.tqz}}</p>
                </td>
                <td>{{item.applyTime | dateFormat('YYYY-MM-DD hh:mm:ss')}}</td>
                <td class="registration">
                  <a @click="openNewTrialReportFunc(encryptionId(item.showkerId))">查看</a>
                  <!--<router-link :to="{ 'path': '/trial-report','query': {'q': encryptionId(item.showkerId)}}">-->
                    <!--查看-->
                  <!--</router-link>-->
                </td>
                <td>{{getTaskStatus(item.status)}}</td>
                <td>
                  <p class="del-edit">
                    <span @click="showkerPassAudit(item.id, 'true')">通过</span>
                  </p>
                </td>
              </tr>
              </tbody>
              <tbody v-if="approveTableList.length === 0">
              <tr>
                <td colspan="5" width="100%">暂无数据</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--已通过-->
        <div class="fail-audit mt-20" v-show="showApproveStatus === 'passAudit'">
          <iSelect v-model="selectStatus" style="width: 120px;margin-right: 12px;">
            <iOption v-for="item in SelectList" :value="item.value" :key="item.value">{{ item.label }}</iOption>
          </iSelect>
          <iInput v-model="searchValue" style="width: 160px;margin-right: 8px;"></iInput>
          <span>订单编号：</span>
          <iInput v-model="orderNum" style="width: 160px;margin-right: 8px;"></iInput>
          <iButton type="primary" :loading="searchLoading" @click="searchTaskApplyList">搜索</iButton>
          <div class="clear mt-20">
            <div class="left mr-10" style="margin-top: 2px;">
              <Checkbox
                :value="checkAllByPass"
                @click.prevent.native="handleCheckPassAll">所有
              </Checkbox>
            </div>
            <div class="left">
              <Checkbox-group v-model="auditStatusList" @on-change="checkPassChange">
                <Checkbox label="pass_and_unclaimed">
                  <span>已通过待下单</span>
                </Checkbox>
                <Checkbox label="order_num_waiting_audit">
                  <span>订单号待审核</span>
                </Checkbox>
                <Checkbox label="trial_report_waiting_submit">
                  <span>已下订单待交买家秀</span>
                </Checkbox>
                <Checkbox label="trial_report_waiting_confirm">
                  <span>买家秀待确认</span>
                </Checkbox>
                <Checkbox label="trial_finished">
                  <span>活动完成</span>
                </Checkbox>
                <Checkbox label="order_num_error">
                  <span>订单信息有误</span>
                </Checkbox>
                <Checkbox label="trial_report_unqualified">
                  <span>买家秀不合格</span>
                </Checkbox>
              </Checkbox-group>
            </div>
          </div>
          <div class="activity-table mt-20">
            <table>
              <thead>
              <tr>
                <th width="25%">淘宝账号（旺旺号）</th>
                <th width="20%">状态</th>
                <th width="25%">订单号</th>
                <th width="10%">实付金额（元）</th>
                <th width="20%">操作</th>
              </tr>
              </thead>
              <tbody v-if="approveTableList.length > 0" v-for="item in approveTableList" :key="item.id">
              <tr>
                <td>
                  <p>{{item.alitmAccount}}</p>
                  <p><img :src="item.creditLevel" alt="" style="width: auto; height: auto;"></p>
                  <p v-if="item.tqz">淘气值：{{item.tqz}}</p>
                </td>
                <td>
                  <p v-if="item.status === 'order_num_error' || item.status === 'trial_report_unqualified'">
                    <Tooltip
                      :content="item.auditDescription"
                      placement="top" class="cursor-p">
                      <Icon color="#f9284f" type="md-alert"></Icon>
                      <span class="main-color">{{getTaskStatus(item.status)}}</span>
                    </Tooltip>
                  </p>
                  <p v-if="item.status !== 'order_num_error' && item.status !== 'trial_report_unqualified'">{{getTaskStatus(item.status)}}</p>
                  <p v-if="item.status !== 'trial_end' && item.status !== 'trial_finished'">
                    <time-down color='#ff4040' :fontWeight=600 :endTime="item.currentGenerationEndTime"></time-down>
                  </p>
                </td>
                <td>{{item.orderNum || '------'}}</td>
                <td>{{(item.orderPrice / 100).toFixed(2)}}</td>
                <td>
                  <p class="del-edit">
                    <span v-if="item.status === 'order_num_waiting_audit'" @click="openCheckOrder(item.id, item.needBrowseCollectAddCart, item.itemIssue)">审核订单信息</span>
                    <span v-if="item.status === 'trial_report_waiting_confirm'" @click="goProbationReport(item.id)">审核买家秀</span>
                    <span v-if="item.status === 'trial_finished' && !item.ifEvaluated" @click="getShowkerReportInfo(item.id,item.alitmAccount)">评价拿手</span>
                    <span v-if="item.status !== 'order_num_waiting_audit' && item.status !== 'trial_report_waiting_confirm' && !(item.status === 'trial_finished' && !item.ifEvaluated)">------</span>
                  </p>
                </td>
              </tr>
              </tbody>
              <tbody v-if="approveTableList.length === 0">
              <tr>
                <td colspan="5" width="100%">暂无数据</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--已终止-->
        <div class="pass-audit mt-20" v-show="showApproveStatus === 'failAudit'">
          <iSelect v-model="selectStatus" style="width: 120px;margin-right: 12px;">
            <iOption v-for="item in SelectList" :value="item.value" :key="item.value">{{ item.label }}</iOption>
          </iSelect>
          <iInput v-model="searchValue" style="width: 160px;margin-right: 8px;"></iInput>
          <span>订单编号：</span>
          <iInput v-model="orderNum" style="width: 160px;margin-right: 8px;"></iInput>
          <iButton type="primary" :loading="searchLoading" @click="searchTaskApplyList">搜索</iButton>
          <div class="clear mt-20">
            <div class="left mr-10" style="margin-top: 2px;">
              <Checkbox
                :value="checkAllByFail"
                @click.prevent.native="handleCheckFailAll">所有
              </Checkbox>
            </div>
            <div class="left">
              <Checkbox-group v-model="endReasonList" @on-change="checkFailChange">
                <Checkbox label="timeout_auto_close">
                  <span>逾期系统终止</span>
                </Checkbox>
                <Checkbox label="buyer_manual_close">
                  <span>拿手放弃活动</span>
                </Checkbox>
                <Checkbox label="seller_manual_close">
                  <span>管理员终止/商家终止</span>
                </Checkbox>
              </Checkbox-group>
            </div>
          </div>
          <div class="activity-table mt-20">
            <table>
              <thead>
              <tr>
                <th width="20%">淘宝账号（旺旺号）</th>
                <th width="20%">订单号</th>
                <th width="20%">活动状态</th>
                <th width="20%">审批时间</th>
                <th width="20%">终止原因</th>
              </tr>
              </thead>
              <tbody v-if="approveTableList.length > 0" v-for="item in approveTableList" :key="item.id">
              <tr>
                <td>
                  <p>{{item.alitmAccount}}</p>
                  <p><img :src="item.creditLevel" alt="" style="width: auto; height: auto;"></p>
                  <p v-if="item.tqz">淘气值：{{item.tqz}}</p>
                </td>
                <td>{{item.orderNum || '------'}}</td>
                <td>{{getTaskStatus(item.status)}}</td>
                <td>{{item.updateTime | dateFormat('YYYY-MM-DD hh:mm:ss')}}</td>
                <td>{{getTaskStatus(item.trialEndReason)}}</td>
              </tr>
              </tbody>
              <tbody v-if="approveTableList.length === 0">
              <tr>
                <td colspan="5" width="100%">暂无数据</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="activity-page mt-20 right mr-10" v-if="approveTableList && approveTableList.length > 0">
        <Page :total="totalElements" :page-size="pageSize" :current="pageIndex" @on-change="pageChange"></Page>
      </div>
      <!--审核订单号弹窗-->
      <div class="check-order-model" v-if="showCheckOrder">
        <div class="check-order-con">
          <i class="right" @click="showCheckOrder = false">&times;</i>
          <div class="f-b fs-14 main-color mt-28" v-if="needBrowseCollectAddCart || needIssue">1.请查看拿手提交的截图信息</div>
          <div class="clear">
            <!--<div class="left" v-if="needBrowseCollectAddCart">
              <div class="mt-5 cl00 fs-12 f-b">A.查看拿手提交的收藏加购截图</div>
              <div class="order-info-screenshot mt-5" v-for="(value, key) in orderInfo.screenshot" :key="key" v-if="value">
                <img :src="value + '!thum54'" alt="收藏加购截图">
                <div class="order-info-screenshot-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(value,key)"></Icon>
                </div>
              </div>
            </div>-->
            <!--<div class="left parting-line" v-if="needIssue"></div>-->
            <div class="left ml-10" v-if="needIssue">
              <div class="mt-5 cl00 fs-12 f-b"><!--<span>{{needIssue ? 'B.' : 'A.'}}</span>-->查看拿手提交的浏览答题截图</div>
              <div class="order-info-screenshot mt-5" v-for="(item, index) in orderInfo.issueAnswerScreenshot" :key="index" v-if="item">
                <img :src="item.screenshotSrc + '!thum54'" alt="浏览答题截图">
                <div class="order-info-screenshot-cover">
                  <Icon type="ios-eye-outline" @click.native="handleViewIssue(item.screenshotSrc,item.issueText)"></Icon>
                </div>
              </div>
            </div>
          </div>
          <div class="f-b fs-14 main-color mt-10"><span v-if="needBrowseCollectAddCart || needIssue">2.</span>请仔细核对订单号与交易金额</div>
          <div class="order-info-con text-lf mt-10">
            <p>
              <span class="f-b">订单号：</span>
              <span class="main-color">{{orderInfo.orderNum}}</span>
            </p>
            <p class="mt-10">
              <span><span class="f-b">拿手实付金额：</span><span class="main-color">{{orderInfo.orderPrice || 0}}</span>元<span>（当前每单活动担保金<span>{{orderInfo.perMarginNeed}}</span>元）</span></span>
            </p>
          </div>
          <p class="cl-red mt-10 text-ct" v-if="orderInfo.orderPrice < orderInfo.perMarginNeed"><Icon type="md-alert" color="red" size="14" class="mr-5"></Icon>注意：拿手实付金额与活动担保金金额不一致，请仔细审核！</p>
          <p class="cl-red mt-10 text-ct" v-else><Icon type="md-alert" color="red" size="14" class="mr-5"></Icon>注意：为了防止不良拿手冒领担保金，请您仔细审核交易订单信息，确认不误再作提交！</p>
          <div class="mt-22 text-ct">
            <Radio-group v-model="orderReviewStatus">
              <Radio class="mr-30" label="passAudit">
                <span class="fs-16">通过</span>
              </Radio>
              <Radio label="failAudit">
                <span class="fs-16">不通过</span>
              </Radio>
            </Radio-group>
            <div class="no-pass-reason text-ct inline-block" v-show="orderReviewStatus === 'failAudit'">
              <i-select v-model="orderNoPassReason" style="width:200px" placeholder="请选择不通过原因">
                <!--<i-option value="收藏加购截图不合格">收藏加购截图不合格</i-option>-->
                <i-option value="浏览答题截图不合格">浏览答题截图不合格</i-option>
                <i-option value="订单信息有误">订单信息有误</i-option>
                <i-option value="实付金额有误">实付金额有误</i-option>
                <i-option value="下单旺旺和平台绑定旺旺不一致">下单旺旺和平台绑定旺旺不一致</i-option>
              </i-select>
            </div>
          </div>
          <div class="true-btn" v-show="orderReviewStatus === 'failAudit'" @click="orderNumberAudit">确认提交</div>
          <div class="true-btn" v-show="orderReviewStatus === 'passAudit' && orderInfo.perMarginNeed >= getOderPrice" @click="orderNumberAudit">确认提交</div>
          <PayModel v-show="orderReviewStatus === 'passAudit' && orderInfo.perMarginNeed < getOderPrice"
                    :orderMoney="needReplenishMoney" :isShowUpgradeVIP="true" :isBalance="isBalance"
                    @confirmPayment="confirmPayment" :payButtonText="payButtonText"
                    :rechargeButtonText="rechargeButtonText" style="margin-top: 120px;width: 652px;margin-left: -326px;"
                    :style="{top:needBrowseCollectAddCart ? 45+'%' : 20 +'%'}">
            <div slot="isBalance" class="title-tip">
                <span class="size-color3">
                <Icon color="#FF2424" size="18" type="md-alert"></Icon>
                <span class="ml-10">注意：该拿手实付金额大于活动担保金，</span></span>需要补充担保金<strong
              class="main-color">{{needReplenishMoney}}</strong>元
            </div>
            <div slot="noBalance" class="title-tip">
                <span class="size-color3">
                <Icon color="#FF2424" size="18" type="md-alert"></Icon>
                <span class="ml-10">注意：该拿手实付金额大于活动担保金，</span></span>需要补充担保金<strong
              class="main-color">{{needReplenishMoney}}</strong>元,请充值！
            </div>
          </PayModel>
        </div>
      </div>
      <!--收藏加购物和浏览答题截图查看-->
      <modal :title="checkScreenshotModleTitle" v-model="isShowCheckScreenshotModel">
        <img :src="checkScreenshotSrc + '!orgi75'" style="width: 100%">
      </modal>
      <!--评价秀客弹窗-->
      <Modal v-model="evaluateShowker" class="evaluate-showker-pop">
        <div class="pl-20 pr-20 mt-30">
          <div class="cl000">请对拿手<span class="main-color">{{evaluateShowkerAlitmAccount}}</span>进行评价<span class="cl666">(你的评价将决定该拿手的整体评分)：</span></div>
          <div class="pt-10 pb-10 evaluate-showker-pop-box mt-20">
            <p class="title">
              <Tooltip content="你感该拿手的淘号质量如何？" placement="top">
                <Icon type="help-circled"></Icon>
              </Tooltip>
              <span class="cl000">买号质量：</span>
            </p>
            <RadioGroup v-model="wwQuality">
              <Radio label="hao_ping"><img class="vtc-mid img" src="~assets/img/common/haoping.png" alt=""><span class="ml-5">好评</span></Radio>
              <Radio label="zhong_ping"><img class="vtc-mid img" src="~assets/img/common/zhongping.png" alt=""><span class="ml-5">中评</span></Radio>
              <Radio label="cha_ping"><img class="vtc-mid img" src="~assets/img/common/chaping.png" alt=""><span class="ml-5">差评</span></Radio>
            </RadioGroup>
          </div>
          <div class="pt-10 pb-10 evaluate-showker-pop-box mt-10">
            <p class="title">
              <Tooltip content="该拿手有没有完全按照您的要求执行任务？" placement="top">
                <Icon type="help-circled"></Icon>
              </Tooltip>
              <span class="cl000">下单配合度：</span>
            </p>
            <RadioGroup v-model="fillOrderCooperate">
              <Radio label="hao_ping"><img class="vtc-mid img" src="~assets/img/common/haoping.png" alt=""><span class="ml-5">好评</span></Radio>
              <Radio label="zhong_ping"><img class="vtc-mid img" src="~assets/img/common/zhongping.png" alt=""><span class="ml-5">中评</span></Radio>
              <Radio label="cha_ping"><img class="vtc-mid img" src="~assets/img/common/chaping.png" alt=""><span class="ml-5">差评</span></Radio>
            </RadioGroup>
          </div>
          <div class="pt-10 pb-10 evaluate-showker-pop-box mt-10">
            <p class="title">
              <Tooltip content="该拿手提供的淘宝评价和晒图，是否满足您的要求？" placement="top">
                <Icon type="help-circled"></Icon>
              </Tooltip>
              <span class="cl000">买家秀质量：</span>
            </p>
            <RadioGroup v-model="buyerShowQuality">
              <Radio label="hao_ping"><img class="vtc-mid img" src="~assets/img/common/haoping.png" alt=""><span class="ml-5">好评</span></Radio>
              <Radio label="zhong_ping"><img class="vtc-mid img" src="~assets/img/common/zhongping.png" alt=""><span class="ml-5">中评</span></Radio>
              <Radio label="cha_ping"><img class="vtc-mid img" src="~assets/img/common/chaping.png" alt=""><span class="ml-5">差评</span></Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="pl-20 pr-20 mt-30 violation-labels">
          <div class="cl000">TA在任务过程中表现如何？</div>
          <div class="mt-10">
            <span v-for="(label,index) in violationLabelList" :key="index" :class="[label.selected ? 'selectActive' : '']" @click="selectLabel(label,index)">{{label.description}}</span>
          </div>
        </div>
        <div slot="footer" class="text-ct pb-20">
          <iButton class="pl-20 pr-20 btn" type="error" size="large" :loading="loading" @click="evaluateShowkerFun">确定提交</iButton>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {Checkbox, Page, Modal, Icon, Button, Input, Tooltip, Select, Option, OptionGroup, Radio} from 'iview'
  import PayModel from '@/components/PayModel'
  import TimeDown from '@/components/TimeDown'
  import api from '@/config/apiConfig'
  import {taskErrorStatusList, encryption, decode} from '@/config/utils'
  import commonConfig from '@/config/commonConfig'
  export default {
    name: 'approve-showker',
    components: {
      Checkbox: Checkbox,
      CheckboxGroup: Checkbox.Group,
      Page: Page,
      Modal: Modal,
      iButton: Button,
      Icon: Icon,
      iInput: Input,
      iSelect: Select,
      iOption: Option,
      OptionGroup: OptionGroup,
      Radio: Radio,
      RadioGroup: Radio.Group,
      TimeDown: TimeDown,
      PayModel: PayModel,
      Tooltip:Tooltip,
    },
    data() {
      return {
        evaluateShowker:false,
        wwQuality:'hao_ping',
        fillOrderCooperate:'hao_ping',
        buyerShowQuality:'hao_ping',
        isShowCheckScreenshotModel: false,
        checkScreenshotSrc: null,
        checkScreenshotModleTitle: null,
        needBrowseCollectAddCart: false,
        needIssue: false,
        wwFormValidate: {
          creditLevel: null,
          tqz: null,
        },
        aliLevelList: commonConfig.aliLevelList,
        aliTqzList: commonConfig.aliTqzList,
        applyName: null,
        viewScreenShotUrl: null,
        viewScreenShot: false,
        passOrNoPass: 'true',
        reason: null,
        showApproveStatus: 'toAudit',
        taskId: null,
        checkAllByPass: false,
        checkAllByFail: false,
        auditStatusList: [],
        endReasonList: [],
        pageIndex: 1,
        pageSize: 5,
        totalElements: 0,
        selectStatus: '2',
        searchValue: null,
        orderNum: null,
        approveTableList: [],
        approveTaskInfo: {},
        trailOn: 0,
        trailDone: 0,
        SelectList: [
          {
            value: '2',
            label: '淘宝会员名'
          }
        ],
        showCheckOrder: false,
        noPassReason: null,
        showRefundModel: false,
        refundPayPwd: null,
        orderReviewStatus: 'passAudit',
        orderNoPassReason: null,
        orderInfo: {},
        payButtonText: '确认支付并通过',
        rechargeButtonText: '前去充值',
        searchLoading: false,
        loading:false,
        showkerReportInfo:{},
        evaluateShowkerAlitmAccount:null,
        violationLabelList:[],
        selectedLabelList:[]
      }
    },
    created() {
      this.taskId = decode(this.$route.query.q);
      this.showApproveStatus = this.ActivityStatus ? this.ActivityStatus : this.showApproveStatus;
      // this.showApproveStatus = "toAudit";
      this.taskApplyList();
      this.getViolationTag();
    },
    watch: {},
    computed: {
      getOderPrice() {
        let _this = this;
        if(_this.orderInfo.discountPrice && _this.orderInfo.discountPrice > 0){
         return _this.orderInfo.orderPrice - _this.orderInfo.discountPrice
        }else if(_this.orderInfo.discountRate && _this.orderInfo.discountRate > 0){
          return _this.orderInfo.orderPrice * (1 - _this.orderInfo.discountRate)
        } else {
          return _this.orderInfo.orderPrice
        }
      },
      needReplenishMoney() {
        return (this.getOderPrice - this.orderInfo.perMarginNeed).toFixed(2) * 1
      },
      getUserBalance() {
        return this.$store.getters.getUserBalance;
      },
      isBalance() {
        return this.needReplenishMoney <= this.getUserBalance
      },
      ActivityStatus() {
        return this.$store.state.activityStatus
      }
    },
    methods: {
      getShowkerReportInfo(id,alitmAccount){
        let self = this;
        self.evaluateShowkerAlitmAccount = alitmAccount;
        self.evaluateShowker = true;
        api.showkerTaskReport({id: id}).then(res => {
          if (res.status) {
            self.showkerReportInfo = res.data
          } else {
            self.$Message.error(res.msg);
          }
        });
      },
      evaluateShowkerFun(){
        let self = this;
        self.loading = true;
        api.evaluateFormSellerToShowker({
          showkerId: self.showkerReportInfo.showkerId,
          showkerAlitmAccount: self.evaluateShowkerAlitmAccount,
          taskId: self.showkerReportInfo.task.id,
          taskNum: self.showkerReportInfo.task.number,
          buyerQuality: self.buyerShowQuality,
          orderTone: self.fillOrderCooperate,
          trialReportQuality: self.wwQuality,
          showkerTaskId: self.showkerReportInfo.showkerTaskId,
          tagGradeJson:JSON.stringify(self.selectedLabelList)
        }).then( res => {
          if (res.status){
            self.evaluateShowker = false;
            self.$Message.success('评价成功！');
            self.loading = false;
            self.wwQuality= 'hao_ping';
            self.fillOrderCooperate = 'hao_ping';
            self.buyerShowQuality = 'hao_ping';
            self.violationLabelList.map(item=>{
              return item.selected = false
            });
            self.taskApplyList();
          }else {
            self.$Message.error(res.msg)
          }
        })
      },
      openNewTrialReportFunc(id){
        window.open('/trial-report?q='+ id);
      },
      encryptionId(id){
        return encryption(id)
      },
      viewScreenShotFun(type) {
        this.viewScreenShotUrl = type;
        this.viewScreenShot = true;
      },
      getTaskStatus(type) {
        return taskErrorStatusList(type);
      },
      pageChange(data) {
        this.pageIndex = data;
        this.taskApplyList();
      },
      handleCheckPassAll() {
        let _this = this;
        _this.checkAllByPass = !_this.checkAllByPass;
        if (_this.checkAllByPass) {
          _this.auditStatusList = ['pass_and_unclaimed', 'order_num_waiting_audit', 'trial_report_waiting_submit', 'trial_report_waiting_confirm', 'trial_finished', 'order_num_error', 'trial_report_unqualified'];
        } else {
          _this.auditStatusList = [];
        }
        _this.pageIndex = 1;
        _this.taskApplyList();
      },
      handleCheckFailAll() {
        let _this = this;
        _this.checkAllByFail = !_this.checkAllByFail;
        if (_this.checkAllByFail) {
          _this.endReasonList = ['timeout_auto_close', 'buyer_manual_close', 'seller_manual_close'];
        } else {
          _this.endReasonList = [];
        }
        _this.pageIndex = 1;
        _this.taskApplyList();
      },
      checkPassChange() {
        let _this = this;
        if (_this.auditStatusList.length === 7) {
          _this.checkAllByPass = true;
        } else if (_this.auditStatusList.length > 0) {
          _this.checkAllByPass = false;
        } else {
          _this.checkAllByPass = false;
        }
        _this.pageIndex = 1;
        _this.taskApplyList();
      },
      checkFailChange() {
        let _this = this;
        if (_this.endReasonList.length === 3) {
          _this.checkAllByFail = true;
        } else if (_this.endReasonList.length > 0) {
          _this.checkAllByFail = false;
        } else {
          _this.checkAllByFail = false;
        }
        _this.pageIndex = 1;
        _this.taskApplyList();
      },
      changeTitle(type) {
        this.showApproveStatus = type;
        this.taskApplyList();
      },
      searchTaskApplyList() {
        this.pageIndex = 1;
        this.taskApplyList();
      },
      taskApplyList() {
        let _this = this;
        _this.approveTableList = [];
        _this.searchLoading = true;
        api.getTaskApplyList({
          taskId: _this.taskId || null,
          status: _this.showApproveStatus,
          selectStatus: _this.selectStatus,
          searchValue: _this.searchValue,
          orderNum: _this.orderNum,
          tqz: _this.wwFormValidate.tqz,
          creditLevel: _this.wwFormValidate.creditLevel,
          endReasonList: JSON.stringify(_this.endReasonList),
          auditStatusList: JSON.stringify(_this.auditStatusList),
          pageIndex: _this.pageIndex,
          pageSize: _this.pageSize
        }).then(res => {
          if (res.status) {
            _this.searchLoading = false;
            _this.approveTableList = res.data.content;
            _this.approveTaskInfo = res.data.taskInfo;
            _this.totalElements = res.data.totalElements;
          } else {
            _this.$Message.error(res.msg);
          }
        })
      },
      showkerPassAudit(id, status, reason) {
        this.setShowkerAudit(id, status, reason);
      },
      setShowkerAudit(id, status, reason) {
        let _this = this;
        api.setTaskShowkerPass({
          id: id,
          status: status,
          reason: reason || null
        }).then(res => {
          if (res.status) {
            _this.$Message.success("审核拿手成功！");
            _this.approvalPop = false;
            _this.taskApplyList();
          } else {
            _this.$Message.error(res.msg)
          }
        })
      },
      closeRefundModel() {
        this.showRefundModel = false;
      },
      openRefundModel() {
        this.showRefundModel = true;
      },
      closeCheckOrder() {
        this.showCheckOrder = false;
      },
      openCheckOrder(id, needBrowseCollectAddCart, itemIssue) {
        let _this = this;
        _this.needIssue = itemIssue;
        // _this.needBrowseCollectAddCart = needBrowseCollectAddCart;
        _this.needBrowseCollectAddCart = false;
        _this.showCheckOrder = true;
        api.orderNumberInfo({
          id: id
        }).then(res => {
          if (res.status) {
            _this.orderInfo = res.orderInfo;
          }else{
            _this.$Message.error(res.msg)
          }
        })
      },
      confirmPayment(pwd) {
        let _this = this;
        api.depositSupplement({
          payPassword: pwd,
          taskId: _this.orderInfo.id
        }).then(res => {
          if (res.status) {
            _this.$store.dispatch('getUserInformation');
            _this.showCheckOrder = false;
            _this.$Message.success('支付成功！');
            _this.taskApplyList();
          } else {
            _this.$Message.error(res.msg)
          }
        })
      },
      goProbationReport(id) {
        this.$router.push({name: 'ProbationReport', query: {id: encryption(id)}});
      },
      orderNumberAudit() {
        let _this = this;
        if (_this.orderReviewStatus === 'failAudit' && !_this.orderNoPassReason) {
          _this.$Message.error("亲，请填写不通过的理由！");
          return
        }
        api.orderNumberAudit({
          id: _this.orderInfo.id,
          status: _this.orderReviewStatus === 'passAudit' ? 'true' : 'false',
          msg: _this.orderNoPassReason
        }).then(res => {
          if (res.status) {
            _this.$Message.success('订单号审核成功！');
            _this.$store.dispatch('getUserInformation');
            _this.taskApplyList();
            _this.closeCheckOrder();
          } else {
            _this.$Message.error(res.msg);
            _this.closeCheckOrder();
          }
        })
      },
      handleViewIssue(value, key) {
        let _this = this;
        _this.isShowCheckScreenshotModel = true;
        _this.checkScreenshotSrc = value;
        _this.checkScreenshotModleTitle = '浏览答题截图：（'+ key + '）';
      },
      handleView(value, key) {
        let _this = this;
        _this.isShowCheckScreenshotModel = true;
        _this.checkScreenshotSrc = value;
        switch (key) {
          case 'addToCart':
            _this.checkScreenshotModleTitle = '加入购物车截图';
            break;
          case 'enshrine':
            _this.checkScreenshotModleTitle = '加入收藏夹截图';
            break;
          case 'itemLocation':
            _this.checkScreenshotModleTitle = '宝贝所在位置截图';
            break;
          case 'searchCondition':
            _this.checkScreenshotModleTitle = '宝贝搜索条件置截图';
            break;
        }
      },
      // 选择违规标签
      selectLabel(label,index) {
        const _this = this;
        let isSelected = _this.violationLabelList[index].selected;
        _this.violationLabelList[index].selected = !isSelected;
        if (isSelected) {
          let tempIndex = _this.selectedLabelList.findIndex( item => {
            return item === label.tagGrade;
          });
          _this.selectedLabelList.splice(tempIndex,1);
        } else {
          _this.selectedLabelList.push(label.tagGrade);
        }
      },
      //获取违规标签
      getViolationTag() {
        const _this = this;
        api.getViolationTag({
          state:true
        }).then(res => {
          if (res.status) {
            let tempDate = res.data;
            let tempList = [];
            tempDate.forEach(item => {
              item.selected = false;
              tempList.push(item);
            });
            _this.violationLabelList = tempList;
          } else {
            _this.$Message.error(res.msg);
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import 'src/css/mixin';
  .evaluate-showker-pop{
    .evaluate-showker-pop-box{
      border: 1px solid #eee;
      background-color: #F8F8F8;
    }
    .title{
      display: inline-block;
      width: 120px;
      text-align: right;
    }
    .img {
      transform: translateY(-1px);
    }
    .btn{
      width: 200px;
    }
  }
  .violation-labels {
    span{
      margin-top:10px;
      margin-right:10px;
      display: inline-block;
      padding:5px 10px;
      border:1px solid #dddee1;
      border-radius: 5px;
      background-color: #f7f7f7;
      cursor: pointer;
      &:hover{
        color:$mainColor;
        border-color:$mainColor;
      }
    }
    .selectActive {
      color:$mainColor;
      border-color:$mainColor;
    }
  }
</style>
