<template>
  <div class="image-upload">
    <div class="image-upload-title f-b">活动截图上传</div>
    <div class="image-upload-area">
      <!--货比三家截图上传-->
      <div class="shop-compare clear" v-for="(similar,index) in similarImageList" :key="index">
        <p class="upload-type-title">货比3家（宝贝{{index + 1}}）<span>搜索过程中随意点击其他店铺的宝贝进行浏览，并上传浏览截图</span></p>
        <div class="upload-area left pos-rel" v-for="(item,index) in similar" :key="index">
          <upload key="otherShopImageList" class="upload"
                  :on-success="uploadSuccess"
                  :default-file-list="item.screenshotsList"
                  :on-remove="removeImage"
                  :format="['jpg','jpeg','png','gif','bmp']"
                  :max-size="1024"
                  name="task"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  type="drag"
                  :itemInfo="item.id">
            <div class="camera">
              <icon type="ios-camera" size="20"/>
            </div>
          </upload>
          <div class="pt-10 pb-5">{{item.title}}</div>
          <div class="review-image cursor-p" @click="previewImage(item)">查看示例图</div>
          <div class="tip-resubmit" v-if="item.status === 'waiting_modify'">重新提交</div>
        </div>
      </div>
      <!--主宝贝截图上传-->
      <div class="main-baby-screenshots clear" v-if="mainBabyImageList.length > 0">
        <p class="upload-type-title">主宝贝浏览截图 <span>搜索到目标宝贝，按要求截图并上传</span></p>
        <div class="upload-area left pos-rel" v-for="(item,index) in mainBabyImageList" :key="index">
          <upload key="mainBabyImageList" class="upload"
                  :on-success="uploadSuccess"
                  :default-file-list="item.screenshotsList"
                  :on-remove="removeImage"
                  :format="['jpg','jpeg','png','gif','bmp']"
                  :max-size="1024"
                  name="task"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  type="drag"
                  :itemIndex="item.id">
            <div class="camera">
              <icon type="ios-camera" size="20"/>
            </div>
          </upload>
          <div class="pt-10 pb-5">{{item.title}}</div>
          <div class="review-image cursor-p" @click="previewImage(item)">查看示例图</div>
          <div class="tip-resubmit" v-if="item.status === 'waiting_modify'">重新提交</div>
        </div>
      </div>
      <!--浏览答题截图上传-->
      <div class="main-baby-answer clear" v-if="mainBabyAnswerList.length > 0">
        <p class="upload-type-title">主宝贝浏览答题<span>在目标宝贝的详情页找到如下文案，并提供所在位置截图</span> <span class="review-image cursor-p" @click="previewAnswer = true">查看示例图</span></p>
        <div class="upload-area left" v-for="(item,index) in mainBabyAnswerList" :key="index">
          <div class="answer-title">{{item.title}}</div>
          <upload key="mainBabyAnswerList" class="upload mt-5"
                  :on-success="uploadAnswerSuccess"
                  :default-file-list="item.screenShotList"
                  :on-remove="removeImage"
                  :format="['jpg','jpeg','png','gif','bmp']"
                  :max-size="1024"
                  name="task"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  type="drag"
                  :itemIndex="item.id">
            <div class="camera">
              <icon type="ios-camera" size="20"/>
            </div>
          </upload>
        </div>
      </div>
    </div>
    <!--查看示例图弹窗-->
    <modal title="图片查看器" v-model="visible">
        <img :src="demoPictureSrc" v-if="visible" style="width: 100%">
      </modal>
    <!--查看浏览答题示例图-->
    <modal v-model="previewAnswer">
      <img src="~assets/img/common/answer_question_img.png" alt="浏览答题示例图">
    </modal>
  </div>
</template>

