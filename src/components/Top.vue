<template>
  <div class="home">
    <top-tip/>
    <div class="home-top">
      <div class="container clear">
        <router-link  to="/" class="left mt-20">
          <img v-if="!isLogin || getUserInfoRole === 1" src="~assets/img/common/top-logo-sj.png" alt="" >
          <img v-if="isLogin && getUserInfoRole === 0" src="~assets/img/common/top-logo-xk.png" alt="" >
        </router-link >
        <div class="left">
          <div class="search-box">
            <div class="pos-rel">
              <div>
                <span class="active">宝贝</span>
              </div>
              <i class="ivu-icon ivu-icon-ios-search"></i>
              <input type="text" class="search-btn left" v-model="searchKey" @keydown="goKeyEnterFunc" autocomplete="off"/>
              <a @click="goTaskCategory" class="search left">搜索</a>
            </div>
          </div>
        </div>
        <div class="left text-ct cl666 vrtext ml-20">
          <p>关注微信公众号</p>
          <p>获取最新评测商品</p>
        </div>
        <img src="~assets/img/common/vrcode.jpg" alt="" width="54" height="54" class="left vrcode ml-10">
         <!--<a v-if="searchRight.adUrl" :href="searchRight.adUrl" class="seller-guide left" target="_blank">-->
           <!--<img :src="searchRight.adImg | imageSrc('!orgi75')" alt="广告图片">-->
         <!--</a>-->
      </div>
    </div>
    <div class="home-nav">
      <div class="container">
        <div class="top-category">
          <p class="cursor-p text-ct">
            <icon type="navicon" size="20" class="mt" style="margin-top: 2px"/>
            <span class="ml-5">宝贝类目</span>
          </p>
          <ul class="top-category-list" v-if="$store.state.showTopCategoryRes">
            <li v-for="item in commodityCategoriesList" :key="item.id"
                :class="[taskCategoryActive === item.id ? 'active' : '']"
                :style="{padding: isLogin ? '4px 0' : '6px 0'}"
                @click="selTaskCategoryActiveFunc(item)">
              <img width="16" height="16" :src="nvaImgSrc[item.id]">
              <span class="ml-5">{{item.name}}</span>
            </li>
            <li :class="[taskCategoryActive === 'all' ? 'active' : '']" @click="selTaskCategoryAllFunc">
              <img src="/static/img/nav-picture/home_26.png" width="16" height="16">
              <span class="ml-5">全部活动</span>
            </li>
          </ul>
        </div>
        <div class="home-nav-list clear">
          <a :class="[activityCategory === 'home' ? 'active' : '']" @click="selTaskCategoryHome">首页</a>
          <!--<a :class="[activityCategory === 'free_get' ? 'active' : '']" @click="selTaskCategoryFunc('free_get')" >-->
            <!--<tooltip :content="`新增商品${parseInt(platformData.newCommodity / 4) || 0}件`" placement="bottom">-->
              <!--好货精选-->
            <!--</tooltip>-->
          <!--</a>-->
          <a :class="[activityCategory === 'present_get' ? 'active' : '']" @click="selTaskCategoryFunc('present_get')" >
            <!--<i style="position: absolute; top: -16px; left: 13px;">-->
              <!--<img src="/static/img/icon/giveaway.gif" alt="" >-->
            <!--</i>-->
            <tooltip :content="`新增商品${parseInt(platformData.newCommodity / 4 * 3) || 0}件`" placement="bottom">
              人气评测
            </tooltip>
          </a>
          <a :class="[activityCategory === 'buyer-show' ? 'active' : '']" @click="linkToBuyerShow('buyer-show')">
            <i style="position: absolute; top: -17px; left: 34px;">
              <img src="/static/img/common/news.gif" alt="" >
            </i>
            买家秀
          </a>
          <!--<a :class="[activityCategory === 'task-fans' ? 'active' : '']" @click="linkToTaskFans('task-fans')" v-if="isLogin && userRole == 1">-->
            <!--<i style="position: absolute; top: -17px; left: 34px;">-->
              <!--<img src="~assets/img/icon/advance.gif" alt="new" >-->
            <!--</i>-->
            <!--微信加粉-->
          <!--</a>-->
          <!--<a :class="[activityCategory === 'release-good' ? 'active' : '']" @click="linkToReleaseGood('release-good')" v-if="isLogin && userRole == 1">-->
            <!--<i style="position: absolute; top: -17px; left: 34px;">-->
              <!--<img src="/static/img/common/news.gif" alt="" >-->
            <!--</i>-->
            <!--白拿拿商城-->
          <!--</a>-->
        </div>
        <!--<div class="merchant-entering right" @click="toLandingPage">-->
          <!--<span class="merchant-entering-icon icon-size"></span>-->
          <!--商家入驻-->
        <!--</div>-->
      </div>
    </div>
  </div>

