/**
 * Created by ycb on 2017/7/17.
 */
import * as types from './mutation-types'
import {setStorage, getStorage, removeStorage} from '@/config/utils'

export default {
  //退出登录后变更登录状态和清除localStorage用户信息
  [types.OUT_LOGIN](state) {
    state.login = false;
    state.userInfo = {};
    removeStorage("userInfo");
    removeStorage("token");
  },

  //登录成功后存储用户信息到localStorage和vuex
  [types.RECORD_USER_INFO](state, {info, token}) {
    state.userInfo = info;
    state.login = true;
    setStorage('userInfo', info);
    if (token) setStorage('token', token);
  },

  //页面刷新的时候从本地缓存获取用户信息数据存储到vuex
  [types.INIT_USER_INFO](state) {
    let initUserInfo = getStorage('userInfo');
    if (initUserInfo) {
      state.userInfo = initUserInfo;
      state.login = true;
    } else {
      state.userInfo = {};
      state.login = false;
    }
  },

  //获取当前服务器时间和客户端时间存储到vuex
  [types.GET_SEVER_TIME](state, {time}) {
    state.severTime = time ? new Date(time.severTime).getTime() : new Date().getTime();
    state.clientTime = time.clientTime;
  },

  //存储用户页面登录权限到vuex
  [types.LOG_IN_AUTHORITY](state, {logInAuthority}) {
    state.logInAuthority = logInAuthority;
  },

  //存储用户页面角色权限到vuex
  [types.ROLE_AUTHORITY](state, {roleAuthority}) {
    state.roleAuthority = roleAuthority;
  },

  //商家任务管理活动数量信息（活动总数量，新增待审批，订单号带审批，买家秀待确认）
  [types.TASK_MANAGEMENT_COUNT_INFO](state, {countInfo}) {
    state.taskManagementCountInfo = countInfo;
  },

  //页面头部是否显示
  [types.CHANGE_TOP_SHOW_HIDE](state, {status}) {
    state.topShow = status;
  },

  //页面底部是否显示
  [types.CHANGE_BOTTOM_SHOW_HIDE](state, {status}) {
    state.bottomShow = status;
  },

  //导航列表存入
  [types.TASK_CATEGORY_LIST](state, {info}) {
    state.TaskCategoryActive = info;
  },

  //拿手登录首页弹出微信弹窗
  [types.SET_WECHART_SHOW](state, {result}) {
    state.wechartShow = result;
  },

  [types.SET_WECHART_RES](state, {result}) {
    state.wechartRes = result;
  },

  [types.SET_DISCOUNT_TASK_CATEGORY](state, {result}) {
    state.disCountTaskCategory = result;
  },

  [types.SET_SHOW_TOP_CATEGORY_RES](state, {result}) {
    state.showTopCategoryRes = result;
  },

  [types.SET_ACTIVITY_CATEGORY](state, {info}) {
    state.activityCategory = info;
  },

  //系统配置信息
  [types.SYSTEM_CONFIG_INFORMATION](state, {result}) {
    state.sysConfigInfo = result;
  },

  //商家任务信息
  [types.SELLER_TASK_INFO](state, {result}) {
    state.sellerTaskInfo = result;
  },

  //商家是否有首发资格
  [types.TASK_CREATE_FAST_STATUS](state, {status}) {
    state.taskCreateFastStatus = status;
  },

  [types.COMMODITY_CATEGORIES_LIST] (state, {list}) {
    state.commodityCategoriesList = list
  },

  // 商家购买流量数量相关信息
  [types.FLOW_NUMBER_INFO] (state, {info}) {
    state.flowNumberInfo = info
  },

  // 补添流量时是否需要订购访客流量
  [types.NEED_ORDER_VISITOR_FLOW] (state, {status}) {
    state.needOrderVisitorFlow = status;
  },

  //首页平台相关数据（入驻商家，登录拿手，新增商品，送出商品数）
  [types.PLATFORM_DATA] (state, {result}) {
    state.platformData = result
  }


}
