<template xmlns="http://www.w3.org/1999/html">
  <div class="apply-before">
    <div class="choice-wangWang">
      <span class="serial-number">1</span>
      <h3 class="ml-20">选择活动旺旺号</h3>
      <div class="ml-20 mt-10">注意：请<span>务必使用选中的旺旺号完成浏览，收藏，加购</span>,否则资格审核将无法通过</div>
      <Radio-group v-model="selectedWw" class="ml-20 mt-10">
        <Radio v-for="ww in WwNumberLIst " :label="ww.id" :key="ww.id" :disabled="ww.status !==2">
          <span :class="[ww.status !=2 ? 'cl999':'']">{{ww.alitmAccount}}</span>
          <span v-if="wwState[ww.status].text"
                :class="[ww.status !=2 ? 'cl999':'']">({{wwState[ww.status].text}})</span>
        </Radio>
      </Radio-group>
    </div>
    <place-order-step v-if="Object.keys(taskDetail).length > 0" :showkerTaskInfo="taskDetail"></place-order-step>
    <div class="screen-shot mt-22 clear">
      <span class="serial-number">3</span>
      <h3>宝贝浏览见底、收藏、加入购物车，并提交相关截图</h3>
      <div class="mt-22 left">宝贝截图上传：</div>
      <div v-if="taskType === 'pc_search'" class="clear left center mt-20 ">
        <div class="left ml-10 ">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="searchConditionImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">搜索条件截图</p>
          <p class="mt-8 cursor-p example" @click="pcSearchSelectFun('one')">查看示例图</p>
        </div>
        <div class="left ml-20">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="itemLocationImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">所在位置截图</p>
          <p class="mt-8 cursor-p example" @click="pcSearchSelectFun('two')">查看示例图</p>
        </div>
        <div class="left ml-20">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="browseToBottomImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝浏览见底</p>
          <p class="mt-8 cursor-p example" @click="pcSearchSelectFun('three')">查看示例图</p>
        </div>
        <div class="left ml-20">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="enshrineImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入收藏夹</p>
          <p class="mt-8 cursor-p example" @click="pcSearchSelectFun('four')">查看示例图</p>
        </div>
        <div class="left ml-20">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="addToCartImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入购物车</p>
          <p class="mt-8 cursor-p example" @click="pcSearchSelectFun('five')">查看示例图</p>
        </div>
      </div>
      <div v-if="taskType === 'app_search'" class="clear left center mt-20 ">
        <div class="left ml-10">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="itemLocationImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">所在位置截图</p>
          <p class="mt-8 cursor-p example" @click="appSearchSelectFun('one')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="browseToBottomImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝浏览见底</p>
          <p class="mt-8 cursor-p example" @click="appSearchSelectFun('two')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="enshrineImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入收藏夹</p>
          <p class="mt-8 cursor-p example" @click="appSearchSelectFun('three')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="addToCartImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入购物车</p>
          <p class="mt-8 cursor-p example" @click="appSearchSelectFun('four')">查看示例图</p>
        </div>
      </div>
      <div v-if="taskType === 'tao_code'" class="clear left center mt-20 ">
        <div class="left ml-10">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="browseToBottomImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝浏览见底</p>
          <p class="mt-8 cursor-p example" @click="taoCodeSearchSelectFun('one')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="enshrineImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入收藏夹</p>
          <p class="mt-8 cursor-p example" @click="taoCodeSearchSelectFun('two')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="addToCartImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入购物车</p>
          <p class="mt-8 cursor-p example" @click="taoCodeSearchSelectFun('three')">查看示例图</p>
        </div>
      </div>
      <div v-if="taskType === 'direct_access'" class="clear left center mt-20 ">
        <div class="left ml-10">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="browseToBottomImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝浏览见底</p>
          <p class="mt-8 cursor-p example" @click="directAccessSearchSelectFun('one')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="enshrineImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入收藏夹</p>
          <p class="mt-8 cursor-p example" @click="directAccessSearchSelectFun('two')">查看示例图</p>
        </div>
        <div class="left ml-35">
          <Upload
            class="ml-5"
            ref="Upload"
            :show-upload-list="false"
            :default-file-list="mainDefaultList"
            :on-remove="removeMainImage"
            :on-success="addToCartImageFun"
            :format="['jpg','jpeg','png','gif','bmp']"
            :max-size="10240"
            name="task"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            type="drag">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p class="mt-8">宝贝加入购物车</p>
          <p class="mt-8 cursor-p example" @click="directAccessSearchSelectFun('three')">查看示例图</p>
        </div>
      </div>
    </div>
    <p class="descriptive">点击上传图片，支持jpg \ jpeg \ png \ gif \ bmp格式，不超过10M</p>
    <div class="text-ct mt-40">
      <iButton type="success" style="color: #fff;width: 150px;height: 30px;" @click="success(selectedWw)">提交申请</iButton>
      <iButton class="ml-20" style="width: 150px;height: 30px;" @click="error">取消</iButton>
    </div>
    <div style="z-index: 2000" v-if="divShow">
      <Modal v-model="pcSearch" title="照片查看器" width="1000" :styles="{top:'20px'}">
        <div v-if="pcSearchSelect.one">
          <img style="width: 900px;" src="~assets/img/screen-shot/select_type.jpg" alt="">
        </div>
        <div v-if="pcSearchSelect.two">
          <img style="width: 900px;" src="~assets/img/screen-shot/position_pc.jpg" alt="">
        </div>
        <div v-if="pcSearchSelect.three">
          <img style="width: 900px;" src="~assets/img/screen-shot/under_pc.jpg" alt="">
        </div>
        <div v-if="pcSearchSelect.four">
          <img style="width: 900px;" src="~assets/img/screen-shot/collect_pc.jpg" alt="">
        </div>
        <div v-if="pcSearchSelect.five">
          <img style="width: 900px;" src="~assets/img/screen-shot/shop_car_pc.jpg" alt="">
        </div>
      </Modal>
    </div>
    <div style="z-index: 2000" v-if="divShowApp">
      <Modal v-model="appSearch" title="照片查看器" width="560" :styles="{top:'20px'}">
        <div v-if="appSearchSelect.one">
          <img style="width: 500px;" src="~assets/img/screen-shot/position_app.png" alt="">
        </div>
        <div v-if="appSearchSelect.two">
          <img style="width: 500px;" src="~assets/img/screen-shot/under_app.jpg" alt="">
        </div>
        <div v-if="appSearchSelect.three">
          <img style="width: 500px;" src="~assets/img/screen-shot/collect_app.png" alt="">
        </div>
        <div v-if="appSearchSelect.four">
          <img style="width: 500px;" src="~assets/img/screen-shot/shop_car_app.png" alt="">
        </div>
      </Modal>
    </div>
    <div style="z-index: 2000" v-if="divShowTaoCode">
      <Modal v-model="taoCodeSearch" title="照片查看器" width="560" :styles="{top:'20px'}">
        <div v-if="taoCodeSearchSelect.one">
          <img style="width: 500px;" src="~assets/img/screen-shot/under_app.jpg" alt="">
        </div>
        <div v-if="taoCodeSearchSelect.two">
          <img style="width: 500px;" src="~assets/img/screen-shot/collect_app.png" alt="">
        </div>
        <div v-if="taoCodeSearchSelect.three">
          <img style="width: 500px;" src="~assets/img/screen-shot/shop_car_app.png" alt="">
        </div>
      </Modal>
    </div>
    <div style="z-index: 2000" v-if="divShowDirectAccess">
      <Modal v-model="directAccessSearch" title="照片查看器" width="1000" :styles="{top:'20px'}">
        <div v-if="directAccessSearchSelect.one">
          <img style="width: 900px;" src="~assets/img/screen-shot/under_pc.jpg" alt="">
        </div>
        <div v-if="directAccessSearchSelect.two">
          <img style="width: 900px;" src="~assets/img/screen-shot/collect_pc.jpg" alt="">
        </div>
        <div v-if="directAccessSearchSelect.three">
          <img style="width: 900px;" src="~assets/img/screen-shot/shop_car_pc.jpg" alt="">
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  import {Button, Modal, Radio, Icon} from 'iview'
  import Upload from '@/components/Upload'
  import PlaceOrderStep from '@/components/PlaceOrderStep'
  import {taskErrorStatusList} from '@/config/utils'
  import {aliCallbackImgUrl} from '@/config/env'
  import api from '@/config/apiConfig'

  export default {
    name: 'TaskApplyBefore',
    components: {
      iButton: Button,
      ButtonGroup: Button.Group,
      Modal: Modal,
      Radio: Radio,
      RadioGroup: Radio.Group,
      Upload: Upload,
      Icon: Icon,
      PlaceOrderStep: PlaceOrderStep

    },
    props: {
      taskDetail: {
        type: Object,
        default: {}
      },
      storeName: {
        type: String,
        default: null
      },
      taskTypeDesc: {
        type: String,
        default: null
      },
      WwNumberLIst: {
        default: null
      },
      taskType: {
        type: String,
        default: null
      },
      taskId: {
        default: null
      },
      itemUrl: {
        type: String,
        default: null
      },
      wwState: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        downloadButton: false,
        divShow: false,
        divShowApp: false,
        divShowTaoCode: false,
        divShowDirectAccess: false,
        selectedWw: null,
        pcDefaultList: [],
        mainDefaultList: [],
        upLoadImageUrl: {
          searchConditionImage: null,
          itemLocationImage: null,
          browseToBottomImage: null,
          enshrineImage: null,
          addToCartImage: null
        },
        payPopWindow: false,
        pcSearch: false,
        pcSearchSelect: {
          one: false,
          two: false,
          three: false,
          four: false,
          five: false
        },
        appSearch: false,
        appSearchSelect: {
          one: false,
          two: false,
          three: false,
          four: false,
        },
        taoCodeSearch: false,
        taoCodeSearchSelect: {
          one: false,
          two: false,
          three: false,
        },
        directAccessSearch: false,
        directAccessSearchSelect: {
          one: false,
          two: false,
          three: false,
        }
      }
    },
    computed: {},
    created() {},
    methods: {
      pcSearchSelectFun(type) {
        this.divShow = true;
        this.pcSearch = true;
        for (let k in this.pcSearchSelect) {
          k === type ? this.pcSearchSelect[k] = true : this.pcSearchSelect[k] = false;
        }
      },
      appSearchSelectFun(type) {
        this.divShowApp = true;
        this.appSearch = true;
        for (let k in this.appSearchSelect) {
          k === type ? this.appSearchSelect[k] = true : this.appSearchSelect[k] = false;
        }
      },
      taoCodeSearchSelectFun(type) {
        this.divShowTaoCode = true;
        this.taoCodeSearch = true;
        for (let k in this.taoCodeSearchSelect) {
          k === type ? this.taoCodeSearchSelect[k] = true : this.taoCodeSearchSelect[k] = false;
        }
      },
      directAccessSearchSelectFun(type) {
        this.divShowDirectAccess = true;
        this.directAccessSearch = true;
        for (let k in this.directAccessSearchSelect) {
          k === type ? this.directAccessSearchSelect[k] = true : this.directAccessSearchSelect[k] = false;
        }
      },
      //提交
      success(type) {
        this.selWwFunc(type);
      },
      error() {
        this.payPopWindow = null;
        this.$emit('request', this.payPopWindow);
      },
      removeMainImage() {

      },
      //获搜索条件截图片地址
      searchConditionImageFun(res) {
        this.upLoadImageUrl.searchConditionImage = aliCallbackImgUrl + res.name
      },
      //宝贝所在位置截图
      itemLocationImageFun(res) {
        this.upLoadImageUrl.itemLocationImage = aliCallbackImgUrl + res.name
      },
      //浏览见底截图
      browseToBottomImageFun(res) {
        this.upLoadImageUrl.browseToBottomImage = aliCallbackImgUrl + res.name
      },
      //收藏截图
      enshrineImageFun(res) {
        this.upLoadImageUrl.enshrineImage = aliCallbackImgUrl + res.name
      },
      //加入购物车截图
      addToCartImageFun(res) {
        this.upLoadImageUrl.addToCartImage = aliCallbackImgUrl + res.name
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
          content: '图片 ' + file.name + ' 太大，不能超过 10M'
        });
      },
      selWwFunc(alitms) {
        let self = this;
        if (alitms === null) {
          this.$Message.info({
            content: '请选择旺旺号',
          });
        } else {
          api.ShowkerApplySelWwId({
            wangwangId: self.selectedWw,
            taskId: self.taskId,
            searchCondition: self.upLoadImageUrl.searchConditionImage || null,
            itemLocation: self.upLoadImageUrl.itemLocationImage || null,
            browseToBottom: self.upLoadImageUrl.browseToBottomImage || null,
            enshrine: self.upLoadImageUrl.enshrineImage || null,
            addToCart: self.upLoadImageUrl.addToCartImage || null,
          }).then((res) => {
            if (res.status) {
              self.payPopWindow = false;
              self.$emit('request', self.payPopWindow);
            } else {
              self.$Message.error({
                content: res.msg,
                duration: 9
              });
            }
          })
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/css/mixin';

  .apply-before {
    .example {
      color: blue;
    }
    .choice-wangWang {
      padding: 10px;
      position: relative;
      .serial-number {
        position: absolute;
        top: 9px;
        left: 5px;
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background-color: #CCCCCC;
        text-align: center;
        line-height: 20px;
        color: #fff;
        font-size: 16px;
      }
    }
    .activity-type {
      padding: 10px 30px;
      position: relative;
      .serial-number {
        position: absolute;
        top: 9px;
        left: 5px;
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background-color: #CCCCCC;
        text-align: center;
        line-height: 20px;
        color: #fff;
        font-size: 16px;
      }
      .search-type {
        padding: 10px 0px;
        border-bottom: 1px solid #F9F9F9;
      }
      p {
        padding: 10px 0px;
      }
      .pic {
        /*display: block;*/
        width: 100px;
        height: 100px;
      }
    }
    .screen-shot {
      padding: 10px 30px;
      position: relative;
      .serial-number {
        position: absolute;
        top: 9px;
        left: 5px;
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background-color: #CCCCCC;
        text-align: center;
        line-height: 20px;
        color: #fff;
        font-size: 16px;
      }
      .center > div {
        text-align: center;
      }
    }
    .descriptive {
      margin-left: 125px;
      margin-top: 20px;
    }
  }
</style>