</template>

<script>
  import {Tooltip, Button, Icon} from 'iview'
  import TopTip from '@/components/TopTip'
  import api from '@/config/apiConfig'
  import {aliCallbackImgUrl} from '@/config/env'
  export default {
    name: 'top',
    components: {
      TopTip: TopTip,
      iButton: Button,
      Icon: Icon,
      Tooltip: Tooltip,
    },
    data () {
      return {
        searchKey: '',
        navList: [],
        nvaImgSrc:{
          100: '/static/img/nav-picture/home_07.png',
          200: '/static/img/nav-picture/home_09.png',
          300: '/static/img/nav-picture/home_11.png',
          400: '/static/img/nav-picture/home_13.png',
          500: '/static/img/nav-picture/home_15.png',
          600: '/static/img/nav-picture/home_22.png',
          700: '/static/img/nav-picture/home_23.png',
          800: '/static/img/nav-picture/home_24.png',
          900: '/static/img/nav-picture/home_25.png',
          1000: '/static/img/nav-picture/home_27.png',
        },
        searchRight: {
          adImg: null,
          adUrl: null,
        }
      }
    },
    created(){
      this.getSearchRightInfo();
    },
    computed: {
      isLogin() {
        return this.$store.state.login
      },
      getUserInfoRole() {
        return this.$store.getters.getUserRole
      },
      taskCategoryActive() {
        return this.$store.state.TaskCategoryActive
      },
      activityCategory() {
        return this.$store.state.activityCategory
      },
      commodityCategoriesList() {
        return this.$store.getters.getCommodityCategoriesList
      },
      userRole() {
        return this.$store.state.userInfo.role;
      },
      platformData() {
        return this.$store.state.platformData;
      }
    },
    methods: {
      linkToTaskFans(activityCategory) {
        this.$router.push({ 'path': '/user/task-fans'});
        this.$store.commit({
          type: 'SET_ACTIVITY_CATEGORY',
          info: activityCategory
        });
        this.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: activityCategory
        });
      },
      linkToReleaseGood(activityCategory) {
        this.$router.push({ 'path': '/user/release-good'});
        this.$store.commit({
          type: 'SET_ACTIVITY_CATEGORY',
          info: activityCategory
        });
        this.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: activityCategory
        });
      },
      linkToBuyerShow(activityCategory) {
        this.$router.push({ 'path': '/buyer-show'});
        this.$store.commit({
          type: 'SET_ACTIVITY_CATEGORY',
          info: activityCategory
        });
        this.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: activityCategory
        });
      },
      getSearchRightInfo() {
        const _this = this;
        api.getAvailableBoardByAdTypeList({advertType: 'pc_top_search_right'}).then(res => {
          if (res.data.length > 0) {
            _this.searchRight.adImg = aliCallbackImgUrl + res.data[0].adImg;
            _this.searchRight.adUrl = res.data[0].adUrl;
          }
        })
      },
      selTaskCategoryHome(){
        let self = this;
        self.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: 'home'
        });
        self.$store.commit({
          type: 'SET_ACTIVITY_CATEGORY',
          info: 'home'
        });
        self.$router.push({ 'path': '/'});
      },
      selTaskCategoryFunc(activityCategory){
        let self = this;
        self.$router.push({ 'path': '/task-category', 'query': {'activityCategory' : activityCategory}});
        self.$store.commit({
          type: 'SET_ACTIVITY_CATEGORY',
          info: activityCategory
        });
        self.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: activityCategory
        });
      },
      selTaskCategoryAllFunc(){
        let self = this;
        self.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: 'all'
        });
        self.$router.push({ 'path': '/task-category', 'query': {'category': 'all', 'categoryId': 'all'}});
      },
      selTaskCategoryActiveFunc(nav){
        let self = this;
        self.$router.push({ 'path': '/task-category', 'query': {'cate': nav.id, 'categoryId': nav.id}});
        self.$store.commit({
          type: 'SET_DISCOUNT_TASK_CATEGORY',
          result: false
        });
        self.$store.commit({
          type: 'TASK_CATEGORY_LIST',
          info: 'all',
        });
      },
      goKeyEnterFunc(ev){
        if(ev.keyCode === 13){
          this.goTaskCategory()
        }
      },
      goTaskCategory(){
        let self = this;
        self.$store.commit({
          type: 'SET_ACTIVITY_CATEGORY',
          info: 'home'
        });
        if(self.searchKey){
          self.$router.push({ path: '/task-category', query: { searchKey: self.searchKey }})
        }else {
          self.$router.push({ 'path': '/task-category', 'query': {'category': 'all', 'categoryId': 'all'}});
        }
      },
      // toLandingPage() {
      //   this.$router.push({name:'SpreadLandingPage'});
      // },

    },
    watch: {
      '$route' (to, from) {
        let self = this;
        if(to.name === 'login'){
          self.searchKey = '';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/css/mixin';

  .home-top {
    height: 142px;
    background-color: #fff;
    > div {
      background-color: #fff;
      div.search-box {
        margin-left: 20px;
        margin-top: 60px;
        .search {
          display: inline-block;
          background-color: $mainColor;
          color: #fff;
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
        }
        .link-text {
          margin-top: 5px;
          a {
            color: #666;
            padding: 5px 1px;
            font-size: 13px;
          }
          a.active {
            color: $mainColor;
          }
        }
        > div.pos-rel {
          float: left;
          > div {
            position: absolute;
            top: -24px;
            left: 0;
            span {
              display: inline-block;
              height: 24px;
              width: 48px;
              text-align: center;
              background-color: #fff;
              color: $mainColor;
              line-height: 24px;
            }
            span.active {
              color: #fff;
              background-color: $mainColor;
            }
          }
        }
        i.ivu-icon-ios-search {
          position: absolute;
          top: 11px;
          left: 13px;
          font-size: 20px;
          color: #ccc;
          cursor: pointer;
        }
        i.ivu-icon-camera {
          position: absolute;
          top: 8px;
          right: 13px;
          font-size: 24px;
          color: #ccc;
          cursor: pointer;
        }
        input.search-btn {
          padding-left: 40px;
          padding-right: 40px;
          border: 3px solid $mainColor;
          height: 40px;
          outline: none;
          width: 400px;
        }
      }
      a.seller-guide{
        margin-top: 8px;
        margin-left: 6px;
        img{
          width: 100%;
        }
      }
    }
    .vrtext {
      padding-top: 62px;
    }
    .vrcode {
      margin-top: 52px;
    }
  }
  .seller-enter{
    background: rgb(225, 41, 30) url("/static/img/icon/seller-icon.png") no-repeat 6px 7px;
  }
  .phone-enter{
    background: rgb(225, 41, 30) url("/static/img/icon/phone-icon.png") no-repeat 6px 7px;
  }
  .seller-enter,.phone-enter{
    color: rgb(255, 255, 255);
    float: right;
    height: 30px;
    line-height: 30px;
    padding: 0 20px 0 30px;
    border-radius: 4px;
    margin-top: 6px;
  }
  .home-nav {
    height: 42px;
    clear: both;
    background-color: $mainColor;
    .top-category{
      position: relative;
      width: 190px;
      float: left;
      background-color: $mainColor;
      &:hover .top-category-list{
        display: block;
      }
      > p {
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        i{
          font-size: 20px;
          vertical-align: -1px;
        }
      }
      .top-category-list{
        position: absolute;
        background-color: #fff;
        width: 190px;
        z-index: 3;
        border: 2px solid #ff6633;
        border-top: none;
        height: 411px;
        display: none;
        padding: 5px 0;
        li{
          padding: 6px 0;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          line-height: 28px;
          &:hover{
            background-color: #fdebee;
          }
        }
      }
    }
    div.home-nav-list {
      background-color: $mainColor;
      float: left;
      a {
        float: left;
        width: 100px;
        text-align: center;
        font-size: 16px;
        height: 42px;
        line-height: 42px;
        color: #fff;
        position: relative;
        i{
          position: absolute;
          top: -7px;
          right: -6px;
          img{
            display: block;
          }
        }
        &:hover{
          background-color: #fd5474;
        }
      }
      a.active{
        background-color: #fd5474;
        border-left: 2px solid $mainColor;
        border-right:2px solid $mainColor;
      }
    }
    .merchant-entering {
      background: #F8F8F8;
      padding:5px 10px;
      color:$mainColor;
      border-radius: 3px;
      margin-right:100px;
      margin-top:7px;
      cursor: pointer;
      .icon-size {
        display: inline-block;
        width: 13px;
        height: 13px;
        background-size: 13px 13px;
        background-repeat: no-repeat;
        margin-right: 5px;
        transform: translateY(1px);
      }
      .merchant-entering-icon {
        background-image: url("~assets/img/userhome-merchant/store-bind-on.png");
      }
    }
  }

</style>