<script>
  import {Icon, Modal} from 'iview'
  import Upload from '@/components/Upload'
  import {aliCallbackImgUrl} from '@/config/env'
  import api from '@/config/apiConfig'
  import {extendDeep} from '@/config/utils'

  export default {
    name: "activity-screenshots-upload",
    components: {
      Icon: Icon,
      Upload: Upload,
      Modal: Modal
    },
    data() {
      return {
        visible: false,
        mainBabyImageList: [],
        mainBabyAnswerList: [],
        similarImageList: [],
        demoPictureSrc: '',
        previewAnswer: false,
        taskId: this.orderInfo.showkerTask.id
      }
    },
    props: {
      orderInfo: {
        type: Object,
        default() {
          return {}
        },
        required: true
      }
    },
    computed: {},
    created() {
      this.handleData();
    },
    methods: {
      handleFormatError(file) {
        this.$Modal.warning({
          title: '文件格式不正确',
          content: `图片 ${file.name} 格式不正确，请上传 jpg 或 jpeg 或 gif 或 bmp 格式的图片。`
        })
      },
      handleMaxSize(file) {
        this.$Modal.warning({
          title: '超出文件大小限制',
          content: `图片 ${file.name} 太大，不能超过 1M`
        })
      },
      // 增值服务截图上传成功回调
      uploadSuccess(res, itemId) {
        this.submitVasAnswer({src: aliCallbackImgUrl + res.name, id: itemId});
      },
      // 删除已上传的图片
      removeImage(file,info) {
        // info.answerScreenshot = [];
      },

      // 浏览答题截图上传成功回调
      uploadAnswerSuccess(res, itemId) {
        this.submitVasAnswer({src: aliCallbackImgUrl + res.name, id: itemId});
      },

      handleData() {
        const _this = this;
        // 主宝贝
        let mainVasSettingsMap = {};
        let similarVasSettingsMapList = [];
        _this.orderInfo.mainVasSettings.forEach(key => {
          mainVasSettingsMap[key.id] = key;
        });
        _this.orderInfo.similarVasSettings.forEach(listKey => {
          let similarVasSettingsMap = {};
          listKey.map(key => {
            similarVasSettingsMap[key.id] = key;
          });
          similarVasSettingsMapList.push(similarVasSettingsMap);
        });
        // 货比三家
        let mainShowkerTaskVasSettings = [];
        let similarShowkerTaskVasSettings = [];
        _this.orderInfo.showkerTaskVasSettings.forEach(key => {
          if (key.required) {
            key.screenshotsList = key.answerScreenshot ? [{src: key.answerScreenshot}] : [];
            if (key.itemType === 'main_item') {
              key.title = mainVasSettingsMap[key.vasConfigId].name;
              key.pcTipsPicture = mainVasSettingsMap[key.vasConfigId].pcTipsPicture;
              mainShowkerTaskVasSettings.push(key);
            } else {
              let similarShowkerTaskVasSettingsTemp = similarShowkerTaskVasSettings[key.itemIndex];
              if (!similarShowkerTaskVasSettingsTemp || similarShowkerTaskVasSettingsTemp.length === 0) {
                similarShowkerTaskVasSettingsTemp = [];
                similarShowkerTaskVasSettings[key.itemIndex] = [];
              }
              key.title = similarVasSettingsMapList[key.itemIndex][key.vasConfigId].name;
              key.pcTipsPicture = similarVasSettingsMapList[key.itemIndex][key.vasConfigId].pcTipsPicture;
              similarShowkerTaskVasSettingsTemp.push(key);
              similarShowkerTaskVasSettings[key.itemIndex] = similarShowkerTaskVasSettingsTemp;
            }
          }
        });
        // 处理浏览答题
        _this.orderInfo.issueAnswerList.forEach((item,index) => {
          item.index = index;
          item.src = '';
          item.screenShotList = item.screenShotList.length > 0 ? [{src:item.screenShotList[0]}] : [];
        });
        _this.mainBabyImageList = mainShowkerTaskVasSettings;
        _this.similarImageList = similarShowkerTaskVasSettings;
        _this.mainBabyAnswerList = _this.orderInfo.issueAnswerList;
      },
      // 提交增值服务答案（截图）
      submitVasAnswer(info) {
        const _this = this;
        api.submitVasAnswer({
          showkerTaskVasSettingsId: info.id,
          answerScreenshot: info.src,
          answer: ''
        }).then(res => {
          if (res.status) {
            _this.$Message.success('上传成功');
          } else {
            _this.$Message.error(res.msg)
          }
        })
      },
      // 提交浏览答题
      submitAnswer(info) {
        const _this = this;
        api.submitAnswerScreenshots({
          showkerTaskId: _this.taskId,
          issueIndex: info.index,
          issueAnswerScreenshot: info.src
        }).then(res => {
          if (res.status) {
            _this.$Message.success('上传成功');
          } else {
            _this.$Message.error(res.msg)
          }
        })
      },
      // 查看示例图
      previewImage(info) {
        this.demoPictureSrc = info.pcTipsPicture || info.appTipsPicture;
        this.visible = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/css/mixin';
  .image-upload-title {
    padding: 20px 0 10px 0;
    border-bottom: 2px solid #F6F6F6;
  }

  .image-upload-area {
    .upload-type-title {
      color: #495060;
      padding: 20px 0;
      span {
        margin-left: 20px;
        color: #999;
      }
      .review-image {
        color: #2b85e4;
      }
    }
    .upload-area {
      width: 100px;
      padding: 0 10px;
      text-align: center;
      .upload {
        margin-left: 10px;
      }
      .camera {
        width: 58px;
        height: 58px;
        line-height: 58px;
      }
      .tip-resubmit {
        color: #fff;
        background: $mainColor;
        text-align: center;
        position: absolute;
        top: 43px;
        left: 21px;
        width: 58px;
        font-size: 12px;
        border-radius: 0 0 5px 5px;
      }
    }
    .review-image {
      color: #2b85e4;
    }
    .answer-title {
      border-radius: 3px;
      background: #FDF5E0;
      display: inline;

    }
  }


</style>
